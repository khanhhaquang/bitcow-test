/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RawCoinInfo } from '@manahippo/coin-list';
import { StructTag } from '@manahippo/move-to-ts';
import { PieceSwapPoolInfo } from 'obric/dist/obric/piece_swap';
import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';

import { numberGroupFormat } from 'components/PositiveFloatNumInput/numberFormats';
import useAptosWallet from 'hooks/useAptosWallet';
import useCoinStore, { CoinInfo } from 'hooks/useCoinStore';
import { IPool, IPoolFilters } from 'types/pool';
import { openErrorNotification } from 'utils/notifications';

interface PoolsContextType {
  activePools: IPool[];
  coinInPools: Record<string, any>;
  getTokenBalanceInUSD: (balance: number, token: RawCoinInfo) => string;
  getPoolTVL: (pool: IPool) => number;
  getOwnedLiquidity: (
    address: string
  ) => Promise<{ lp: number; coins: Record<string, any>; myCoins: Record<string, any> }>;
  checkIfInvested: (address: string) => boolean;
  setPoolFilter: React.Dispatch<React.SetStateAction<IPoolFilters>>;
  poolFilter: IPoolFilters;
  getPoolStatsByTimebasis: (pool: IPool) => {
    volume: number;
    fees: number;
    apr: number;
  };
}

interface TProviderProps {
  children: ReactNode;
}

const PoolsContext = createContext<PoolsContextType>({} as PoolsContextType);

