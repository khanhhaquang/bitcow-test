import { IResponse } from 'types/common';
import { campaignAxiosInstance } from 'config/axios';
import { ITaskRecord } from 'pages/Campaign/types';

export const CampaignService = {
  getTasks: {
    key: 'campaign.getTasks',
    call: (address: string, activityid: string) =>
      campaignAxiosInstance
        .get<IResponse<ITaskRecord[]>>('airdrop/bitlayer/tasks', {
          params: { address, activityid }
        })
        .then((res) => res.data)
  }
};
