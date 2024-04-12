import { Pool } from './Pool';
import { TokenInfo, Config, Quote, TxOption, PairStats } from './types';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import { Contract, Provider, Signer } from 'ethers';
import { ABI_SWAP_ROUTER } from './abi/SwapRouter';
import { isBTC } from './utils';
import { CoinList } from './CoinList';
import { ethers } from 'ethers';
import { ContractRunner } from './ContractRunner';
import { ABI_SS_TRADING_PAIR_V1_LIST } from './abi/SsTradingPairV1List';
import { parsePairStats } from './utils/statsV1';
import { PoolCreator } from './PoolCreator';
import PromiseThrottle from 'promise-throttle';

export class Sdk extends ContractRunner {
    pools: Pool[] = [];
    coinList: CoinList;
    poolCreator: PoolCreator;
    private routerContract: Contract;
    private tradingPairV1ListContract: Contract;
    private promiseThrottle: PromiseThrottle;
    private pairStats: PairStats[] = [];
    constructor(
        provider: Provider,
        public config: Config,
        private fetch: {
            requestsPerSecond: number;
            pagePoolCount: number;
            pageTokenCount: number;
            pageBalancesCount: number;
        },
        txOption?: TxOption,
        signer?: Signer
    ) {
        super(provider, txOption, signer);
        this.promiseThrottle = new PromiseThrottle({ requestsPerSecond: fetch.requestsPerSecond });
        this.coinList = new CoinList(
            provider,
            config.tokenList,
            this.promiseThrottle,
            fetch.pageTokenCount,
            fetch.pageBalancesCount,
            config.tokensBalance,
            txOption,
            signer
        );
        this.poolCreator = new PoolCreator(provider, config.tradingPairV1Creator, txOption, signer);
        this.routerContract = new Contract(config.swapRouter, ABI_SWAP_ROUTER, provider);
        this.tradingPairV1ListContract = new Contract(config.tradingPairV1List, ABI_SS_TRADING_PAIR_V1_LIST, provider);
    }

    async reload() {
        const pairStats = await this.reloadPools();
        this.buildCache(pairStats);
        return this.pools;
    }
    private buildCache(pairStats: PairStats[]) {
        const pools: Pool[] = [];
        for (const pairStat of pairStats) {
            pools.push(new Pool(this.provider, pairStat, this.txOption, this.signer));
        }
        this.pools = pools;
    }
    private async reloadPools(): Promise<PairStats[]> {
        const paginateCount = this.fetch.pagePoolCount;
        let resultPairStats: PairStats[] = [];
        console.log(`Fetch pools ${paginateCount} after index ${0} `);
        const fetchResult = await this.promiseThrottle.add(async () => {
            return this.tradingPairV1ListContract.fetchPairsStatsListPaginateV2(0, paginateCount);
        });
        resultPairStats = resultPairStats.concat(fetchResult[0].map(parsePairStats));
        if (fetchResult[0].length < parseFloat(fetchResult[1].toString())) {
            const promise = [];
            for (let i = paginateCount; i < parseFloat(fetchResult[1].toString()); i += paginateCount) {
                promise.push(async () => {
                    console.log(
                        `Fetch pools ${paginateCount} after index ${i} of ${parseFloat(fetchResult[1].toString())}`
                    );
                    return this.tradingPairV1ListContract.fetchPairsStatsListPaginateV2(i, i + paginateCount);
                });
            }
            const promisePairs = await this.promiseThrottle.addAll(promise);

            for (const promisePair of promisePairs) {
                resultPairStats = resultPairStats.concat(promisePair[0].map(parsePairStats));
            }
        }
        console.log('Pools count ', resultPairStats.length);
        return resultPairStats;
    }
    async getTokensBalance() {
        const tokens = this.pools
            .map((pool) => pool.pair.lpToken)
            .concat(this.coinList.getAllToken().map((token) => token.address));
        if (tokens.length == 1) {
            return undefined;
        }
        const balances = await this.coinList.getBalances(tokens);
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
    afterSetSigner(signer?: ethers.Signer | undefined): void {}
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
        requestsPerSecond = 0.2,
        txOption?: TxOption,
        signer?: Signer
    ) {
        const sdk = new Sdk(
            provider,
            config,
            { requestsPerSecond, pagePoolCount: 140, pageTokenCount: 400, pageBalancesCount: 300 },
            txOption,
            signer
        );
        await sdk.reload();
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

        console.log('Get quote', [directOutput, twoHopOutput, threeHopOutput]);
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
            console.log('\n');
        }
    }
}
