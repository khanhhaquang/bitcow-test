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
  const [filters, setFilters] = useState({
    onlyInvested: false
  });

  const checkIfInvested = useCallback(
    (poolAddress) => {
      const pool = poolStore && poolStore[poolAddress.replace(/PieceSwapPoolInfo/g, 'LPToken')];
      if (pool) {
        const coinInfo = pool.data as CoinInfo;
        return coinInfo?.coin?.value > 0;
      }
      return false;
    },
    [poolStore]
  );

  const getPoolResources = useCallback(
    async (address, poolName) => {
      if (obricSDK) {
        const lpResources = await obricSDK.aptosClient.getAccountResources(address);
        const lpPair = lpResources.find(
          (resource) => resource.type === poolName.replace(/CoinStore/g, 'CoinInfo')
        );
        console.log('checkcccc', lpResources, poolName.replace(/CoinStore/g, 'CoinInfo'), lpPair);
        return lpPair;
      }
    },
    [obricSDK]
  );

  const parsePoolData = useCallback(
    async (pools: PieceSwapPoolInfo[]) => {
      let parsedPools: IPool[] = [];
      if (obricSDK) {
        console.log('pasr');
        const filteredPools = pools;
        parsedPools = await Promise.all(
          filteredPools.map(async (pool) => {
            const address = (pool.typeTag as StructTag).address.toString();
            const poolName = (pool.typeTag as StructTag).getAptosMoveTypeTag();
            const [lhsType] = (pool.reserve_x.typeTag as StructTag).typeParams as [StructTag];
            const [rhsType] = (pool.reserve_y.typeTag as StructTag).typeParams as [StructTag];
            const token0 = obricSDK.coinList.getCoinInfoByFullName(lhsType.getFullname());
            const token1 = obricSDK.coinList.getCoinInfoByFullName(rhsType.getFullname());
            const token0Reserve = pool.reserve_x.value.toJsNumber() / Math.pow(10, token0.decimals);
            const token1Reserve = pool.reserve_y.value.toJsNumber() / Math.pow(10, token1.decimals);
            // const liquidity = pool.reserve_x.value.add(pool.reserve_y.value).toJsNumber();
            const lpPair = await getPoolResources(
              address,
              `0x1::coin::CoinInfo<${poolName.replace(/PieceSwapPoolInfo/g, 'LPToken')}>`
            );
            const { decimals } = lpPair.data as { decimals: number };

            return {
              id: poolName,
              address,
              liquidity: pool.lp_amt.toJsNumber() / Math.pow(10, decimals),
              token0,
              token1,
              volumn7D: '-',
              fees7D: '-',
              apr7D: '-',
              invested: true,
              token0Reserve,
              token1Reserve,
              decimals
            };
          })
        );
      }
      setActivePools(parsedPools);
    },
    [getPoolResources, obricSDK]
  );

  useEffect(() => {
    console.log('HELLO>>>', obricSDK?.pools, liquidityPools, activePools);
    if (obricSDK && liquidityPools?.length && !activePools.length) {
      parsePoolData(liquidityPools);
    }
  }, [activePools, liquidityPools, obricSDK, parsePoolData]);

  const getOwnedLiquidity = useCallback(
    async (poolAddress) => {
      let result = {
        lp: 0,
        coins: {}
      };
      if (poolStore && obricSDK) {
        const coinInfo = (poolStore[poolAddress.replace(/PieceSwapPoolInfo/g, 'LPToken')] || {})
          .data as CoinInfo;
        const poolInfo = activePools.find((pool) => pool.id === poolAddress);
        if (coinInfo && poolInfo) {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const { token0, token1, token0Reserve, token1Reserve, liquidity, decimals } = poolInfo;
          const myLp = coinInfo?.coin?.value / Math.pow(10, decimals);
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
    getOwnedLiquidity,
    checkIfInvested,
    setFilters
  };
};

export default usePools;
