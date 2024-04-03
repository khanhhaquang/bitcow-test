import { TokenInfo } from '../types';
import { BTC } from '../configs';

export function isBTC(token: TokenInfo) {
    return token.address === BTC.address;
}
