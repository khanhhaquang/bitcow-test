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
  }
};
