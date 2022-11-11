import { RawCoinInfo } from '@manahippo/coin-list';

export interface AddLiquidity {
  xToken: RawCoinInfo;
  yToken: RawCoinInfo;
  xAmt: number;
  yAmt: number;
}

export interface WithdrawLiquidity {
  xToken: RawCoinInfo;
  yToken: RawCoinInfo;
  amt: number;
}
