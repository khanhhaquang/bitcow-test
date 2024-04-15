import { TokenInfo, Quote } from 'bitcow';

export interface ISwapSettings {
  slipTolerance: number;
  trasactionDeadline: number;
  // maxGasFee: number;
  expertMode: boolean;
  disableIndirect: boolean;
  privacySwap: boolean;
  quote?: Quote;
  currencyFrom?: {
    token?: TokenInfo;
    amount?: number;
    balance: number;
  };
  currencyTo?: {
    token?: TokenInfo;
    amount?: number;
    balance: number;
  };
}
