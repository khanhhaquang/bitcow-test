import { Pool } from './Pool';
import { TokenInfo, Config, Quote, TxOption } from './types';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import { Contract, Provider, Signer } from 'ethers';
import { ABI_SWAP_ROUTER } from './abi/SwapRouter';
import { isBTC } from './utils';
import { CoinList } from './CoinList';
import { ContractRunner } from './ContractRunner';
import { ABI_SS_TRADING_PAIR_V1_LIST } from './abi/SsTradingPairV1List';
import { PoolCreator } from './PoolCreator';
import PromiseThrottle from 'promise-throttle';
import { parsePairStats } from './utils/statsV1';
import { log } from './utils/common';

export class Sdk extends ContractRunner {
    pools: Pool[] = [];
    coinList: CoinList;
    poolCreator: PoolCreator;
    private readonly routerContract: Contract;
    private tradingPairV1ListContract: Contract;
    private readonly promiseThrottle: PromiseThrottle;
    constructor(
        provider: Provider,
        public config: Config,
        requestsPerSecond: number,
        txOption?: TxOption,
        signer?: Signer
    ) {
        super(provider, txOption, signer);
        this.promiseThrottle = new PromiseThrottle({ requestsPerSecond: requestsPerSecond });
        this.coinList = new CoinList(
            provider,
            config.tokenList,
            this.promiseThrottle,
            config.tokensBalance,
            txOption,
            signer
        );
        this.poolCreator = new PoolCreator(provider, config.tradingPairV1Creator, txOption, signer);
        this.routerContract = new Contract(config.swapRouter, ABI_SWAP_ROUTER, provider);
        this.tradingPairV1ListContract = new Contract(config.tradingPairV1List, ABI_SS_TRADING_PAIR_V1_LIST, provider);
    }

    async fetchPoolsPaginate(start: number, paginateCount: number): Promise<{ pools: Pool[]; allCount: number }> {
        const pools: Pool[] = [];
        const promisePair = await this.tradingPairV1ListContract.fetchPairsStatsListPaginateV2(
            start,
            start + paginateCount
        );
        for (const pairStat of promisePair.pageStats) {
            pools.push(new Pool(this.provider, parsePairStats(pairStat), this.txOption, this.signer));
        }
        const allCount = parseFloat(promisePair.pairCount.toString());
        return { pools, allCount };
    }

    async reload(
        firstPaginateCount: number,
        paginateCount: number,
        callBack?: (pools: Pool[], allCount: number) => void
    ): Promise<Pool[]> {
        const isThisPoolsEmpty = this.pools.length === 0;
        let resultPools: Pool[] = [];
        log(`Fetch pools ${firstPaginateCount} after index ${0} `);
        const { pools, allCount } = await this.promiseThrottle.add(async () => {
            return this.fetchPoolsPaginate(0, firstPaginateCount);
        });

        callBack && callBack(pools, allCount);
        if (isThisPoolsEmpty) {
            this.pools = this.pools.concat(pools);
        } else {
            resultPools = resultPools.concat(pools);
        }
        if (pools.length < allCount) {
            const promise = [];
            for (let i = firstPaginateCount; i < allCount; i += paginateCount) {
                promise.push(async () => {
                    log(`Fetch pools ${paginateCount} after index ${i} of ${allCount}`);
                    const pools = await this.fetchPoolsPaginate(i, paginateCount);
                    if (isThisPoolsEmpty) {
                        this.pools = this.pools.concat(pools.pools);
                    } else {
                        resultPools = resultPools.concat(pools.pools);
                    }
                    callBack && callBack(isThisPoolsEmpty ? this.pools : resultPools, pools.allCount);
                });
            }
            await this.promiseThrottle.addAll(promise);
        }

        if (!isThisPoolsEmpty) {
            this.pools = resultPools;
        }
        log('Pools count ', this.pools.length);
        return resultPools;
    }
    async getTokensBalance(pageFetchCount: number, poolsLpTokenFirst = true) {
        let tokens;
        if (poolsLpTokenFirst) {
            tokens = this.pools
                .map((pool) => pool.pair.lpToken)
                .concat(this.coinList.getAllToken().map((token) => token.address));
        } else {
            tokens = this.coinList
                .getAllToken()
                .map((token) => token.address)
                .concat(this.pools.map((pool) => pool.pair.lpToken));
        }
        if (tokens.length == 1) {
            return undefined;
        }
        const balances = await this.coinList.getBalances(pageFetchCount, tokens);
        if (balances) {
            const userPoolLp: Record<string, bigint> = {};
            this.pools.forEach((pool) => {
                userPoolLp[pool.poolAddress] = balances[pool.lpAddress];
            });

            const userTokenBalances: Record<string, number> = {};
            this.coinList.getAllToken().forEach((token) => {
                userTokenBalances[token.address] = new BigNumber(balances[token.address].toString())
                    .div(10 ** token.decimals)
                    .toNumber();
            });
            return { userPoolLp, userTokenBalances };
        }
    }

