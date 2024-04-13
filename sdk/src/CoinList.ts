import { Token, TokenInfo, TxOption } from './types';
import { BTC } from './configs';
import { Contract, Provider, Signer } from 'ethers';
import { ABI_ERC20 } from './abi/ERC20';
import { MAX_U256 } from './constant';
import BigNumber from 'bignumber.js';
import { ContractRunner } from './ContractRunner';
import { ABI_TOKEN_LIST } from './abi/TokenList';
import { ABI_TOKENS_BALANCE } from './abi/TokensBalance';
import { parseTokenInfo } from './utils/statsV1';
import PromiseThrottle from 'promise-throttle';

export class CoinList extends ContractRunner {
    tokens: TokenInfo[];
    symbolToToken: Record<string, TokenInfo>;
    addressToToken: Record<string, TokenInfo>;
    private contracts: Record<string, Contract>;
    private readonly tokenListContract: Contract;
    private readonly tokensBalanceContract: Contract;

    constructor(
        provider: Provider,
        public tokenListAddress: string,
        private promiseThrottle: PromiseThrottle,
        tokensBalance: string,
        txOption?: TxOption,
        signer?: Signer
    ) {
        super(provider, txOption, signer);
        this.tokens = [];
        this.symbolToToken = {};
        this.addressToToken = {};
        this.contracts = {};

        this.tokenListContract = new Contract(tokenListAddress, ABI_TOKEN_LIST, provider);
        this.tokensBalanceContract = new Contract(tokensBalance, ABI_TOKENS_BALANCE, provider);
    }

    async getCreateFee() {
        return await this.tokenListContract.createFee();
    }

    async reload(firstPaginateCount: number, paginateCount: number, callBack?: (tokens: TokenInfo[]) => void) {
        let resultTokens: TokenInfo[] = [];
        const isThisTokensEmpty = this.tokens.length === 0;
        console.log(`Fetch tokens ${firstPaginateCount} after index 0`);
        const fetchResult = await this.promiseThrottle.add(async () => {
            return this.tokenListContract.fetchTokenListPaginate(0, firstPaginateCount);
        });
        const fetchTokens = fetchResult[0].map(parseTokenInfo);
        const allTokensCount = parseFloat(fetchResult[1].toString());
        if (isThisTokensEmpty) {
            this.tokens = this.tokens.concat(fetchTokens);
            this.buildCache();
        } else {
            resultTokens = resultTokens.concat(fetchTokens);
        }

        callBack && callBack(isThisTokensEmpty ? this.tokens : resultTokens);
        if (fetchResult[0].length < allTokensCount) {
            const promise = [];
            for (let i = firstPaginateCount; i < allTokensCount; i += paginateCount) {
                promise.push(async () => {
                    console.log(`Fetch tokens ${paginateCount} after index ${i} of ${allTokensCount}`);
                    const fetchResult = await this.tokenListContract.fetchTokenListPaginate(i, i + paginateCount);
                    const fetchTokens = fetchResult[0].map(parseTokenInfo);
                    if (isThisTokensEmpty) {
                        this.tokens = this.tokens.concat(fetchTokens);
                        this.buildCache();
                    } else {
                        resultTokens = resultTokens.concat(fetchTokens);
                    }
                    callBack && callBack(isThisTokensEmpty ? this.tokens : resultTokens);
                });
            }
            await this.promiseThrottle.addAll(promise);
        }

        if (!isThisTokensEmpty) {
            this.tokens = resultTokens;
            this.buildCache();
        }
        console.log('Tokens count ', this.tokens.length);
        return this.tokens;
    }

    buildCache() {
        this.symbolToToken = {};
        this.addressToToken = {};
        this.tokens.forEach((token) => {
            this.symbolToToken[token.symbol] = token;
            this.addressToToken[token.address] = token;
        });
        this.contracts = {};
        for (const token of this.tokens) {
            this.contracts[token.address] = new Contract(token.address, ABI_ERC20, this.provider);
        }
    }
    afterSetSigner(signer?: Signer | undefined): void {}
    setTxOption(txOption?: TxOption) {
        this.txOption = txOption;
    }
    getTokenByAddress(address: string): TokenInfo {
        return this.addressToToken[address];
    }
    getTokenBySymbol(symbol: string): TokenInfo {
        return this.symbolToToken[symbol];
    }

    getAllToken() {
        return [BTC, ...this.tokens];
    }

    async getAllowance(token: TokenInfo | Token, spender: string) {
        const userAddress = await this.getAddress();
        if (userAddress) {
            return await this.contracts[token.address].allowance(userAddress, spender);
        }
    }

    async getBalances(pageFetchCount: number, tokens = this.getAllToken().map((token) => token.address)) {
        const userAddress = await this.getAddress();
        if (userAddress) {
            const fetchTokens: string[][] = [];
            for (let i = 0; i < tokens.length; i += pageFetchCount) {
                fetchTokens.push(tokens.slice(i, i + pageFetchCount));
            }
            const promise = [];
            let index = 0;
            for (const fetchToken of fetchTokens) {
                const indexInner = index;
                promise.push(async () => {
                    console.log(`Fetch token balance ${pageFetchCount} after index ${indexInner} of ${tokens.length}`);
                    return this.tokensBalanceContract.balances(userAddress, fetchToken);
                });
                index += fetchToken.length;
            }
            const balances = await this.promiseThrottle.addAll(promise);
            console.log('Fetch tokens balance end');
            const balancesResult: Record<string, bigint> = {};
            tokens.forEach((token, index) => {
                balancesResult[token] = balances[Math.floor(index / pageFetchCount)][index % pageFetchCount];
            });
            return balancesResult;
        }
    }

    async approve(token: TokenInfo | Token, spender: string, minAmount: number, amount: string = MAX_U256) {
        const allowance = await this.getAllowance(token, spender);
        if (new BigNumber(allowance.toString()).div(10 ** token.decimals).lt(minAmount) && this.signer) {
            const tokenContract = this.contracts[token.address];
            const result = await this.send(tokenContract.approve, spender, amount, this.txOption);
            return result;
        }
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
