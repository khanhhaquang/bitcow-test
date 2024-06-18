import { IResponse } from 'types/common';
import { campaignAxiosInstance } from 'config/axios';
import { ITaskRecord } from 'pages/Campaign/types';

export interface ITaskInfo {
  [index: number]: ITaskRecord;
}

export const CampaignService = {
  getTasks: {
    key: 'campaign.getTasks',
    call: (address: string, activityid: string) =>
      campaignAxiosInstance
        .get<IResponse<ITaskInfo>>('airdrop/bitlayer/tasks', { params: { address, activityid } })
        .then((res) => res.data)
  }
};
