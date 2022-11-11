/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StructTag } from '@manahippo/move-to-ts';
import { PieceSwapPoolInfo } from 'obric/dist/obric/piece_swap';
import { useCallback, useEffect, useState } from 'react';
import { IPool } from 'types/pool';
import useAptosWallet from './useAptosWallet';
import useCoinStore, { CoinInfo } from './useCoinStore';
import useTokenAmountFormatter from './useTokenAmountFormatter';

const usePools = () => {
  const { obricSDK, liquidityPools } = useAptosWallet();
  const [activePools, setActivePools] = useState<IPool[]>([]);
  const { poolStore } = useCoinStore();
  const [tokenAmountFormatter] = useTokenAmountFormatter();

  // const searchPoolBySymbol = useCallback(
  //   async (fromT) => {
  //     if (obricSDK) {
  //       const pools = await obricSDK.findPoolBySymbol();
  //     }
  //   },
  //   [second],
  // )

  const parsePoolData = useCallback(
    (pools: PieceSwapPoolInfo[]): IPool[] => {
      let parsedPools: IPool[] = [];
      if (obricSDK) {
        console.log('check pools>>', pools);
        parsedPools = pools.map((pool) => {
          const [lhsType] = (pool.reserve_x.typeTag as StructTag).typeParams as [StructTag];
          const [rhsType] = (pool.reserve_y.typeTag as StructTag).typeParams as [StructTag];
          const token0 = obricSDK.coinList.getCoinInfoByFullName(lhsType.getFullname());
          const token1 = obricSDK.coinList.getCoinInfoByFullName(rhsType.getFullname());
          const liquidity = pool.reserve_x.value.add(pool.reserve_y.value).toJsNumber();
          return {
            id: (pool.typeTag as StructTag).address.toString(),
            liquidity,
            token0,
            token1,
            volumn7D: '-',
            fees7D: '-',
            apr7D: '-',
            invested: true
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
    (poolAddress) => {
      let result = 0;
      console.log('get owned liquidty>>', poolAddress);
      if (poolStore) {
        console.log('get owned liquidty222>>', poolAddress, poolStore, poolStore[poolAddress]);
        const coinInfo = (poolStore[poolAddress] || {}).data as CoinInfo;
        result = coinInfo?.coin?.value;
        // const token = obricSDK.coinList.getCoinInfoByFullName(coinInfo.fullName);
        // result = tokenAmountFormatter(value, token);
        console.log('get owned liquidty333>>', result);
      }
      return result;
    },
    [poolStore]
  );

  return {
    activePools,
    getOwnedLiquidity
  };
};

export default usePools;
