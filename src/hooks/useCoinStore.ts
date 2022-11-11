import { MoveResource } from 'aptos/src/generated';
import { useCallback, useEffect, useState } from 'react';
import { parseMoveStructTag, StructTag } from '@manahippo/move-to-ts';
import useAptosWallet from './useAptosWallet';

export type CoinInfo = {
  coin: {
    value: number;
  };
  frozen: boolean;
  deposit_events: Record<string, any>;
  withdraw_events: Record<string, any>;
  fullName: string;
};

const useCoinStore = () => {
  const { walletResource, obricSDK } = useAptosWallet();
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
          if (tokenType.module === 'piece_swap') {
            const poolAddress = tokenType.address.toString();
            poolResources[poolAddress] = {
              ...resource,
              fullName: tokenType.getFullname()
            };
          } else {
            const tokenFullname = tokenType.getFullname();
            tokenResources[tokenFullname] = {
              ...resource,
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
    if (walletResource?.length > 0) {
      fetchAllCoinInfo();
    }
  }, [fetchAllCoinInfo, walletResource]);

  return { coinStore, poolStore };
};

export default useCoinStore;
