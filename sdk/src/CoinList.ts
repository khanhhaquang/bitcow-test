import BigNumber from 'bignumber.js';
import { Contract, Provider, Signer } from 'ethers';
import PromiseThrottle from 'promise-throttle';

import { ABI_ERC20 } from './abi/ERC20';
import { ABI_TOKEN_LIST } from './abi/TokenList';
import { ABI_TOKENS_BALANCE } from './abi/TokensBalance';
import * as ConfigTokens from './cache/tokens.json';
import { BTC } from './configs';
import { MAX_U256 } from './constant';
import { ContractRunner } from './ContractRunner';
import { Token, TokenInfo, TxOption } from './types';
import { parseTokenInfo } from './utils/statsV1';

export class CoinList extends ContractRunner {
  tokens: TokenInfo[] = [];

  symbolToToken: Record<string, TokenInfo> = {};

  addressToToken: Record<string, TokenInfo> = {};

  readonly tokenListContract: Contract;

  public readonly tokensBalanceContract: Contract;

  private localTokens: TokenInfo[];

  constructor(
    provider: Provider,
    public tokenListAddress: string,
    private promiseThrottle: PromiseThrottle,
    private promiseThrottleBalance: PromiseThrottle,
    chainId: number,
    tokensBalance: string,
    localTokens: TokenInfo[],
    txOption?: TxOption,
    signer?: Signer,
    private debug: (message?: any) => void = console.log
  ) {
    super(provider, txOption, signer);
    this.localTokens = localTokens;
    this.tokens = this.mergeTokens(
      (ConfigTokens as Record<string, any>)[chainId.toString()] || [],
      localTokens
    );
    this.buildCache();
    this.tokenListContract = new Contract(tokenListAddress, ABI_TOKEN_LIST, provider);
    this.tokensBalanceContract = new Contract(tokensBalance, ABI_TOKENS_BALANCE, provider);
  }

  getWBTCToken() {
    if (this.symbolToToken['wBTC']) {
      return this.symbolToToken['wBTC'];
    } else if (this.symbolToToken['WBTC']) {
      return this.symbolToToken['WBTC'];
    } else {
      return undefined;
    }
  }

  async getCreateFee() {
    return this.tokenListContract.createFee();
  }

  async fetchTokenListPaginate(start: number, paginateCount: number) {
    let times = 0;
    while (true) {
      try {
        return await this.promiseThrottle.add(
          async () => {
            this.debug(`Fetch tokens from index ${start}`);
            return this.tokenListContract.fetchTokenListPaginate(start, start + paginateCount);
          },
          { weight: 1 }
        );
      } catch (e) {
        times++;
        this.debug(`Retry fetch tokens from index ${start} times ${times}`);
      }
    }
  }

  async reload(
    firstPaginateCount: number,
    paginateCount: number,
    callBack?: (tokens: TokenInfo[]) => void,
    useBTC = true
  ) {
    let resultTokens: TokenInfo[] = [];
    const isThisTokensEmpty = this.tokens.length === 0;
    this.debug(`Fetch tokens first page ${firstPaginateCount}`);
    const fetchResult = await this.fetchTokenListPaginate(0, firstPaginateCount);
    const fetchTokens = useBTC
      ? [BTC].concat(fetchResult[0].map(parseTokenInfo))
      : fetchResult[0].map(parseTokenInfo);
    const allTokensCount = parseFloat(fetchResult[1].toString());
    if (isThisTokensEmpty) {
      this.tokens = this.tokens = this.tokens.concat(fetchTokens);
      this.buildCache();
    } else {
      resultTokens = resultTokens.concat(fetchTokens);
    }

    if (callBack) {
      callBack(isThisTokensEmpty ? this.tokens : resultTokens);
    }
    if (fetchResult[0].length < allTokensCount) {
      this.debug(`Start other ${allTokensCount - fetchTokens.length}`);
      const promise = [];
      for (let i = firstPaginateCount; i < allTokensCount; i += paginateCount) {
        const fn = async () => {
          const fetchResult = await this.fetchTokenListPaginate(i, paginateCount);
          const fetchTokens = fetchResult[0].map(parseTokenInfo);
          if (isThisTokensEmpty) {
            this.tokens = this.tokens.concat(fetchTokens);
            this.buildCache();
          } else {
            resultTokens = resultTokens.concat(fetchTokens);
          }
          callBack && callBack(isThisTokensEmpty ? this.tokens : resultTokens);
        };
        promise.push(fn());
      }
      await Promise.all(promise);
    }

    if (!isThisTokensEmpty) {
      this.tokens = resultTokens;
    }
    this.tokens = this.mergeTokens(this.tokens, this.localTokens);
    this.buildCache();
    this.debug(`Tokens count ${this.tokens.length}`);
    return this.tokens;
  }
  mergeTokens(tokens0: TokenInfo[], tokens1: TokenInfo[]) {
    const tokens0Addresses = tokens0.map((token) => token.address);
    return tokens0.concat(tokens1.filter((token) => !tokens0Addresses.includes(token.address)));
  }
  buildCache() {
    this.symbolToToken = {};
    this.addressToToken = {};
    this.tokens.forEach((token) => {
      this.symbolToToken[token.symbol] = token;
      this.addressToToken[token.address.toLowerCase()] = token;
    });
  }

