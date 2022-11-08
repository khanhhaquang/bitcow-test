import { MoveResource } from 'aptos/src/generated';
import { useCallback, useEffect, useState } from 'react';
import useAptosWallet from './useAptosWallet';

const useCoinStore = () => {
  const { walletResource } = useAptosWallet();
  const [coinStore, setCoinStore] = useState<Record<string, MoveResource>>({});

  const fetchAllCoinInfo = useCallback(async () => {
    const resources = {};
    const coinResources = walletResource.filter((resource) =>
      resource.type.startsWith('0x1::coin::CoinStore')
    );
    coinResources.map(async (resource) => {
      const type = resource.type.replace(/(0x1::coin::CoinStore<)|>/g, '');
      resources[type] = resource;
    });
    setCoinStore(resources);
    console.log('fetch all coin info>>>>', coinResources);
  }, [walletResource]);

  useEffect(() => {
    if (walletResource?.length > 0) {
      fetchAllCoinInfo();
    }
  }, [fetchAllCoinInfo, walletResource]);

  return { coinStore };
};

export default useCoinStore;
