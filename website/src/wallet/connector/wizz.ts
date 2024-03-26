import { type WalletMetadata } from './base';
import { InjectedConnector } from './injected';

import icon from '../icons/wizz.svg';

export class WizzConnector extends InjectedConnector {
  readonly metadata: WalletMetadata = {
    id: 'wizz',
    name: 'Wizz Wallet',
    icon,
    downloadUrl: 'https://wizzwallet.io'
  };

  constructor() {
    super('wizz');
  }
}
