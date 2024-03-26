import BN from 'bn.js';
import BigNumber from 'bignumber.js';

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function bigintToBigNumber(value?: bigint | undefined) {
    if (value) {
        return new BigNumber(value.toString());
    } else {
        return new BigNumber(0);
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
