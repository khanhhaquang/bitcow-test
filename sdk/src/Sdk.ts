import { PoolConfig, WBTC } from './configs';
import { Pool } from './Pool';
import { BaseToken, Config, Quote, TxOption, UserLpAmount } from './types';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import { Contract, Provider, Signer } from 'ethers';
import { ABI_SWAP_ROUTER } from './abi/SwapRouter';
import { isBTC } from './utils';
import { CoinList } from './CoinList';
import { ethers } from 'ethers';
import { ContractRunner } from './ContractRunner';

export class Sdk extends ContractRunner {
    readonly pools: Pool[];
    private router: Contract | undefined;
    coinList: CoinList;
    constructor(provider: Provider, public config: Config, txOption?: TxOption, signer?: Signer) {
        super(provider, txOption, signer);
        this.pools = config.pools.map((poolConfig) => new Pool(provider, poolConfig, txOption, signer));
        this.router = new Contract(config.swapRouter, ABI_SWAP_ROUTER, provider);
        this.coinList = new CoinList(provider, config.pools, txOption, signer);
        // this.afterSetSigner(signer);
    }
    afterSetSigner(signer?: ethers.Signer | undefined): void {
        // if (signer) {
        //     this.router = new Contract(SWAP_ROUTER, ABI_SWAP_ROUTER, this.signer);
        // } else {
        //     this.router = undefined;
        // }
    }
    setSigner(signer?: Signer, address?: string) {
        super.setSigner(signer, address);
        this.coinList.setSigner(signer, address);
        this.pools.forEach((pool) => pool.setSigner(signer, address));
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

    static async create(provider: Provider, config: Config, txOption?: TxOption, signer?: Signer) {
        const sdk = new Sdk(provider, config, txOption, signer);
        await sdk.reload();
        return sdk;
    }

    async reload() {
        await Promise.all(this.pools.map((pool) => pool.reload()));
    }
    async getUserPoolLpAmount(): Promise<Record<string, UserLpAmount> | undefined> {
        if (this.signer) {
            const result: Record<string, UserLpAmount> = {};
            for (const pool of this.pools) {
                result[pool.poolAddress] = await pool.getUserLpAmount();
            }
            return result;
        } else {
            return undefined;
        }
    }
    getDirectQuote(inputToken: BaseToken, outputToken: BaseToken, inAmt: number): Quote | undefined {
        let pool: Pool | undefined;
        let isReversed: boolean | undefined;
        const fromToken = isBTC(inputToken) ? WBTC : inputToken;
        const toToken = isBTC(outputToken) ? WBTC : outputToken;
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
        const inputAmount = new BN(new BigNumber(inAmt).times(inputMult).toFixed());
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

    getBest2HopQuote(inputToken: BaseToken, outputToken: BaseToken, inAmt: number): Quote | undefined {
        let bestQuote: Quote | undefined;
        const fromToken = isBTC(inputToken) ? WBTC : inputToken;
        const toToken = isBTC(outputToken) ? WBTC : outputToken;
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

    getBest3HopQuote(inputToken: BaseToken, outputToken: BaseToken, inAmt: number): Quote | undefined {
        let bestQuote: Quote | undefined;
        const fromToken = isBTC(inputToken) ? WBTC : inputToken;
        const toToken = isBTC(outputToken) ? WBTC : outputToken;
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

    getQuote(inputToken: BaseToken, outputToken: BaseToken, inAmt: number): Quote | undefined {
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
        if (this.router) {
            if (isBTC(quote.inputToken)) {
                return await this.send(
                    this.router.swapWithEthInput,
                    quote.steps.map((step) => step.pool.poolAddress),
                    quote.steps.map((step) => step.isReversed),
                    Sdk.getOutputAmount(quote, minOutput),
                    { value: Sdk.getInputAmount(quote), ...this.txOption }
                );
            } else if (isBTC(quote.outputToken)) {
                return await this.send(
                    this.router.swapWithEthInput,
                    Sdk.getInputAmount(quote),
                    quote.steps.map((step) => step.pool.poolAddress),
                    quote.steps.map((step) => step.isReversed),
                    Sdk.getOutputAmount(quote, minOutput),
                    this.txOption
                );
            } else {
                console.log(Sdk.getInputAmount(quote));
                console.log(Sdk.getOutputAmount(quote, minOutput));
                return await this.send(
                    this.router.swap,
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
        return new BigNumber(quote.inAmt).times(10 ** quote.inputToken.decimals).toFixed();
    }

    private static getOutputAmount(quote: Quote, output?: number): string {
        if (output === undefined) {
            output = quote.outAmt;
        }
        return new BigNumber(output).times(10 ** quote.outputToken.decimals).toFixed();
    }

    async print() {
        await this.coinList.print();
        console.log('\nPools\n');
        for (const pool of this.pools) {
            await pool.printMessage();
            console.log('\n');
        }
    }
}
