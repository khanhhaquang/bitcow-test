import { IResponse } from 'types/common';
import { axiosInstance } from 'config/axios';

export enum GameProgress {
  PAID = 1,
  CARD_SELECTED = 2
}

export interface UserInfo {
  isGameActive: boolean;
  freePlayGame: boolean;
  freePlayCount: number;
  freePlayOrderID: number;
  gameProgress?: GameProgress;
}

//TODO:  sync from
// http://ec2-13-213-40-242.ap-southeast-1.compute.amazonaws.com:8866/swagger-ui/index.html
export const UserService = {
  activateInviteCode: {
    key: 'user.activateInviteCode',
    call: (address: string, inviteCode: string) =>
      axiosInstance
        .get<IResponse<{}>>('user/activateInviteCode', { params: { address, inviteCode } })
        .then((res) => res.data)
  },
  login: {
    key: 'user.login',
    call: (address: string, signature: string) =>
      axiosInstance
        .get<IResponse<{}>>('user/login', { params: { address, signature } })
        .then((res) => res.data)
  },
  getUserInfo: {
    key: 'user.getUserInfo',
    call: (address: string) =>
      axiosInstance.get<IResponse<UserInfo>>(`user/getUserInfo/${address}`).then((res) => res.data)
  }
};
