import { IResponse } from 'types/common';
import { axiosInstance } from 'config/axios';

export interface ITxnLucky {
  isLucky: boolean;
  luckyId: string;
  amount: string;
}

export interface ISelectReward {
  scratchId: string;
  numberCards: number;
}

export enum RewardChoice {
  RECEIVE_AIRDROP = 0,
  SCRATCH_CARDS = 1
}

export interface ITokenAward {
  id: number;
  contractAddress: string;
  tokenSymbol: string;
  tokenIcon: string;
  price: number;
  decimals: number;
}
//TODO:  sync from
// http://ec2-13-213-40-242.ap-southeast-1.compute.amazonaws.com:8866/swagger-ui/index.html
export const LuckyDrawService = {
  getTxnLucky: {
    key: 'luckyDraw.getTxnLucky',
    call: (txn: string) =>
      axiosInstance
        .get<IResponse<ITxnLucky>>(`luckyDraw/swap/isLucky/${txn}`)
        .then((res) => res.data)
  },
  chooseRewardOption: {
    key: 'luckyDraw.selectRewardOption',
    call: (luckyId: string, choice: RewardChoice) =>
      axiosInstance
        .get<IResponse<{}>>(`luckDraw/swap/chooseReward/${choice}/${luckyId}`)
        .then((res) => res.data)
  },
  requestPlayGame: {
    key: 'luckyDraw.requestPlayGame',
    call: (txn: string) =>
      axiosInstance.get<IResponse<{}>>(`luckDraw/playGame/${txn}`).then((res) => res.data)
  },
  freePlayGame: {
    key: 'luckyDraw.freePlayGame',
    call: (address: string) =>
      axiosInstance.get<IResponse<{}>>(`luckDraw/freePlayGame/${address}`).then((res) => res.data)
  },
  pickCard: {
    key: 'luckyDraw.pickCard',
    call: (txn: string, cardIndexID: string[]) =>
      axiosInstance
        .get<IResponse<{}>>(`luckDraw/pickCard/${txn}?cardIndexID=${cardIndexID}`)
        .then((res) => res.data)
  },
  freePickCard: {
    key: 'luckyDraw.freePickCard',
    call: (orderID: string, cardIndexID: string[]) =>
      axiosInstance
        .get<IResponse<{}>>(`luckDraw/freePickCard/${orderID}?cardIndexID=${cardIndexID}`)
        .then((res) => res.data)
  },
  claim: {
    key: 'luckyDraw.claim',
    call: (orderID: string) =>
      axiosInstance.get<IResponse<{}>>(`luckDraw/claim/${orderID}`).then((res) => res.data)
  },
  getTokenAwardList: {
    key: 'luckyDraw.getTokenAwardList',
    call: () =>
      axiosInstance
        .get<IResponse<ITokenAward[]>>('luckDraw/getTokenAwardList')
        .then((res) => res.data)
  }
};
