import { BaseToken } from 'obric-merlin';

export interface AddLiquidity {
  xToken: BaseToken;
  yToken: BaseToken;
  xAmt: number;
  yAmt: number;
}

export interface WithdrawLiquidity {
  xToken: BaseToken;
  yToken: BaseToken;
  percent: number;
}
