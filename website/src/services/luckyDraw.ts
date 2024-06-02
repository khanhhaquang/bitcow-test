import { axiosInstance } from 'config/axios';
import { IResponse } from 'types/common';

export interface ITxnLucky {
  isLucky: boolean;
  luckyId: number;
  luckyAmount: number;
  expiryTimestamp: number;
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

export interface ILuckNews {
  address: string;
  amount: string;
  createTime: Date;
  id: string;
  token: string;
  tokenIcon: string;
}

export interface IFreePlayGameOrder {
  orderID: string;
}

export interface ILuckyPickedInfo {
  orderID: string;
  [index: number]: ILuckyCardInfo;
}

export interface ILuckyCardInfo {
  id: string;
  tokens: string[];
  amounts: number[];
  luckyToken: string;
  luckyTokenAddress: string;
  luckyAmount: number;
}

//TODO:  sync from
// http://ec2-13-213-40-242.ap-southeast-1.compute.amazonaws.com:8866/swagger-ui/index.html
export const LuckyDrawService = {
  getTxnLucky: {
    key: 'luckyDraw.getTxnLucky',
    call: (txn: string) =>
      axiosInstance
        .get<IResponse<ITxnLucky>>(`luckDraw/swap/isLucky/${txn}`)
        .then((res) => res.data)
  },
  chooseRewardOption: {
    key: 'luckyDraw.selectRewardOption',
    call: (luckyId: number, choice: RewardChoice) =>
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
      axiosInstance
        .get<IResponse<IFreePlayGameOrder>>(`luckDraw/freePlayGame/${address}`)
        .then((res) => res.data)
  },
  pickCard: {
    key: 'luckyDraw.pickCard',
    call: (orderID: string, cardIndexID: string[]) =>
      axiosInstance
        .get<IResponse<ILuckyPickedInfo>>(`luckDraw/pickCard/${orderID}?cardIndexID=${cardIndexID}`)
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
  },
  getNewsList: {
    key: 'luckyDraw.getNewsList',
    call: () =>
      axiosInstance.get<IResponse<ILuckNews[]>>('luckDraw/getNewsList').then((res) => res.data)
  }
};
