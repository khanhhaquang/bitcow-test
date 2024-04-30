import { WalletConnect } from '@web3-react/walletconnect-v2';

import type { WalletMetadata } from '../connector';
import type { Metadata } from '../types/types';
import walletConnectIcon from '../icons/wallet/wallet-connect.svg';

export class WalletconnectV2Connector extends WalletConnect implements Metadata {
  get metadata(): WalletMetadata {
    return { id: 'walletconnect', name: 'WalletConnect', icon: walletConnectIcon, downloadUrl: '' };
  }
}
