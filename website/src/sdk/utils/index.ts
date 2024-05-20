import { BTC } from '../configs';
import { TokenInfo } from '../types';

export function isBTC(token: TokenInfo) {
  return token.address === BTC.address;
}

export function isWBTC(token: TokenInfo) {
  return token.symbol === 'WBTC';
}