    setSigner(signer?: Signer, address?: string) {
        super.setSigner(signer, address);
        this.coinList.setSigner(signer, address);
        this.pools.forEach((pool) => pool.setSigner(signer, address));
        this.poolCreator.setSigner(signer, address);
    }
    get swapRouter(): string {
        return this.config.swapRouter;
    }
    setTxOption(txOption?: TxOption) {
        this.txOption = txOption;
        for (const pool of this.pools) {
            pool.setTxOption(txOption);
        }
        this.coinList.setTxOption(txOption);
    }

    static async create(
        provider: Provider,
        config: Config,
        requestsPerSecond = 0.1,
        txOption?: TxOption,
        signer?: Signer
    ) {
        const sdk = new Sdk(provider, config, requestsPerSecond, txOption, signer);
        await sdk.reload(100, 140, (pools) => {});
        return sdk;
    }

    getDirectQuote(inputToken: TokenInfo, outputToken: TokenInfo, inAmt: number): Quote | undefined {
        let pool: Pool | undefined;
        let isReversed: boolean | undefined;
        const fromToken = inputToken;
        const toToken = outputToken;
        for (const pool_ of this.pools) {
            if (pool_.xToken.address === fromToken.address && pool_.yToken.address === toToken.address) {
                pool = pool_;
                isReversed = false;
            } else if (pool_.xToken.address === toToken.address && pool_.yToken.address === fromToken.address) {
                pool = pool_;
                isReversed = true;
            }
        }
        if (!pool) {
            return undefined;
        }
        pool = pool!;
        isReversed = isReversed!;
        const [inputMult, outputMult] = isReversed ? [pool.yMult, pool.xMult] : [pool.xMult, pool.yMult];
        const inputAmount = new BN(new BigNumber(inAmt).times(inputMult).toFixed(0));
        const outAmount = isReversed ? pool.quoteYtoX(inputAmount) : pool.quoteXtoY(inputAmount);
        const outAmt = new BigNumber(outAmount.toString()).div(outputMult).toNumber();
        return {
            inputToken,
            outputToken,
            inAmt,
            steps: [{ pool, isReversed, inAmt, outAmt, poolType: 0, fromToken: inputToken, toToken: outputToken }],
            outAmt
        };
    }

    getBest2HopQuote(inputToken: TokenInfo, outputToken: TokenInfo, inAmt: number): Quote | undefined {
        let bestQuote: Quote | undefined;
        const fromToken = inputToken;
        const toToken = outputToken;
        for (const mToken of this.coinList.tokens) {
            if (mToken.address === fromToken.address || mToken.address === toToken.address) {
                continue;
            }
            const inToM = this.getDirectQuote(fromToken, mToken, inAmt);
            if (!inToM) continue;
            const mToOut = this.getDirectQuote(mToken, toToken, inToM.outAmt);
            if (!mToOut) continue;
            if (!bestQuote || mToOut.outAmt > bestQuote.outAmt) {
                bestQuote = {
                    inputToken,
                    outputToken,
                    inAmt,
                    steps: inToM.steps.concat(mToOut.steps),
                    outAmt: mToOut.outAmt
                };
            }
        }
        return bestQuote;
    }

