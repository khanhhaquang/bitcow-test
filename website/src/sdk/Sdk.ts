import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import { Contract, Provider, Signer } from 'ethers';
import PromiseThrottle from 'promise-throttle';

import { ABI_SS_TRADING_PAIR_V1_LIST } from './abi/SsTradingPairV1List';
import { ABI_SWAP_ROUTER } from './abi/SwapRouter';
import * as ConfigPair from './cache/pairs.json';
import { CoinList } from './CoinList';
import { ContractRunner } from './ContractRunner';
import { Pool } from './Pool';
import { PoolCreator } from './PoolCreator';
import { TokenInfo, Config, Quote, TxOption } from './types';
import { isBTC } from './utils';
import { parsePairFromConfig, parsePairStats, parsePairStatsToConfig } from './utils/statsV1';

export class Sdk extends ContractRunner {
  pools: Pool[] = [];

  coinList: CoinList;

  poolCreator?: PoolCreator;

  private readonly routerContract: Contract;

  private tradingPairV1ListContract: Contract;

  private readonly promiseThrottle: PromiseThrottle;

  constructor(
    provider: Provider,
    public config: Config,
    requestsPerSecond: number,
    txOption?: TxOption,
    signer?: Signer,
    private debug: (message?: any) => void = console.log
  ) {
    super(provider, txOption, signer);
    const pairStats = (ConfigPair as Record<string, any>)[config.chainId.toString()];
    if (pairStats) {
      for (const pairStat of pairStats) {
        this.pools.push(
          new Pool(provider, parsePairFromConfig(pairStat), this.txOption, this.signer)
        );
      }
    }

    this.promiseThrottle = new PromiseThrottle({ requestsPerSecond: requestsPerSecond });
    this.coinList = new CoinList(
      provider,
      config.tokenList,
      this.promiseThrottle,
      new PromiseThrottle({ requestsPerSecond: requestsPerSecond }),
      config.chainId,
      config.tokensBalance,
      txOption,
      signer,
      debug
    );
    this.poolCreator = config.tradingPairV1Creator
      ? new PoolCreator(provider, config.tradingPairV1Creator, txOption, signer)
      : undefined;
    this.routerContract = new Contract(config.swapRouter, ABI_SWAP_ROUTER, provider);
    this.tradingPairV1ListContract = new Contract(
      config.tradingPairV1List,
      ABI_SS_TRADING_PAIR_V1_LIST,
      provider
    );
  }

  async fetchStats(paginateCount: number = 140): Promise<any[]> {
    const stats = await this.reloadPairStats(paginateCount, paginateCount);
    return stats.map(parsePairStatsToConfig);
  }

  async fetchPoolsPaginate(
    start: number,
    paginateCount: number
  ): Promise<{ pools: Pool[]; pageStats: any[]; allCount: number }> {
    let times = 0;
    while (true) {
      try {
        const pools: Pool[] = [];
        const promisePair = await this.promiseThrottle.add(
          async () => {
            this.debug(`Fetch pools from ${start}`);
            return this.tradingPairV1ListContract.fetchPairsStatsListPaginateV2(
              start,
              start + paginateCount
            );
          },
          { weight: 1 }
        );
        for (const pairStat of promisePair.pageStats) {
          pools.push(new Pool(this.provider, parsePairStats(pairStat), this.txOption, this.signer));
        }
        const allCount = parseFloat(promisePair.pairCount.toString());
        return { pools, pageStats: promisePair.pageStats, allCount };
      } catch (e) {
        times++;
        console.log(e);
        console.trace(e);
        console.log(`Retry fetch pools from ${start} times ${times}`);
      }
    }
  }

  async reload(
    firstPaginateCount: number,
    paginateCount: number,
    callBack?: (pools: Pool[], allCount: number) => void
  ) {
    await this.reloadPairStats(firstPaginateCount, paginateCount, callBack);
    return this.pools;
  }

