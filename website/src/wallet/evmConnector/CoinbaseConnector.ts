import { CoinbaseWallet } from '@web3-react/coinbase-wallet';

import type { WalletMetadata } from '../connector';
import type { Metadata } from '../types/types';
import coinbaseIcon from '../icons/wallet/coinbase-icon.svg';

export class CoinbaseConnector extends CoinbaseWallet implements Metadata {
  get metadata(): WalletMetadata {
    return { id: 'coinbase', name: 'Coinbase', icon: coinbaseIcon, downloadUrl: '' };
  }
}
