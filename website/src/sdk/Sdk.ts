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
import { TokenInfo, Config, Quote, TxOption, SearchPairMessage } from './types';
import { isBTC, isWBTC } from './utils';
import {
  parsePairFromConfig,
  parsePairStats,
  parsePairStatsToConfig,
  parseSearchPairAndStats
} from './utils/statsV1';
import { uiAmountToContractAmount } from './utils/common';
import { PairV1Manager } from './PairV1Manager';
import { Lottery } from './Lottery';

export class Sdk extends ContractRunner {
  pools: Pool[] = [];

  coinList: CoinList;

  pairV1Manager?: PairV1Manager;

  poolCreator?: PoolCreator;

  lottery?: Lottery;

  private readonly routerContract: Contract;

  private tradingPairV1ListContract: Contract;

  readonly promiseThrottle: PromiseThrottle;

  private localPairs: SearchPairMessage[];

  constructor(
    public provider: Provider,
    public config: Config,
    requestsPerSecond: number,
    localPairs: SearchPairMessage[],
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
    this.localPairs = localPairs;
    this.promiseThrottle = new PromiseThrottle({ requestsPerSecond: requestsPerSecond });
    this.coinList = new CoinList(
      provider,
      config.tokenList,
      this.promiseThrottle,
      new PromiseThrottle({ requestsPerSecond: requestsPerSecond }),
      config.chainId,
      config.tokensBalance,
      this.getLocalTokens(localPairs),
      txOption,
      signer,
      debug
    );
    this.poolCreator = config.tradingPairV1Creator
      ? new PoolCreator(provider, config.tradingPairV1Creator, txOption, signer)
      : undefined;
    this.pairV1Manager = config.pairV1Manager
      ? new PairV1Manager(
          provider,
          config.pairV1Manager,
          this.promiseThrottle,
          txOption,
          signer,
          debug
        )
      : undefined;
    this.routerContract = new Contract(config.swapRouter, ABI_SWAP_ROUTER, provider);
    this.tradingPairV1ListContract = new Contract(
      config.tradingPairV1List,
      ABI_SS_TRADING_PAIR_V1_LIST,
      provider
    );

    this.lottery = config.lottery
      ? new Lottery(provider, config.lottery, txOption, signer)
      : undefined;
  }
  getLocalTokens(localPairs: SearchPairMessage[]) {
    const localTokens: Record<string, TokenInfo> = {};
    for (const localPair of localPairs) {
      localTokens[localPair.xTokenInfo.address] = localPair.xTokenInfo;
      localTokens[localPair.yTokenInfo.address] = localPair.yTokenInfo;
    }
    return Object.values(localTokens);
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
        this.debug(e);
        this.debug(`Retry fetch pools from ${start} times ${times}`);
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
    const promise = [];
    if (pools.length < allCount) {
      this.debug(`Start others ${allCount - pools.length}, paginate count ${paginateCount}`);
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
    }
    if (this.localPairs.length > 0 && this.pairV1Manager !== undefined) {
      const fn = async () => {
        const localPools: Pool[] = [];
        const pairStats = await this.pairV1Manager!.fetchPairStats(
          this.localPairs.map((localPair) => localPair.pairAddress),
          50
        );
        for (let i = 0; i < this.localPairs.length; i++) {
          const pair = this.localPairs[i];
          const stats = pairStats[i];
          localPools.push(
            new Pool(
              this.provider,
              parseSearchPairAndStats(pair, stats),
              this.txOption,
              this.signer
            )
          );
        }
        if (isThisPoolsEmpty) {
          this.pools = this.pools.concat(localPools);
        } else {
          resultPools = resultPools.concat(localPools);
        }
      };
      promise.push(fn());
    }

    await Promise.all(promise);
    if (!isThisPoolsEmpty) {
      this.pools = resultPools;
    }
    const map = new Map();
    for (const pool of this.pools) {
      map.set(pool.poolAddress, pool);
    }
    this.pools = Array.from(map.values());
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
    this.pairV1Manager?.setSigner(signer, address);
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
    localPairs: SearchPairMessage[],
    txOption?: TxOption,
    signer?: Signer
  ) {
    const sdk = new Sdk(
      provider,
      config,
      requestsPerSecond,
      localPairs,
      txOption,
      signer,
      undefined
    );
    await sdk.reload(100, 140, (pools) => {});
    const address = await signer?.getAddress();
    sdk.setSigner(signer, address);
    return sdk;
  }