  afterSetSigner(signer?: Signer | undefined): void {}

  getTokenByAddress(address: string): TokenInfo {
    return this.addressToToken[address.toLowerCase()];
  }

  getTokenBySymbol(symbol: string): TokenInfo {
    return this.symbolToToken[symbol];
  }

  getAllToken() {
    return [BTC, ...this.tokens];
  }

  async fetchBalances(userAddress: string, fetchTokens: string[], index: number) {
    while (true) {
      try {
        return await this.promiseThrottleBalance.add(
          async () => {
            this.debug(`Fetch token balance from index ${index}`);
            return this.tokensBalanceContract.balances(userAddress, fetchTokens);
          },
          { weight: 1 }
        );
      } catch (e) {
        this.debug(`Retry fetch token balance from index ${index}`);
      }
    }
  }

  async getBalances(
    pageFetchCount: number,
    tokens = this.getAllToken().map((token) => token.address)
  ) {
    const userAddress = this.getAddress();
    if (userAddress) {
      this.debug(`Fetch tokens ${tokens.length} balance with page count ${pageFetchCount}`);
      const fetchTokens: string[][] = [];
      for (let i = 0; i < tokens.length; i += pageFetchCount) {
        fetchTokens.push(tokens.slice(i, i + pageFetchCount));
      }
      const promise = [];
      let index = 0;
      for (const fetchToken of fetchTokens) {
        const fn = async () => {
          return this.fetchBalances(userAddress, fetchToken, index);
        };
        promise.push(fn());
        index += fetchToken.length;
      }
      const balances = await Promise.all(promise);
      this.debug('Fetch tokens balance end');
      const balancesResult: Record<string, bigint> = {};
      tokens.forEach((token, index) => {
        balancesResult[token] =
          balances[Math.floor(index / pageFetchCount)][index % pageFetchCount];
      });
      return balancesResult;
    }
  }

  async approve(
    token: TokenInfo | Token,
    spender: string,
    minAmount: number,
    amount: string = MAX_U256
  ) {
    const tokenContract = new Contract(token.address, ABI_ERC20, this.provider);
    const userAddress = this.getAddress();
    if (userAddress) {
      const allowance = await tokenContract.allowance(userAddress, spender);
      if (
        new BigNumber(allowance.toString()).div(10 ** token.decimals).lt(minAmount) &&
        this.signer
      ) {
        return this.send(tokenContract.approve, spender, amount, this.txOption);
      }
    }
  }

  async updateLogoUrl(tokenSymbol: string, logoUrl: string) {
    const tokenInfo = this.getTokenBySymbol(tokenSymbol);
    if (tokenInfo === undefined) {
      throw new Error(`Token ${tokenSymbol} not found`);
    }
    await this.send(
      this.tokenListContract.updateTokenInfo,
      tokenInfo.index,
      tokenInfo.description,
      tokenInfo.projectUrl,
      logoUrl,
      this.txOption
    );
  }

  async print() {
    console.log('Token balances');
    const balances = await this.getBalances(500);
    if (balances) {
      for (const token of this.getAllToken()) {
        console.log('', token.symbol, balances[token.address]);
      }
    }
  }
}
