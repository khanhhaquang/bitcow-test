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
    try {
      const card = await this.lotteryContract.getCardInfo(id);
      if (card) {
        const cardInfo: CardInfo = card.toObject();
        cardInfo.price = Number(cardInfo.price.toString()) / 10 ** 18;
        cardInfo.cardId = Number(cardInfo.cardId.toString());
        cardInfo.purchaseCap = Number(cardInfo.purchaseCap.toString());
        cardInfo.totalSold = Number(cardInfo.totalSold.toString());
        cardInfo.totalSupply = Number(cardInfo.totalSupply.toString());

        return cardInfo;
      }
      return undefined;
    } catch (e) {
      throw e;
    }
  }
}
