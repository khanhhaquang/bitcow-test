export interface ICreatePoolSetting {
  name: string;
  symbol: string;
  decimals: number;
  description: string;
  projectUrl: string;
  logoUrl: string;
  coingeckoId: string;
  mintAmount: number;
  addLiquidityAmount: number;
  bitusdAddLiquidityAmount: number;
  protocolFeeShareThousandth: number;
  feeMillionth: number;
  protocolFeeAddress: string;
  addTokenListFee: string;
}
