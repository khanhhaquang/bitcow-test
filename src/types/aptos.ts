import { Wallet } from '@particle-network/evm-connectkit';
import { AptosAccount, AptosAccountObject, HexString } from 'aptos';

export type ActiveWallet = Wallet;

export type AptosWalletObject = {
  walletName: string;
  aptosAccountObj: AptosAccountObject;
};

export const MessageMethod = Object.freeze({
  GET_ACCOUNT_ADDRESS: 'getAccountAddress',
  SIGN_TRANSACTION: 'signTransaction'
} as const);

export interface GetAccountResourcesProps {
  address?: string;
  nodeUrl?: string;
}
