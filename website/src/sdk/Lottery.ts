import { ContractRunner } from './ContractRunner';
import { Contract, Provider, Signer } from 'ethers';

import { CardInfo, TxOption } from './types';

import { LOTTERY_ABI } from './abi/Lottery';

export class Lottery extends ContractRunner {
  private lotteryContract: Contract;

  constructor(
    provider: Provider,
    public contractAddress: string,
    txOption?: TxOption,
    signer?: Signer
  ) {
    super(provider, txOption, signer);
    this.lotteryContract = new Contract(contractAddress, LOTTERY_ABI, provider);
  }

  async purchase(cardId: number, quantity: number, token: string) {
    return this.send(this.lotteryContract.purchase, cardId, quantity, token);
  }

  async getCardInfo(id: number): Promise<CardInfo> {
    const card: CardInfo = await this.lotteryContract.getCardInfo(id);
    return card;
  }
}
