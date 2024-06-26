import { AddEthereumChainParameter } from '@web3-react/types';

import { Config, TokenInfo } from '../sdk';

export interface FilteredToken {
  token: TokenInfo;
  searched: boolean;
  balance: number;
  value: number;
}
export type NetworkConfig = {
  chainConfig: AddEthereumChainParameter;
  sdkConfig: Config;
  rpcNodeUrl: string;
  icon: string;
  requestsPerSecond: number;
  poolsFirstPaginateCount: number;
  poolsPaginateCount: number;
  tokensFirstPaginateCount: number;
  tokensPaginateCount: number;
  balancePaginateCount: number;
  fetchAllTokenBalance: boolean;
  bridgeUrl?: string;
};
