import { IPool, IUserLiquidity, BaseToken as Token } from 'obric-merlin';
import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';

import { numberGroupFormat } from 'components/PositiveFloatNumInput/numberFormats';
import useMerlinWallet from 'hooks/useMerlinWallet';
import { IPoolFilters } from 'types/pool';

import { openErrorNotification } from '../utils/notifications';

interface PoolsContextType {
  activePools: IPool[];
  coinPrices: Record<string, number>;
  getTokenBalanceInUSD: (balance: number, token: Token) => string;
  getPoolTVL: (pool: IPool) => number;
  getOwnedLiquidity: (pool: IPool) => IUserLiquidity;
  getOwnedLiquidityShare: (pool: IPool) => number;
  checkIfInvested: (poolInfo: IPool) => boolean;
  setPoolFilter: React.Dispatch<React.SetStateAction<IPoolFilters>>;
  poolFilter: IPoolFilters;
  getPoolStatsByTimebasis: (pool: IPool) => {
    volume: number;
    fees: number;
    apr: number;
  };
  getTotalPoolsTVL: () => number;
  getTotalPoolsVolume: () => number;
}

interface TProviderProps {
  children: ReactNode;
}

const PoolsContext = createContext<PoolsContextType>({} as PoolsContextType);

const PoolsProvider: React.FC<TProviderProps> = ({ children }) => {
  const { obricSDK, liquidityPools, userPoolLpAmount } = useMerlinWallet();
  const [activePools, setActivePools] = useState<IPool[]>([]);
  const [coinPrices, setCoinPrices] = useState<Record<string, number>>();
  const [fetching, setFetching] = useState(false);
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
  const fetchCoinPrice = useCallback(async (ids: string[]) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=USD`
      );
      return await response?.json();
    } catch (err) {
      openErrorNotification({ detail: 'Fail to fetch token prices from Coingecko' });
      return {};
    }
  }, []);
  const populateCoinRate = useCallback(
    async (supportedCoins: Record<string, Token>): Promise<Record<string, number>> => {
      const collectedPrices = {};
      const coingeckoIds = Object.entries(supportedCoins).map((entry) => entry[1].coingeckoId);
      const nonemptyIds = coingeckoIds.filter((id) => id !== '');
      const prices = await fetchCoinPrice(nonemptyIds);
      Object.keys(supportedCoins).map(async (symbol) => {
        const coinInfo = supportedCoins[symbol];
        if (!collectedPrices[coinInfo.symbol]) {
          const data = prices[coinInfo.coingeckoId];
          let rate = 0;
          if (data) {
            rate = data.usd;
          }
          collectedPrices[coinInfo.symbol] = rate;
        }
      });
      return collectedPrices;
    },
    [fetchCoinPrice]
  );

  const getPoolTVL = useCallback(
    (pool: IPool) => {
      return coinPrices
        ? pool.tvlUsd(coinPrices[pool.token0.symbol], coinPrices[pool.token1.symbol])
        : 0;
    },
    [coinPrices]
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
    setCoinPrices(supportedCoinRate);
    setFetching(false);
  }, [activePools, populateCoinRate]);

  useEffect(() => {
    if (activePools?.length && !fetching && (!coinPrices || Object.keys(coinPrices).length < 1)) {
      gatherPoolTokenInfo();
    }
  }, [activePools, coinPrices, fetching, gatherPoolTokenInfo]);

  useEffect(() => {
    if (obricSDK && liquidityPools?.length) {
      setActivePools(liquidityPools);
    }
  }, [liquidityPools, obricSDK]);

  const getOwnedLiquidity = useCallback(
    (pool: IPool) => {
      if (userPoolLpAmount) {
        const userLpAmount = userPoolLpAmount[pool.poolAddress];
        return pool.getUserLiquidity(userLpAmount);
      }
    },
    [userPoolLpAmount]
  );

  const getOwnedLiquidityShare = useCallback(
    (pool: IPool) => {
      if (userPoolLpAmount) {
        const userLpAmount = userPoolLpAmount[pool.poolAddress];
        return pool.getUserLiquidity(userLpAmount).liquidityShare;
      } else {
        return 0;
      }
    },
    [userPoolLpAmount]
  );

  const checkIfInvested = useCallback(
    (pool: IPool) => {
      if (userPoolLpAmount) {
        return getOwnedLiquidity(pool).invested;
      }
    },
    [getOwnedLiquidity, userPoolLpAmount]
  );

  const getTokenBalanceInUSD = useCallback(
    (balance: number, token: Token) => {
      let value = 0;
      if (coinPrices && token && coinPrices[token.symbol]) {
        value = balance * coinPrices[token.symbol];
      }
      return value ? numberGroupFormat(value, 3) : '0';
    },
    [coinPrices]
  );

  const getPoolStatsByTimebasis = useCallback(
    (pool: IPool) => {
      let stats = {
        volume: 0,
        fees: 0,
        apr: 0
      };
      if (coinPrices) {
        const { timeBasis } = poolFilter;
        // const denominator = {
        //   '24H': 24,
        //   '7D': 24 * 7,
        //   '30D': 24 * 30
        // };
        if (timeBasis === '24H') {
          const price0 = coinPrices[pool.token0.symbol];
          const price1 = coinPrices[pool.token1.symbol];
          const tvl = pool.tvlUsd(price0, price1);
          const fees = pool.feesUsd(price0, price1);
          stats = {
            volume: pool.volumeUsd(),
            fees,
            apr: (fees * 365) / tvl
          };
        }
      }
      return stats;
    },
    [coinPrices, poolFilter]
  );

  const getTotalPoolsTVL = useCallback(() => {
    const result = coinPrices
      ? activePools.reduce((total, pool) => {
          const price0 = coinPrices[pool.token0.symbol];
          const price1 = coinPrices[pool.token1.symbol];
          return total + pool.tvlUsd(price0, price1);
        }, 0)
      : 0;
    return result;
  }, [activePools, coinPrices]);

  const getTotalPoolsVolume = useCallback(() => {
    const result = coinPrices
      ? activePools.reduce((total, pool) => {
          const { volume } = getPoolStatsByTimebasis(pool);
          return (total += volume);
        }, 0)
      : 0;
    return result;
  }, [activePools, coinPrices, getPoolStatsByTimebasis]);

  return (
    <PoolsContext.Provider
      value={{
        activePools,
        coinPrices,
        getOwnedLiquidity,
        getOwnedLiquidityShare,
        checkIfInvested,
        getTokenBalanceInUSD,
        getPoolTVL,
        poolFilter,
        setPoolFilter,
        getPoolStatsByTimebasis,
        getTotalPoolsTVL,
        getTotalPoolsVolume
      }}>
      {children}
    </PoolsContext.Provider>
  );
};

export { PoolsProvider, PoolsContext };
