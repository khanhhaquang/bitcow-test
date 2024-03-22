import type { ExternalProvider } from '@ethersproject/providers';
import type { IEthereumProvider } from '@particle-network/aa';
import type { Connector } from '@web3-react/types';

import type { WalletMetadata } from '../connector';

export type EvmConnector = Connector & Metadata;

export interface Metadata {
  get metadata(): WalletMetadata;
}

export enum WalletType {
  BTC = 'BTC',
  EVM = 'EVM'
}

export type Wallet = {
  type: WalletType;
  metadata: WalletMetadata;
  provider: ExternalProvider | IEthereumProvider;
  accounts: { evm: string; btc?: string }[];
};
