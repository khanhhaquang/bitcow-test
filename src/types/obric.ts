import { Types } from 'aptos';
import { BaseToken } from 'obric-merlin';
export type TxData = {
  to: string;
  value: string;
  data: string;
};
export type TTransaction = {
  // type: 'signTransaction' | 'signAndSubmit';
  transaction: Types.SubmitTransactionRequest;
  callback: () => void;
  // transactionInfo: Record<string, string | number>;
};

export interface TokenBalance {
  token: BaseToken;
  balance: number;
}
