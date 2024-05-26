export interface ICreatePool {
  xTokenAddress: string;
  xTokenLogoUrl: string;
  xTokenSymbol: string;
  xTokenDecimals: number;
  xTokenBalance: number;
  xTokenAmount: number;
  xTokenPrice: number;
  yTokenAddress: string;
  yTokenLogoUrl: string;
  yTokenSymbol: string;
  yTokenDecimals: number;
  yTokenBalance: number;
  yTokenAmount: number;
  yTokenPrice: number;
  isValidating: boolean;
  error: string | undefined;
}
