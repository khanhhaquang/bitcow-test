import { ContractRunner } from './ContractRunner';
import { Contract, Interface, Provider, Signer } from 'ethers';
import { CreateTokenInfo, TxOption } from './types';
import { ABI_SS_TRADING_PAIR_V1_CREATOR } from './abi/SsTradingPairV1Creator';
import { ABI_TOKEN_LIST } from './abi/TokenList';
import { parseEvents } from './utils/common';

export class PoolCreator extends ContractRunner {
    pairCreator: Contract;
    tokenListInterface: Interface;
    constructor(provider: Provider, private pairCreatorAddress: string, txOption?: TxOption, signer?: Signer) {
        super(provider, txOption, signer);
        this.pairCreator = new Contract(pairCreatorAddress, ABI_SS_TRADING_PAIR_V1_CREATOR);
        this.tokenListInterface = new Interface(ABI_TOKEN_LIST);
    }
    afterSetSigner(signer?: Signer) {
        super.afterSetSigner(signer);
        if (signer) {
            this.pairCreator = new Contract(this.pairCreatorAddress, ABI_SS_TRADING_PAIR_V1_CREATOR, signer);
        } else {
            this.pairCreator = new Contract(this.pairCreatorAddress, ABI_SS_TRADING_PAIR_V1_CREATOR);
        }
    }

    async cretePair(
        tokenInfo: CreateTokenInfo,
        mintAmount: string,
        addLiquidityAmount: string,
        bitusdAddLiquidityAmount: string,
        protocolFeeShareThousandth: number,
        feeMillionth: number,
        protocolFeeAddress: string,
        addTokenListFee: string
    ) {
        console.log(tokenInfo);
        console.log(
            mintAmount,
            addLiquidityAmount,
            bitusdAddLiquidityAmount,
            protocolFeeShareThousandth,
            feeMillionth,
            protocolFeeAddress,
            addTokenListFee
        );
        const tx = await this.pairCreator.createPair(
            tokenInfo,
            mintAmount,
            addLiquidityAmount,
            bitusdAddLiquidityAmount,
            protocolFeeShareThousandth,
            feeMillionth,
            protocolFeeAddress,
            { value: addTokenListFee }
        );
        if (tx.status === 1) {
            const receipt = await tx.wait();
            const logs = parseEvents(receipt, [this.tokenListInterface, this.pairCreator.interface]);
            let tokenAddress: string | undefined;
            let pairAddress: string | undefined;
            for (const log of logs) {
                if (log.fragment.name === 'CreateToken') {
                    tokenAddress = log.args[0];
                }
                if (log.fragment.name === 'CreatePair') {
                    pairAddress = log.args[0];
                }
            }
            return { success: true, hash: tx.hash, tokenAddress, pairAddress };
        } else {
            return { success: false, hash: tx.hash };
        }
    }
}
