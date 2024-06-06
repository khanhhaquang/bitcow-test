import { ContractRunner } from './ContractRunner';
import { Contract, ErrorDescription, Provider, Signer } from 'ethers';

import { CardInfo, TxOption } from './types';

import { LOTTERY_ABI } from './abi/Lottery';

export class Lottery extends ContractRunner {
  private lotteryContract: Contract;
  public address: string;
  constructor(
    provider: Provider,
    public contractAddress: string,
    txOption?: TxOption,
    signer?: Signer
  ) {
    super(provider, txOption, signer);
    this.lotteryContract = new Contract(contractAddress, LOTTERY_ABI, provider);
  }

  formatDecodedError(e: ErrorDescription) {
    switch (e.name) {
      case 'AlreadyClaimed':
        return new Error('This card is already claimed');
      case 'AlreadyIncompleteOrder':
        return new Error('This card is already ordered');
      case 'CardNotExist':
        return new Error('This card is not exist');
      case 'CardSoldOut':
        return new Error('Cards are sold out');
      case 'ExceedsCardPurchaseCap':
        return new Error('Exceeded max purchase cap');
      case 'InsufficientBalance':
        return new Error('Not enough balance');
      case 'InsufficientPayment':
        return new Error('Not enough balance');
      case 'InvalidAmount':
        return new Error('Not enough amount');
      case 'NotSupportPaymentToken':
        return new Error('Not supported payment token');
      case 'OrderNotExist':
        return new Error('Order does not exist');
      default:
        return new Error('Something went wrong');
    }
  }

  async purchase(cardId: number, quantity: number, token: string) {
    try {
      const result = await this.send(this.lotteryContract.purchase, cardId, quantity, token, {});
      return result;
    } catch (error) {
      const decodedError = this.lotteryContract.interface.parseError(error.data);
      throw this.formatDecodedError(decodedError);
    }
  }

  async getCardInfo(id: number): Promise<CardInfo | undefined> {
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
