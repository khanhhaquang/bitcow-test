import { BaseToken } from '../types';
import { BTC, WBTC } from '../configs';

export function isWBTC(token: BaseToken) {
    return token.address === WBTC.address;
}

export function isBTC(token: BaseToken) {
    return token.address === BTC.address;
}
