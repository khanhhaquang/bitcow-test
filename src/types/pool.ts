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
  volume: number;
  fees: number;
  apr: number;
  invested: boolean;
  totalValueLockedUSD?: string;
  volumeUSD?: string;
  token0Reserve?: number;
  token1Reserve?: number;
  decimals?: number;
  swapFee?: number;
}

export interface IPoolFilters {
  text: string;
  timeBasis: string;
  sortBy: {
    field: string;
    order: 'ascend' | 'descend' | null;
  }[];
}

export interface LiquidityModal {
  type: 'add' | 'withdraw';
  pool: IPool;
}
