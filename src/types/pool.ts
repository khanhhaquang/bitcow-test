import { IPool } from 'obric-merlin';

export interface IPoolToken {
  id: string;
  symbol: string;
  name: string;
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
