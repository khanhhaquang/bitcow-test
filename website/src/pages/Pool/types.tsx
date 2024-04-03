import { TokenInfo } from 'obric-merlin';

export interface AddLiquidity {
  xToken: TokenInfo;
  yToken: TokenInfo;
  xAmt: number;
  yAmt: number;
}

export interface WithdrawLiquidity {
  xToken: TokenInfo;
  yToken: TokenInfo;
  percent: number;
}
