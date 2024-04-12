import { TokenInfo, TxOption } from './types';
import { BTC } from './configs';
import { Contract, Provider, Signer } from 'ethers';
import { ABI_ERC20 } from './abi/ERC20';
import { MAX_U256 } from './constant';
import BigNumber from 'bignumber.js';
import { ContractRunner } from './ContractRunner';
import { ABI_TOKEN_LIST } from './abi/TokenList';
import { ABI_TOKENS_BALANCE } from './abi/TokensBalance';
import { parseTokenInfo } from './utils/statsV1';

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

    async reload() {
        const paginateCount = 500;
        let resultTokens: TokenInfo[] = [];
        const fetchResult = await this.tokenListContract.fetchTokenListPaginate(0, paginateCount);
        resultTokens = resultTokens.concat(fetchResult[0].map(parseTokenInfo));
        if (fetchResult[0].length < parseFloat(fetchResult[1].toString())) {
            const promise = [];
            for (let i = paginateCount; i < parseFloat(fetchResult[1].toString()); i += paginateCount) {
                promise.push(this.tokenListContract.fetchTokenListPaginate(i, i + paginateCount));
            }
            const promiseTokens = await Promise.all(promise);
            for (const promiseToken of promiseTokens) {
                resultTokens = resultTokens.concat(promiseToken[0].map(parseTokenInfo));
            }
        }
        this.tokens = resultTokens;
        this.buildCache();
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

    async getAllowance(token: TokenInfo, spender: string) {
        const userAddress = await this.getAddress();
        if (userAddress) {
            return await this.contracts[token.address].allowance(userAddress, spender);
        }
    }

    async getBalances(tokens = this.getAllToken().map((token) => token.address)) {
        const userAddress = await this.getAddress();
        if (userAddress) {
            const maxTokenCount = 500;
            const fetchTokens: string[][] = [];
            for (let i = 0; i < tokens.length; i += maxTokenCount) {
                fetchTokens.push(tokens.slice(i, i + maxTokenCount));
            }
            const promise = [];
            for (const fetchToken of fetchTokens) {
                promise.push(this.tokensBalanceContract.balances(userAddress, fetchToken));
            }
            const balances = await Promise.all(promise);
            const balancesResult: Record<string, bigint> = {};
            tokens.forEach((token, index) => {
                balancesResult[token] = balances[Math.floor(index / maxTokenCount)][index % maxTokenCount];
            });
            return balancesResult;
        }
    }

    async approve(token: TokenInfo, spender: string, minAmount: number, amount: string = MAX_U256) {
        const allowance = await this.getAllowance(token, spender);
        if (new BigNumber(allowance.toString()).div(10 ** token.decimals).lt(minAmount) && this.signer) {
            const tokenContract = this.contracts[token.address];
            const result = await this.send(tokenContract.approve, spender, amount, this.txOption);
            return result;
        }
    }

    async print() {
        console.log('Token balances');
        const balances = await this.getBalances();
        if (balances) {
            for (const token of this.getAllToken()) {
                console.log('', token.symbol, balances[token.address]);
            }
        }
    }
}
