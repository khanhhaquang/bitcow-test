import { IPoolToken } from 'types/pool';

export interface IPoolItem {
  id: string;
  liquidity: number;
  volumn7D: number;
  token0: IPoolToken;
  token1: IPoolToken;
  fees7D: number;
  apr7D: number;
  invested: boolean;
}
