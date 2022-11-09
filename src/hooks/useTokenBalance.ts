import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { useMemo } from 'react';
import invariant from 'tiny-invariant';
import { RawCoinInfo } from '@manahippo/coin-list';
import useAptosWallet from './useAptosWallet';
import useCoinStore, { CoinInfo } from './useCoinStore';

export type Balance = number | null;

const useTokenBalane = (token: RawCoinInfo | undefined): [Balance, boolean] => {
  const { obricSDK } = useAptosWallet();
  const { coinStore } = useCoinStore();
  // const { getTokenInfoByFullName, getTokenStoreByFullName } = useHippoClient();
  const { connected } = useWallet();

  const inputTokenBalance = useMemo(() => {
    if (token && connected && obricSDK) {
      const fullName = token.token_type.type;
      const tokenInfo = obricSDK.coinList.getCoinInfoByFullName(fullName);
      invariant(tokenInfo, `Can't find token info of symbol ${token.symbol}`);
      const tokenStore = coinStore[fullName];
      if (!tokenStore) return 0;
      return tokenStore
        ? (tokenStore.data as CoinInfo).coin.value / Math.pow(10, tokenInfo.decimals)
        : 0;
    } else {
      return null;
    }
  }, [coinStore, connected, obricSDK, token]);

  const isReady = typeof inputTokenBalance === 'number';

  return [inputTokenBalance, isReady];
};

export default useTokenBalane;
