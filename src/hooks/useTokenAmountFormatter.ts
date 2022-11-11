import { RawCoinInfo as CoinInfo } from '@manahippo/coin-list';
import { useMemo } from 'react';

import { numberGroupFormat } from 'components/PositiveFloatNumInput/numberFormats';

import useAptosWallet from './useAptosWallet';

const useTokenAmountFormatter = () => {
  const { obricSDK } = useAptosWallet();

  const formatter = useMemo(
    () =>
      (amount: number | undefined | null, token: CoinInfo | undefined): string => {
        if (!obricSDK || typeof amount !== 'number' || amount < 0 || !token) return '';
        const tokenInfo = obricSDK.coinList.getCoinInfoByFullName(token.token_type.type);
        if (!tokenInfo) return '';
        const decimals = tokenInfo.decimals;
        return numberGroupFormat(amount, decimals);
      },
    [obricSDK]
  );

  return [formatter];
};

export default useTokenAmountFormatter;
