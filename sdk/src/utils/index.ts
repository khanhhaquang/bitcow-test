import { BaseToken } from '../types';
import { BTC } from '../configs';

export function isBTC(token: BaseToken) {
    return token.address === BTC.address;
}
