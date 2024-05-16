import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';

import { numberGroupFormat } from 'components/PositiveFloatNumInput/numberFormats';
import useMerlinWallet from 'hooks/useMerlinWallet';
import { IPoolFilters } from 'types/pool';

import { IPool, IUserLiquidity, TokenInfo, Token } from '../sdk';

interface PoolsContextType {
  activePools: IPool[];
  coinPrices: Record<string, number>;
  getTokenBalanceInUSD: (balance: number, token: Token | TokenInfo) => string;
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
  const { bitcowSDK, liquidityPools, tokenBalances, setNeedBalanceTokens, tokenList } =
    useMerlinWallet();
  const [activePools, setActivePools] = useState<IPool[]>([]);
  const [coinPrices, setCoinPrices] = useState<Record<string, number>>();
  const [localCoinPrices, setLocalCoinPrices] = useState<Record<string, number>>({});
  const [fetchCoinPrices, setFetchCoinPrices] = useState<Record<string, number>>({});

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

  const getPoolTVL = useCallback(
    (pool: IPool) => {
      const poolTvl = coinPrices
        ? pool.tvlUsd(coinPrices[pool.token0.symbol], coinPrices[pool.token1.symbol])
        : 0;
      return poolTvl;
    },
    [coinPrices]
  );
  const fetchTokenPriceFromCoingecko = useCallback(async (ids: string[]) => {
    try {
      if (ids.length === 0) {
        return {};
      }
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=USD`
      );
      return await response?.json();
    } catch (err) {
      return {};
    }
  }, []);

  const defaultPrice = useCallback((symbol: string) => {
    let price = 0;
    if (symbol === 'bitusd') {
      price = 1;
    } else if (symbol === 'USDT') {
      price = 1;
    } else if (symbol === 'WBTC') {
      price = 60000;
    }
    return price;
  }, []);

  const populateFetchTokenPrice = useCallback(async () => {
    if (tokenList) {
      const collectedPrices = {};
      const coingeckoIds = tokenList.map((coinInfo) => coinInfo.coingeckoId);
      const nonemptyIds = coingeckoIds.filter((id) => id !== '');
      const prices = await fetchTokenPriceFromCoingecko(nonemptyIds);
      tokenList.map(async (coinInfo) => {
        if (!collectedPrices[coinInfo.symbol]) {
          let price = defaultPrice(coinInfo.symbol);
          const data = prices[coinInfo.coingeckoId];
          if (data) {
            price = data.usd;
          }
          collectedPrices[coinInfo.symbol] = price;
        }
        setFetchCoinPrices(collectedPrices);
      });
    }
  }, [tokenList, fetchTokenPriceFromCoingecko]);

  const populateLocalTokenPrice = useCallback(async () => {
    if (activePools) {
      const tokens: Record<string, Token> = {};
      activePools.forEach((pool) => {
        tokens[pool.token0.symbol] = pool.token0;
        tokens[pool.token1.symbol] = pool.token1;
      });
      const collectedPrices = {};
      for (const coinInfo of Object.values(tokens)) {
        if (!collectedPrices[coinInfo.symbol]) {
          collectedPrices[coinInfo.symbol] = defaultPrice(coinInfo.symbol);
        }
        setLocalCoinPrices(collectedPrices);
      }
    }
  }, [activePools]);

  useEffect(() => {
    populateFetchTokenPrice();
  }, [populateFetchTokenPrice]);

  useEffect(() => {
    populateLocalTokenPrice();
  }, [populateLocalTokenPrice]);

  // merge price
  useEffect(() => {
    if (Object.keys(fetchCoinPrices).length > 0) {
      setCoinPrices(fetchCoinPrices);
    } else {
      setCoinPrices(localCoinPrices);
    }
  }, [localCoinPrices, fetchCoinPrices]);

  useEffect(() => {
    if (bitcowSDK && liquidityPools?.length) {
      setActivePools(liquidityPools);
    } else {
      setActivePools([]);
    }
  }, [liquidityPools, bitcowSDK]);

  const getOwnedLiquidity = useCallback(
    (pool: IPool) => {
      if (tokenBalances) {
        const userLpAmount = tokenBalances[pool.lpAddress];
        if (userLpAmount === undefined) {
          setNeedBalanceTokens([pool.lpAddress]);
        }
        return pool.getUserLiquidity(userLpAmount);
      }
    },
    [tokenBalances, setNeedBalanceTokens]
  );

  const getOwnedLiquidityShare = useCallback(
    (pool: IPool) => {
      if (tokenBalances) {
        const userLpAmount = tokenBalances[pool.lpAddress];
        return pool.getUserLiquidity(userLpAmount).liquidityShare;
      } else {
        return 0;
      }
    },
    [tokenBalances]
  );

  const checkIfInvested = useCallback(
    (pool: IPool) => {
      if (tokenBalances) {
        return getOwnedLiquidity(pool).invested;
      }
    },
    [getOwnedLiquidity, tokenBalances]
  );

  const getTokenBalanceInUSD = useCallback(
    (balance: number, token: Token | TokenInfo) => {
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
