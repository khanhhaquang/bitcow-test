import { type WalletMetadata } from './base';
import { InjectedConnector } from './injected';

import icon from '../icons/bybit.png';

export class BybitConnector extends InjectedConnector {
  readonly metadata: WalletMetadata = {
    id: 'bybit',
    name: 'Bybit Wallet',
    icon,
    downloadUrl: 'https://www.bybit.com/download/'
  };

  constructor() {
    super('bybitWallet.bitcoin');
  }
}
