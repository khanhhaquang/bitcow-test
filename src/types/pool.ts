import { RawCoinInfo } from '@manahippo/coin-list';

export interface IPoolToken {
  id: string;
  symbol: string;
  name: string;
}

export interface IPool {
  id: string;
  address?: string;
  liquidity: number;
  token0: RawCoinInfo;
  token1: RawCoinInfo;
  volumn7D: '-' | number;
  fees7D: '-' | number;
  apr7D: '-' | number;
  invested: boolean;
  totalValueLockedUSD?: string;
  volumeUSD?: string;
  token0Reserve?: number;
  token1Reserve?: number;
}

export interface IPoolFilters {
  search: string;
  filterBy: string;
  sortBy: string;
  showSelfLiquidity: boolean;
}

export interface LiquidityModal {
  type: 'add' | 'withdraw';
  pool: IPool;
}