  private getDirectQuote(
    inputToken: TokenInfo,
    outputToken: TokenInfo,
    inAmt: number
  ): Quote | undefined {
    let pool: Pool | undefined;
    let isReversed: boolean | undefined;
    for (const pool_ of this.pools) {
      if (
        pool_.xToken.address === inputToken.address &&
        pool_.yToken.address === outputToken.address
      ) {
        pool = pool_;
        isReversed = false;
      } else if (
        pool_.xToken.address === outputToken.address &&
        pool_.yToken.address === inputToken.address
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
    let outAmount = new BN(0);
    try {
      outAmount = isReversed ? pool.quoteYtoX(inputAmount) : pool.quoteXtoY(inputAmount);
    } catch (e) {
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

  private getBest2HopQuote(
    inputToken: TokenInfo,
    outputToken: TokenInfo,
    inAmt: number
  ): Quote | undefined {
    let bestQuote: Quote | undefined;
    for (const mToken of this.coinList.tokens) {
      if (mToken.address === inputToken.address || mToken.address === outputToken.address) {
        continue;
      }
      const inToM = this.getDirectQuote(inputToken, mToken, inAmt);
      if (!inToM) continue;
      const mToOut = this.getDirectQuote(mToken, outputToken, inToM.outAmt);
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

  private getBest3HopQuote(
    inputToken: TokenInfo,
    outputToken: TokenInfo,
    inAmt: number
  ): Quote | undefined {
    let bestQuote: Quote | undefined;
    for (const mToken of this.coinList.tokens) {
      if (mToken.address === inputToken.address || mToken.address === outputToken.address) {
        continue;
      }
      const inToM = this.getBest2HopQuote(inputToken, mToken, inAmt);
      if (!inToM) continue;
      const mToOut = this.getDirectQuote(mToken, outputToken, inToM.outAmt);
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
    if ((isBTC(inputToken) && isWBTC(outputToken)) || (isWBTC(inputToken) && isBTC(outputToken))) {
      return {
        inputToken,
        outputToken,
        inAmt,
        steps: [],
        outAmt: inAmt
      };
    }
    const erc20InputToken = isBTC(inputToken) ? this.coinList.getWBTCToken() : inputToken;
    const erc20OutputToken = isBTC(outputToken) ? this.coinList.getWBTCToken() : outputToken;
    if (erc20InputToken === undefined || erc20OutputToken === undefined) {
      return undefined;
    }
    const directQuote = this.getDirectQuote(erc20InputToken, erc20OutputToken, inAmt);
    const twoHopQuote = this.getBest2HopQuote(erc20InputToken, erc20OutputToken, inAmt);
    const threeHopQuote = this.getBest3HopQuote(erc20InputToken, erc20OutputToken, inAmt);
    if (!directQuote && !twoHopQuote && !threeHopQuote) {
      return undefined;
    }
    const directOutput = directQuote?.outAmt ?? 0;
    const twoHopOutput = twoHopQuote?.outAmt ?? 0;
    const threeHopOutput = threeHopQuote?.outAmt ?? 0;

    this.debug(`Get quote [${directOutput} ${twoHopOutput} ${threeHopOutput}]`);
    const maxOutput = Math.max(directOutput, twoHopOutput, threeHopOutput);
    let optimalQuote = undefined;
    if (directOutput === maxOutput) {
      optimalQuote = directQuote;
    } else if (twoHopOutput === maxOutput) {
      optimalQuote = twoHopQuote;
    } else if (threeHopOutput === maxOutput) {
      optimalQuote = threeHopQuote;
    }
    if (optimalQuote != undefined) {
      optimalQuote.inputToken = inputToken;
      optimalQuote.outputToken = outputToken;
    }
    return optimalQuote;
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
        if (isWBTC(quote.outputToken)) {
          return this.send(this.routerContract.swapBTCtoWBTC, quote.outputToken.address, {
            value: Sdk.getInputAmount(quote),
            ...this.txOption
          });
        } else {
          return this.send(
            this.routerContract.swapBTCtoERC20,
            quote.steps.map((step) => step.pool.poolAddress),
            quote.steps.map((step) => !step.isReversed),
            Sdk.getOutputAmount(quote, minOutput),
            { value: Sdk.getInputAmount(quote), ...this.txOption }
          );
        }
      } else if (isBTC(quote.outputToken)) {
        if (isWBTC(quote.inputToken)) {
          return this.send(
            this.routerContract.swapWBTCtoBTC,
            quote.inputToken.address,
            Sdk.getInputAmount(quote),
            this.txOption
          );
        } else {
          return this.send(
            this.routerContract.swapERC20toBTC,
            Sdk.getInputAmount(quote),
            quote.steps.map((step) => step.pool.poolAddress),
            quote.steps.map((step) => !step.isReversed),
            Sdk.getOutputAmount(quote, minOutput),
            this.txOption
          );
        }
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
    return uiAmountToContractAmount(quote.inAmt, quote.inputToken);
  }

  private static getOutputAmount(quote: Quote, output?: number): string {
    if (output === undefined) {
      output = quote.outAmt;
    }
    return uiAmountToContractAmount(output, quote.outputToken);
  }

  async print() {
    this.debug('\nPools\n');
    for (const pool of this.pools) {
      await pool.printMessage();
      this.debug('\n');
    }
  }
}
