import { WalletConnect } from '@web3-react/walletconnect-v2';

import type { WalletMetadata } from '../connector';
import walletconnectIcon from '../icons/wallet/walletconnect-icon.svg';
import type { Metadata } from '../types/types';

export class WalletconnectV2Connector extends WalletConnect implements Metadata {
  get metadata(): WalletMetadata {
    return { id: 'walletconnect', name: 'WalletConnect', icon: walletconnectIcon, downloadUrl: '' };
  }
}
