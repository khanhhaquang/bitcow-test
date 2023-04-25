import { parseMoveStructTag, StructTag } from '@manahippo/move-to-ts';
import { MoveResource } from 'aptos/src/generated';
import { useCallback, useEffect, useState } from 'react';

import useAptosWallet from './useAptosWallet';

export type CoinInfo = {
  coin: {
    value: number;
  };
  frozen: boolean;
  deposit_events: Record<string, any>;
  withdraw_events: Record<string, any>;
  fullName: string;
  poolName?: string;
};

const useCoinStore = () => {
  const { walletResource, obricSDK, activeWallet } = useAptosWallet();
  const [coinStore, setCoinStore] = useState<Record<string, MoveResource>>();
  const [poolStore, setPoolStore] = useState<Record<string, MoveResource>>();

  const fetchAllCoinInfo = useCallback(async () => {
    if (obricSDK) {
      const tokenResources = {};
      const poolResources = {};

      walletResource.map((resource) => {
        const structType = parseMoveStructTag(resource.type);
        const {
          module,
          name,
          typeParams: [token]
        } = structType;
        const tokenType = token as StructTag;
        if (module === 'coin' && name === 'CoinStore') {
          if (['piece_swap', 'ssswap2'].includes(tokenType.module)) {
            const poolIdentifier = tokenType.getFullname();
            poolResources[poolIdentifier] = resource;
            poolResources[poolIdentifier].data = {
              ...poolResources[poolIdentifier].data,
              fullName: tokenType.getFullname(),
              poolName: structType.getFullname()
            };
          } else {
            const tokenFullname = tokenType.getFullname();
            tokenResources[tokenFullname] = resource;
            tokenResources[tokenFullname].data = {
              ...tokenResources[tokenFullname].data,
              fullName: tokenType.getFullname()
            };
          }
        }
      });
      setCoinStore(tokenResources);
      setPoolStore(poolResources);
    }
  }, [obricSDK, walletResource]);

  useEffect(() => {
    if (!activeWallet && (coinStore || poolStore)) {
      setCoinStore(null);
      setPoolStore(null);
    }
  }, [activeWallet, coinStore, poolStore]);

  useEffect(() => {
    if (activeWallet && walletResource?.length > 0) {
      fetchAllCoinInfo();
    }
  }, [activeWallet, fetchAllCoinInfo, walletResource]);

  return { coinStore, poolStore };
};

export default useCoinStore;
