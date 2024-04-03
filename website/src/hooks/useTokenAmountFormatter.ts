import { TokenInfo } from 'obric-merlin';
import { useMemo } from 'react';

import { numberGroupFormat } from 'components/PositiveFloatNumInput/numberFormats';

import useMerlinWallet from './useMerlinWallet';

const useTokenAmountFormatter = () => {
  const { obricSDK } = useMerlinWallet();

  const formatter = useMemo(
    () =>
      (amount: number | undefined | null, token: TokenInfo | undefined): string => {
        if (!obricSDK || typeof amount !== 'number' || amount <= 0 || !token) return '0';

        if (!token) return '0';
        const decimals = token.decimals;
        return numberGroupFormat(amount, decimals);
      },
    [obricSDK]
  );

  return [formatter];
};

export default useTokenAmountFormatter;
