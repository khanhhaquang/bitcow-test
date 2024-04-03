import { TokenInfo, Config, TxOption } from './types';
import { BTC } from './configs';
import { Contract, Provider, Signer } from 'ethers';
import { ABI_ERC20 } from './abi/ERC20';
import { MAX_U256 } from './constant';
import BigNumber from 'bignumber.js';
import { ContractRunner } from './ContractRunner';
import { ABI_TOKEN_LIST } from './abi/TokenList';

export class CoinList extends ContractRunner {
    tokens: TokenInfo[];
    private symbolToToken: Record<string, TokenInfo>;
    private addressToToken: Record<string, TokenInfo>;
    private contracts: Record<string, Contract>;
    private readonly tokenListContract: Contract;
    /**
     * tokenAddress => spender => value
     * @private
     */
    private allowances: Record<string, Record<string, bigint>>;
    constructor(provider: Provider, public config: Config, txOption?: TxOption, signer?: Signer) {
        super(provider, txOption, signer);
        this.tokens = [];
        this.symbolToToken = {};
        this.addressToToken = {};
        this.contracts = {};
        this.allowances = {};
        this.tokenListContract = new Contract(config.tokenList, ABI_TOKEN_LIST, provider);
    }

    async reload() {
        const paginateCount = 1000;
        this.tokens = [];
        for (let start = 0; ; start++) {
            const fetchResult = await this.tokenListContract.fetchTokenListPaginate(start, start + paginateCount);
            const tokens = fetchResult[0];
            this.tokens = this.tokens.concat(
                tokens.map((token: any) => {
                    return {
                        address: token.tokenAddress,
                        name: token.name,
                        symbol: token.symbol,
                        decimals: Number(token.decimals.toString()),
                        description: token.description,
                        projectUrl: token.projectUrl,
                        logoUrl: token.logoUrl,
                        coingeckoId: token.coingeckoId
                    };
                })
            );
            const tokenCount = Number(fetchResult[1].toString());
            if (tokens.length + start <= tokenCount) {
                break;
            } else {
                start += paginateCount;
            }
        }
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

    async getBalances() {
        const userAddress = await this.getAddress();
        if (userAddress) {
            const balancesResult: Record<string, number> = {};
            const balances = await Promise.all([
                this.provider.getBalance(userAddress),
                ...this.tokens.map(async (token) => {
                    return await this.contracts[token.address].balanceOf(userAddress);
                })
            ]);
            balancesResult[BTC.address] = new BigNumber(balances[0].toString()).div(10 ** BTC.decimals).toNumber();
            this.tokens.forEach((token, index) => {
                balancesResult[token.address] = new BigNumber(balances[index + 1].toString())
                    .div(10 ** token.decimals)
                    .toNumber();
            });
            return balancesResult;
        }
    }

    async approve(token: BaseToken, spender: string, minAmount: number, amount: string = MAX_U256) {
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
            for (const token of this.tokens) {
                console.log('', token.symbol, balances[token.address]);
            }
        }
    }
}
