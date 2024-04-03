import { TokenInfo } from 'obric-merlin';
import { useMemo } from 'react';

import useMerlinWallet from './useMerlinWallet';

export type Balance = number | null;

const useTokenBalance = (token: TokenInfo | undefined): [Balance, boolean] => {
  const { tokenBalances } = useMerlinWallet();

  const balance = useMemo(() => {
    if (tokenBalances && token) {
      return tokenBalances[token.address];
    } else {
      return undefined;
    }
  }, [token, tokenBalances]);

  const isReady = typeof balance === 'number' && balance !== 0;

  return [balance, isReady];
};

export default useTokenBalance;
