/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StructTag } from '@manahippo/move-to-ts';
import { PieceSwapPoolInfo } from 'obric/dist/obric/piece_swap';
import { useCallback, useEffect, useState } from 'react';

import { IPool } from 'types/pool';

import useAptosWallet from './useAptosWallet';
import useCoinStore, { CoinInfo } from './useCoinStore';

const usePools = () => {
  const { obricSDK, liquidityPools } = useAptosWallet();
  const [activePools, setActivePools] = useState<IPool[]>([]);
  const { poolStore } = useCoinStore();

  const parsePoolData = useCallback(
    (pools: PieceSwapPoolInfo[]): IPool[] => {
      let parsedPools: IPool[] = [];
      if (obricSDK) {
        parsedPools = pools.map((pool) => {
          const [lhsType] = (pool.reserve_x.typeTag as StructTag).typeParams as [StructTag];
          const [rhsType] = (pool.reserve_y.typeTag as StructTag).typeParams as [StructTag];
          const token0 = obricSDK.coinList.getCoinInfoByFullName(lhsType.getFullname());
          const token1 = obricSDK.coinList.getCoinInfoByFullName(rhsType.getFullname());
          const token0Reserve = pool.reserve_x.value.toJsNumber() / Math.pow(10, token0.decimals);
          const token1Reserve = pool.reserve_y.value.toJsNumber() / Math.pow(10, token1.decimals);
          // const liquidity = pool.reserve_x.value.add(pool.reserve_y.value).toJsNumber();
          return {
            key: (pool.typeTag as StructTag).address.toString(),
            id: (pool.typeTag as StructTag).address.toString(),
            liquidity: token0Reserve + token1Reserve,
            token0,
            token1,
            volumn7D: '-',
            fees7D: '-',
            apr7D: '-',
            invested: true,
            token0Reserve,
            token1Reserve
          };
        });
      }
      return parsedPools;
    },
    [obricSDK]
  );

  useEffect(() => {
    if (obricSDK && liquidityPools?.length && !activePools.length) {
      const pools = parsePoolData(liquidityPools);
      setActivePools(pools);
    }
  }, [activePools, liquidityPools, obricSDK, parsePoolData]);

  const getOwnedLiquidity = useCallback(
    async (poolAddress) => {
      let result = {
        lp: 0,
        coins: {}
      };
      if (poolStore && obricSDK) {
        const coinInfo = (poolStore[poolAddress] || {}).data as CoinInfo;
        const poolInfo = activePools.find((pool) => pool.id === poolAddress);
        if (coinInfo && poolInfo) {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const { token0, token1, token0Reserve, token1Reserve, liquidity } = poolInfo;
          const lpResources = await obricSDK.aptosClient.getAccountResources(poolAddress);
          const lpPair = lpResources.find(
            (resource) => resource.type === coinInfo.poolName.replace(/CoinStore/g, 'CoinInfo')
          );
          const myLp = coinInfo?.coin?.value / Math.pow(10, (lpPair.data as any).decimals);
          result = {
            lp: myLp,
            coins: {
              [token0.symbol]: liquidity ? (myLp / liquidity) * token0Reserve : 0,
              [token1.symbol]: liquidity ? (myLp / liquidity) * token1Reserve : 0
            }
          };
        }
      }
      return result;
    },
    [activePools, obricSDK, poolStore]
  );

  return {
    activePools,
    getOwnedLiquidity
  };
};

export default usePools;
