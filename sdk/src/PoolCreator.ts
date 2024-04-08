import { ContractRunner } from './ContractRunner';
import { Contract, Interface, Provider, Signer } from 'ethers';
import { CreateTokenInfo, TxOption } from './types';
import { ABI_SS_TRADING_PAIR_V1_CREATOR } from './abi/SsTradingPairV1Creator';
import { ABI_TOKEN_LIST } from './abi/TokenList';

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
        return await this.send(
            this.pairCreator.createPair,
            tokenInfo,
            mintAmount,
            addLiquidityAmount,
            bitusdAddLiquidityAmount,
            protocolFeeShareThousandth,
            feeMillionth,
            protocolFeeAddress,
            { value: addTokenListFee }
        );
    }
}