const PoolsProvider: React.FC<TProviderProps> = ({ children }) => {
  const { obricSDK, liquidityPools } = useAptosWallet();
  const [activePools, setActivePools] = useState<IPool[]>([]);
  const [coinInPools, setCoinInPools] = useState<Record<string, number>>();
  const [fetching, setFetching] = useState(false);
  const { poolStore } = useCoinStore();
  const [poolFilter, setPoolFilter] = useState<IPoolFilters>({
    text: '',
    timeBasis: '24H',
    sortBy: [
      {
        field: 'liquidity',
        order: 'descend'
      }
    ]
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
        return lpPair;
      }
    },
    [obricSDK]
  );

  const fetchCoinVolume = useCallback(async (token: RawCoinInfo) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${token.coingecko_id}&vs_currencies=USD`
      );
      return await response?.json();
    } catch (err) {
      openErrorNotification({ detail: 'Fail to fetch data from Coingecko' });
    }
  }, []);

  const populateCoinRate = useCallback(
    async (supportedCoins: Record<string, RawCoinInfo>): Promise<Record<string, number>> => {
      const currentCoins = {};
      await Promise.all(
        Object.keys(supportedCoins).map(async (key) => {
          const token = supportedCoins[key];
          if (!currentCoins[token.symbol]) {
            const data = await fetchCoinVolume(token);
            let rate = 0;
            if (data) {
              rate = data[Object.keys(data)[0]]?.usd;
            }
            currentCoins[token.symbol] = rate;
          }
        })
      );
      return currentCoins;
    },
    [fetchCoinVolume]
  );

  const parsePoolData = useCallback(
    async (pools: PieceSwapPoolInfo[]) => {
      let parsedPools: IPool[] = [];
      if (obricSDK) {
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
              volume: 0,
              fees: 0,
              apr: 0,
              invested: true,
              token0Reserve,
              token1Reserve,
              decimals,
              swapFee: pool.swap_fee_per_million.toJsNumber()
            };
          })
        );
      }

      setActivePools(parsedPools);
    },
    [getPoolResources, obricSDK]
  );

  const getPoolTVL = useCallback(
    (pool: IPool) => {
      let value = 0;
      value = coinInPools
        ? pool.token0Reserve * coinInPools[pool.token0.symbol] +
          pool.token1Reserve * coinInPools[pool.token1.symbol]
        : 0;
      return value;
    },
    [coinInPools]
  );

  const gatherPoolTokenInfo = useCallback(async () => {
    setFetching(true);
    let supportedCoins = {};

    // Gather all tokens in pools
    activePools.map((pool) => {
      if (!supportedCoins[pool.token0.symbol]) {
        supportedCoins[pool.token0.symbol] = pool.token0;
      }
      if (!supportedCoins[pool.token1.symbol]) {
        supportedCoins[pool.token1.symbol] = pool.token1;
      }
    });

    const supportedCoinRate = await populateCoinRate(supportedCoins);
    setCoinInPools(supportedCoinRate);
    setFetching(false);
  }, [activePools, populateCoinRate]);

  useEffect(() => {
    if (activePools?.length && !fetching && (!coinInPools || Object.keys(coinInPools).length < 1)) {
      gatherPoolTokenInfo();
    }
  }, [activePools, coinInPools, fetching, gatherPoolTokenInfo]);

  useEffect(() => {
    if (obricSDK && liquidityPools?.length && !activePools.length) {
      parsePoolData(liquidityPools);
    }
  }, [activePools, liquidityPools, obricSDK, parsePoolData]);

  const getOwnedLiquidity = useCallback(
    async (poolAddress) => {
      let result = {
        lp: 0,
        coins: {},
        myCoins: {}
      };
      const poolInfo = activePools.find((pool) => pool.id === poolAddress);
      if (poolInfo) {
        const { token0, token1, token0Reserve, token1Reserve, liquidity, decimals } = poolInfo;
        result = {
          ...result,
          coins: {
            [token0.symbol]: token0Reserve,
            [token1.symbol]: token1Reserve
          }
        };
        if (poolStore && obricSDK) {
          const coinInfo = (poolStore[poolAddress.replace(/PieceSwapPoolInfo/g, 'LPToken')] || {})
            .data as CoinInfo;
          if (coinInfo) {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const myLp = coinInfo?.coin?.value / Math.pow(10, decimals);
            result.lp = myLp;
            result.myCoins = {
              [token0.symbol]: liquidity ? (myLp / liquidity) * token0Reserve : 0,
              [token1.symbol]: liquidity ? (myLp / liquidity) * token1Reserve : 0
            };
          }
        }
      }
      return result;
    },
    [activePools, obricSDK, poolStore]
  );

  const getTokenBalanceInUSD = useCallback(
    (balance: number, token: RawCoinInfo) => {
      let value = 0;
      if (coinInPools && token && coinInPools[token.symbol]) {
        value = balance * coinInPools[token.symbol];
      }
      return value ? numberGroupFormat(value, 3) : '0';
    },
    [coinInPools]
  );

  const getPoolStatsByTimebasis = useCallback(
    (pool: IPool) => {
      let stats = {
        volume: 0,
        fees: 0,
        apr: 0
      };
      if (obricSDK && coinInPools) {
        const { timeBasis } = poolFilter;
        // const denominator = {
        //   '24H': 24,
        //   '7D': 24 * 7,
        //   '30D': 24 * 30
        // };
        if (timeBasis === '24H') {
          const tokens = [pool.token0, pool.token1];
          const fees = obricSDK
            .getPrev24HourFees(tokens[0].symbol, tokens[1].symbol)
            .reduce((total, fee, index) => {
              return (total += fee * coinInPools[tokens[index].symbol]);
            }, 0);
          stats = {
            volume: 0,
            fees,
            apr: 0
          };
        }
      }
      return stats;
    },
    [coinInPools, obricSDK, poolFilter]
  );

  return (
    <PoolsContext.Provider
      value={{
        activePools,
        coinInPools,
        getOwnedLiquidity,
        checkIfInvested,
        getTokenBalanceInUSD,
        getPoolTVL,
        poolFilter,
        setPoolFilter,
        getPoolStatsByTimebasis
      }}>
      {children}
    </PoolsContext.Provider>
  );
};

export { PoolsProvider, PoolsContext };
