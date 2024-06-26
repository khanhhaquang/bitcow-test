import { Token } from '../../sdk';

export interface AddLiquidity {
  xToken: Token;
  yToken: Token;
  xAmt: number;
  yAmt: number;
}

export interface WithdrawLiquidity {
  xToken: Token;
  yToken: Token;
  percent: number;
}
