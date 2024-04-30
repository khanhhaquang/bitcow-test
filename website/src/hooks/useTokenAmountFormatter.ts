import { useMemo } from 'react';

import { numberGroupFormat } from 'components/PositiveFloatNumInput/numberFormats';

import useMerlinWallet from './useMerlinWallet';

import { Token, TokenInfo } from '../sdk';

const useTokenAmountFormatter = () => {
  const { bitcowSDK } = useMerlinWallet();

  const formatter = useMemo(
    () =>
      (amount: number | undefined | null, token: Token | TokenInfo | undefined): string => {
        if (!bitcowSDK || typeof amount !== 'number' || amount <= 0 || !token) return '0';

        if (!token) return '0';
        // const decimals = token.decimals;
        return numberGroupFormat(amount, 9);
      },
    [bitcowSDK]
  );

  return [formatter];
};

export default useTokenAmountFormatter;
