import { BaseToken, TxOption } from './types';
import { BTC, PoolConfig } from './configs';
import { Contract, Provider, Signer } from 'ethers';
import { ABI_ERC20 } from './abi/ERC20';
import { MAX_U256 } from './constant';
import BigNumber from 'bignumber.js';
import { ContractRunner } from './ContractRunner';

export class CoinList extends ContractRunner {
    readonly tokens: BaseToken[];
    private readonly symbolToToken: Record<string, BaseToken>;
    private readonly addressToToken: Record<string, BaseToken>;
    private readonly contracts: Record<string, Contract>;
    constructor(provider: Provider, public poolConfigs: PoolConfig[], txOption?: TxOption, signer?: Signer) {
        super(provider, txOption, signer);
        const tokensSet = new Set<BaseToken>();
        poolConfigs.map((poolConfig) => {
            tokensSet.add(poolConfig.xToken);
            tokensSet.add(poolConfig.yToken);
        });
        this.tokens = Array.from(tokensSet.keys());
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
    getTokenByAddress(address: string): BaseToken {
        return this.addressToToken[address];
    }
    getTokenBySymbol(symbol: string): BaseToken {
        return this.symbolToToken[symbol];
    }

    getAllToken() {
        return [BTC, ...this.tokens];
    }

    async getAllowance(token: BaseToken, spender: string) {
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
