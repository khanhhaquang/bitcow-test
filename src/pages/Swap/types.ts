import { RawCoinInfo } from '@manahippo/coin-list';

export interface TokenInfo {
  symbol: any;
  logo_url: any;
  decimals: any;
  name: any;
}

export interface ISwapSettings {
  slipTolerance: number;
  trasactionDeadline: number;
  // maxGasFee: number;
  expertMode: boolean;
  disableIndirect: boolean;
  privacySwap: boolean;
  currencyFrom?: {
    token?: RawCoinInfo;
    amount?: number;
    balance: number;
  };
  currencyTo?: {
    token?: RawCoinInfo;
    amount?: number;
    balance: number;
  };
}
