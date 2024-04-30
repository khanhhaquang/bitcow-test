import BigNumber from 'bignumber.js';

import { Token, TokenInfo } from '../sdk';

export const toTruncateStr = (str: string, sliceLength = -200, maxLength = 200): string => {
  if (str.length >= maxLength) {
    return str.slice(sliceLength);
  }
  return str;
};

export const bigintTokenBalanceToNumber = (token: Token | TokenInfo, balance: bigint) => {
  return new BigNumber(balance.toString()).div(10 ** token.decimals).toNumber();
};
