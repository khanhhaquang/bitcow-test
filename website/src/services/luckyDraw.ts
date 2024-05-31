import { Hash } from 'viem';

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
    call: (txn: Hash) =>
      axiosInstance.post<IResponse<ITxnLucky>>(`/luckyDraw/swap?txn=${txn}`).then((res) => res.data)
  },
  selectRewardOption: {
    key: 'luckyDraw.selectRewardOption',
    call: (luckyId: string, choice: RewardChoice) =>
      axiosInstance
        .post<IResponse<ITxnLucky>>(`/luckyDraw/swap/choice?luckId=${luckyId}&choice=${choice}`)
        .then((res) => res.data)
  }
};
