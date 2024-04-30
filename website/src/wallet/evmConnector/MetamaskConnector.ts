import { MetaMask } from '@web3-react/metamask';

import type { WalletMetadata } from '../connector';
import type { Metadata } from '../types/types';
import metamaskIcon from '../icons/wallet/metamask.svg';

export class MetamaskConnector extends MetaMask implements Metadata {
  get metadata(): WalletMetadata {
    return { id: 'metamask', name: 'Metamask', icon: metamaskIcon, downloadUrl: 'dasad' };
  }
}
