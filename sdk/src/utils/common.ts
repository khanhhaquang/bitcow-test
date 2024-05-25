import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import { ContractTransactionReceipt, EventLog, Interface, Log } from 'ethers';
import { Token, TokenInfo } from '../types';

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function uiAmountToContractAmount(value: number, token: Token | TokenInfo) {
  return multUiAmount(value, token.decimals);
}

export function multUiAmount(value: number, decimals: number) {
  return new BigNumber(value).times(10 ** decimals).toFixed(0);
}

export function stringToBigNumber(value?: string) {
  if (value) {
    return new BigNumber(value);
  } else {
    return new BigNumber(0);
  }
}

export function bigintToBigNumber(value?: bigint | undefined) {
  if (value) {
    return new BigNumber(value.toString());
  } else {
    return new BigNumber(0);
  }
}
export function stringToBN(value?: string | undefined) {
  if (value) {
    return new BN(value);
  } else {
    return new BN(0);
  }
}
export function bigintToBN(value?: bigint | undefined) {
  if (value) {
    return new BN(value.toString());
  } else {
    return new BN(0);
  }
}

export function bnToBigNumber(value?: BN | undefined) {
  if (value) {
    return new BigNumber(value.toString());
  } else {
    return new BigNumber(0);
  }
}
export function parseEvents(receipt: ContractTransactionReceipt, interfaces: Interface[]) {
  const eventLogs: EventLog[] = [];
  for (const log of receipt.logs) {
    if (log instanceof Log) {
      for (const face of interfaces) {
        const event = face.getEvent(log.topics[0]);
        if (event) {
          eventLogs.push(new EventLog(log, face, event));
        }
      }
    } else {
      eventLogs.push(log);
    }
  }
  return eventLogs;
}

export function log(message?: any, ...optionalParams: any[]) {
  // console.log(message, ...optionalParams);
}
