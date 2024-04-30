import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import useMerlinWallet from './useMerlinWallet';

import { Token, TokenInfo } from '../sdk';

export type Balance = number | null;

const useTokenBalance = (token: Token | TokenInfo | undefined): [Balance, boolean] => {
  const { tokenBalances } = useMerlinWallet();

  const balance = useMemo(() => {
    if (tokenBalances && token) {
      return tokenBalances[token.address] !== undefined
        ? new BigNumber(tokenBalances[token.address].toString())
            .div(10 ** token.decimals)
            .toNumber()
        : undefined;
    } else {
      return undefined;
    }
  }, [token, tokenBalances]);

  const isReady = typeof balance === 'number' && balance !== 0;

  return [balance, isReady];
};

export default useTokenBalance;
