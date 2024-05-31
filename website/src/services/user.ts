import { Address } from 'viem';

import { IResponse } from 'types/common';
import { axiosInstance } from 'config/axios';

//TODO:  sync from
// http://ec2-13-213-40-242.ap-southeast-1.compute.amazonaws.com:8866/swagger-ui/index.html
export const UserService = {
  activateInviteCode: {
    key: 'user.activateInviteCode',
    call: (address: Address, inviteCode: string) =>
      axiosInstance
        .get<IResponse<{}>>(`/user/activateInviteCode`, { params: { address, inviteCode } })
        .then((res) => res.data)
  }
};