    getBest3HopQuote(inputToken: TokenInfo, outputToken: TokenInfo, inAmt: number): Quote | undefined {
        let bestQuote: Quote | undefined;
        const fromToken = inputToken;
        const toToken = outputToken;
        for (const mToken of this.coinList.tokens) {
            if (mToken.address === fromToken.address || mToken.address === toToken.address) {
                continue;
            }
            const inToM = this.getBest2HopQuote(fromToken, mToken, inAmt);
            if (!inToM) continue;
            const mToOut = this.getDirectQuote(mToken, toToken, inToM.outAmt);
            if (!mToOut) continue;
            if (!bestQuote || mToOut.outAmt > bestQuote.outAmt) {
                bestQuote = {
                    inputToken,
                    outputToken,
                    inAmt,
                    steps: inToM.steps.concat(mToOut.steps),
                    outAmt: mToOut.outAmt
                };
            }
        }
        return bestQuote;
    }

    getQuote(inputToken: TokenInfo, outputToken: TokenInfo, inAmt: number): Quote | undefined {
        const directQuote = this.getDirectQuote(inputToken, outputToken, inAmt);
        const twoHopQuote = this.getBest2HopQuote(inputToken, outputToken, inAmt);
        const threeHopQuote = this.getBest3HopQuote(inputToken, outputToken, inAmt);
        if (!directQuote && !twoHopQuote && !threeHopQuote) {
            return undefined;
        }
        const directOutput = directQuote?.outAmt ?? 0;
        const twoHopOutput = twoHopQuote?.outAmt ?? 0;
        const threeHopOutput = threeHopQuote?.outAmt ?? 0;

        log('Get quote', [directOutput, twoHopOutput, threeHopOutput]);
        const maxOutput = Math.max(directOutput, twoHopOutput, threeHopOutput);
        if (directOutput === maxOutput) {
            return directQuote;
        } else if (twoHopOutput === maxOutput) {
            return twoHopQuote;
        } else if (threeHopOutput === maxOutput) {
            return threeHopQuote;
        } else {
            return undefined;
        }
    }

    getQuoteSymbol(inputSymbol: string, outputSymbol: string, inAmt: number): Quote | undefined {
        const [inputToken, outputToken] = [
            this.coinList.getTokenBySymbol(inputSymbol),
            this.coinList.getTokenBySymbol(outputSymbol)
        ];
        if (!inputToken) throw new Error('Not found the token of symbol ' + inputSymbol);
        if (!outputToken) throw new Error('Not found the token of symbol ' + outputSymbol);
        return this.getQuote(inputToken, outputToken, inAmt);
    }

    async swap(quote: Quote, minOutput?: number) {
        if (this.routerContract) {
            if (isBTC(quote.inputToken)) {
                return await this.send(
                    this.routerContract.swapWithBTCInput,
                    quote.steps.map((step) => step.pool.poolAddress),
                    quote.steps.map((step) => step.isReversed),
                    Sdk.getOutputAmount(quote, minOutput),
                    { value: Sdk.getInputAmount(quote), ...this.txOption }
                );
            } else if (isBTC(quote.outputToken)) {
                return await this.send(
                    this.routerContract.swapWithBTCInput,
                    Sdk.getInputAmount(quote),
                    quote.steps.map((step) => step.pool.poolAddress),
                    quote.steps.map((step) => step.isReversed),
                    Sdk.getOutputAmount(quote, minOutput),
                    this.txOption
                );
            } else {
                return await this.send(
                    this.routerContract.swap,
                    Sdk.getInputAmount(quote),
                    quote.steps.map((step) => step.pool.poolAddress),
                    quote.steps.map((step) => !step.isReversed),
                    Sdk.getOutputAmount(quote, minOutput),
                    this.txOption
                );
            }
        }
    }

    private static getInputAmount(quote: Quote): string {
        return new BigNumber(quote.inAmt).times(10 ** quote.inputToken.decimals).toFixed(0);
    }

    private static getOutputAmount(quote: Quote, output?: number): string {
        if (output === undefined) {
            output = quote.outAmt;
        }

        return new BigNumber(output).times(10 ** quote.outputToken.decimals).toFixed(0);
    }

    async print() {
        console.log('\nPools\n');
        for (const pool of this.pools) {
            await pool.printMessage();
            log('\n');
        }
    }
}