  async reloadPairStats(
    firstPaginateCount: number,
    paginateCount: number,
    callBack?: (pools: Pool[], allCount: number) => void
  ) {
    const isThisPoolsEmpty = this.pools.length === 0;
    let resultPools: Pool[] = [];
    let resultPageStats: any[] = [];
    this.debug(`Fetch pools first page ${firstPaginateCount}`);
    const { pools, pageStats, allCount } = await this.fetchPoolsPaginate(0, firstPaginateCount);

    if (callBack) {
      callBack(pools, allCount);
    }
    if (isThisPoolsEmpty) {
      this.pools = this.pools.concat(pools);
    } else {
      resultPools = resultPools.concat(pools);
    }
    resultPageStats = resultPageStats.concat(pageStats);
    if (pools.length < allCount) {
      this.debug(`Start others ${allCount - pools.length}, paginate count ${paginateCount}`);
      const promise = [];
      for (let i = firstPaginateCount; i < allCount; i += paginateCount) {
        const fn = async () => {
          const fetchedPools = await this.fetchPoolsPaginate(i, paginateCount);
          if (isThisPoolsEmpty) {
            this.pools = this.pools.concat(fetchedPools.pools);
          } else {
            resultPools = resultPools.concat(fetchedPools.pools);
          }
          resultPageStats = resultPageStats.concat(fetchedPools.pageStats);
          callBack && callBack(isThisPoolsEmpty ? this.pools : resultPools, fetchedPools.allCount);
        };
        promise.push(fn());
      }
      await Promise.all(promise);
    }

    if (!isThisPoolsEmpty) {
      this.pools = resultPools;
    }
    this.debug(`Pools count ${this.pools.length}`);
    return resultPageStats;
  }

  async getTokensBalance(pageFetchCount: number, poolsLpTokenFirst = true) {
    let tokens;
    const pools = this.pools;
    const allTokens = this.coinList.getAllToken();
    if (poolsLpTokenFirst) {
      tokens = pools
        .map((pool) => pool.pair.lpToken)
        .concat(allTokens.map((token) => token.address));
    } else {
      tokens = allTokens
        .map((token) => token.address)
        .concat(pools.map((pool) => pool.pair.lpToken));
    }
    if (tokens.length == 1) {
      return undefined;
    }
    return this.coinList.getBalances(pageFetchCount, tokens);
  }

  setSigner(signer?: Signer, address?: string) {
    super.setSigner(signer, address);
    this.coinList.setSigner(signer, address);
    this.pools.forEach((pool) => pool.setSigner(signer, address));
    this.poolCreator?.setSigner(signer, address);
  }

  get swapRouter(): string {
    return this.config.swapRouter;
  }

  setTxOption(txOption?: TxOption) {
    super.setTxOption(txOption);
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
      } else if (
        pool_.xToken.address === toToken.address &&
        pool_.yToken.address === fromToken.address
      ) {
        pool = pool_;
        isReversed = true;
      }
    }
    if (!pool) {
      return undefined;
    }
    pool = pool!;
    isReversed = isReversed!;
    const [inputMult, outputMult] = isReversed
      ? [pool.yMult, pool.xMult]
      : [pool.xMult, pool.yMult];
    const inputAmount = new BN(new BigNumber(inAmt).times(inputMult).toFixed(0));
    let outAmount = 0
    try {
      outAmount = isReversed ? pool.quoteYtoX(inputAmount) : pool.quoteXtoY(inputAmount);
    } catch (e){
      // console.log(e)
    }
    const outAmt = new BigNumber(outAmount.toString()).div(outputMult).toNumber();
    return {
      inputToken,
      outputToken,
      inAmt,
      steps: [
        {
          pool,
          isReversed,
          inAmt,
          outAmt,
          poolType: 0,
          fromToken: inputToken,
          toToken: outputToken
        }
      ],
      outAmt
    };
  }

  getBest2HopQuote(
    inputToken: TokenInfo,
    outputToken: TokenInfo,
    inAmt: number
  ): Quote | undefined {
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

  getBest3HopQuote(
    inputToken: TokenInfo,
    outputToken: TokenInfo,
    inAmt: number
  ): Quote | undefined {
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

    this.debug(`Get quote [${directOutput} ${twoHopOutput} ${threeHopOutput}]`);
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
        return this.send(
          this.routerContract.swapWithBTCInput,
          quote.steps.map((step) => step.pool.poolAddress),
          quote.steps.map((step) => step.isReversed),
          Sdk.getOutputAmount(quote, minOutput),
          { value: Sdk.getInputAmount(quote), ...this.txOption }
        );
      } else if (isBTC(quote.outputToken)) {
        return this.send(
          this.routerContract.swapWithBTCInput,
          Sdk.getInputAmount(quote),
          quote.steps.map((step) => step.pool.poolAddress),
          quote.steps.map((step) => step.isReversed),
          Sdk.getOutputAmount(quote, minOutput),
          this.txOption
        );
      } else {
        return this.send(
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
    this.debug('\nPools\n');
    for (const pool of this.pools) {
      await pool.printMessage();
      this.debug('\n');
    }
  }
}
