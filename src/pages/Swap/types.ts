import { BaseToken, Quote } from 'obric-merlin';

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
  quote?: Quote;
  currencyFrom?: {
    token?: BaseToken;
    amount?: number;
    balance: number;
  };
  currencyTo?: {
    token?: BaseToken;
    amount?: number;
    balance: number;
  };
}
