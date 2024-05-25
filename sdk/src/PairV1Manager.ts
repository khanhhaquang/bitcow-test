import { ContractRunner } from './ContractRunner';
import { Contract, Provider, Signer } from 'ethers';
import PromiseThrottle from 'promise-throttle';
import { SearchPairMessage, StatsV1, TokenInfo, TxOption } from './types';
import { ABI_PAIR_V1_MANAGER } from './abi/PairV1Manger';
import { parsePairMessage, parseStatsV1 } from './utils/statsV1';
import { multUiAmount, uiAmountToContractAmount } from './utils/common';

export class PairV1Manager extends ContractRunner {
  private pairV1Contract: Contract;
  constructor(
    provider: Provider,
    public pairV1ManagerAddress: string,
    private promiseThrottle: PromiseThrottle,
    txOption?: TxOption,
    signer?: Signer,
    private debug: (message?: any) => void = console.log
  ) {
    super(provider, txOption, signer);
    this.pairV1Contract = new Contract(pairV1ManagerAddress, ABI_PAIR_V1_MANAGER, provider);
  }

  async createPair(
    xToken: TokenInfo,
    yToken: TokenInfo,
    xLiquidityAmount: number,
    yLiquidityAmount: number,
    protocolFeeShareThousandth_: number,
    feeMillionth_: number,
    xPrice: number,
    yPrice: number
  ) {
    return this.send(
      this.pairV1Contract.createPair,
      {
        tokenAddress: xToken.address,
        description: xToken.description,
        projectUrl: xToken.projectUrl,
        logoUrl: xToken.logoUrl,
        coingeckoId: xToken.coingeckoId
      },
      {
        tokenAddress: yToken.address,
        description: yToken.description,
        projectUrl: yToken.projectUrl,
        logoUrl: yToken.logoUrl,
        coingeckoId: yToken.coingeckoId
      },
      uiAmountToContractAmount(xLiquidityAmount, xToken),
      uiAmountToContractAmount(yLiquidityAmount, yToken),
      protocolFeeShareThousandth_,
      feeMillionth_,
      multUiAmount(xPrice, 3),
      multUiAmount(yPrice, 3),
      this.txOption
    );
  }

  private async searchPairsPaginate(tokenAddress: string, start: number, paginateCount: number) {
    let times = 0;
    while (true) {
      try {
        const pageStats: SearchPairMessage[] = [];
        const promisePair = await this.promiseThrottle.add(
          async () => {
            this.debug(`Fetch pools from ${start}`);
            return this.pairV1Contract.searchPairsPaginate(
              tokenAddress,
              start,
              start + paginateCount
            );
          },
          { weight: 1 }
        );
        for (const pairStat of promisePair.pageStats) {
          pageStats.push(parsePairMessage(pairStat));
        }
        const allCount = parseFloat(promisePair.pairCount.toString());
        return { pageStats, allCount };
      } catch (e) {
        times++;
        console.log(e);
        console.trace(e);
        console.log(`Retry fetch pools from ${start} times ${times}`);
      }
    }
  }

  async searchPairsAll(tokenAddress: string, paginateCount: number) {
    let resultPairMessage: SearchPairMessage[] = [];
    this.debug(`Search pairs first page, paginateCount ${paginateCount}`);
    const { pageStats, allCount } = await this.searchPairsPaginate(tokenAddress, 0, paginateCount);
    resultPairMessage = resultPairMessage.concat(pageStats);

    if (resultPairMessage.length < allCount) {
      this.debug(`Start others ${allCount - resultPairMessage.length}`);
      const promise = [];
      for (let i = paginateCount; i < allCount; i += paginateCount) {
        const fn = async () => {
          const fetchedPairs = await this.searchPairsPaginate(tokenAddress, i, paginateCount);
          resultPairMessage = resultPairMessage.concat(fetchedPairs.pageStats);
        };
        promise.push(fn());
      }
      await Promise.all(promise);
    }
    this.debug(`Count ${resultPairMessage.length}`);
    return resultPairMessage;
  }

  private async fetchPairStatsInner(pairAddresses: string[], index: number) {
    while (true) {
      try {
        return await this.promiseThrottle.add(
          async () => {
            this.debug(`Fetch pairStats from index ${index}`);
            return this.pairV1Contract.fetchPairsStats(pairAddresses);
          },
          { weight: 1 }
        );
      } catch (e) {
        this.debug(`Retry fetch pairStats from index ${index}`);
      }
    }
  }
  async fetchPairStats(pairAddresses: string[], pageFetchCount: number) {
    const fetchPairAddresses: string[][] = [];
    for (let i = 0; i < pairAddresses.length; i += pageFetchCount) {
      fetchPairAddresses.push(pairAddresses.slice(i, i + pageFetchCount));
    }
    const promise = [];
    let index = 0;
    for (const pairAddresses of fetchPairAddresses) {
      const fn = async () => {
        return this.fetchPairStatsInner(pairAddresses, index);
      };
      promise.push(fn());
      index += pairAddresses.length;
    }
    const pairStatss = await Promise.all(promise);
    let resultPairStats: StatsV1[] = [];
    for (const pairStats of pairStatss) {
      resultPairStats = resultPairStats.concat(pairStats.map(parseStatsV1));
    }
    return resultPairStats;
  }

  async getTokenInfo(tokenAddress: string) {
    const tokenInfo = await this.pairV1Contract.tokens(tokenAddress);
    return tokenInfo.toObject();
  }
}
