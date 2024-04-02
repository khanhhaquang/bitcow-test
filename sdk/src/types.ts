import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import { TransactionReceipt } from 'ethers';
import { PoolConfig } from './configs';

export type TxOption = { gasPrice?: number; gasLimit?: number };

export type BaseToken = {
    address: string;
    decimals: number;
    symbol: string;
    name: string;
    coingeckoId: string;
    logoUrl: string;
};
export type Token = BaseToken & {
    liquidity: number;
    mult: number;
};
export type LpToken = BaseToken & {
    totalSupply: number;
};
export type FeeRecords = {
    xProtocolFees: BigNumber[];
    yProtocolFees: BigNumber[];
    volumes: BigNumber[];
};
export type CalculateStatsV1 = {
    multX: BN;
    multY: BN;
    targetY: BN | undefined;
};

export type StatsV1 = {
    // from contract method getStats
    concentration: BN;
    feeMillionth: BN;
    protocolFeeShareThousandth: BN;

    bigK: BN;
    targetX: BN;
    targetY: BN;

    totalProtocolFeeX: BN;
    totalProtocolFeeY: BN;
    cumulativeVolume: BN;
    feeRecords: FeeRecords;

    currentX: BN;
    currentY: BN;
    totalLP: BN;

    multX: BN;
    multY: BN;
};
export type UserLpAmount = bigint;
export interface IUserLiquidity {
    invested: boolean;
    lpAmount: number;
    assetsPooled: Record<string, number>;
    liquidityShare: number;
}

export type Step = {
    pool: IPool;
    isReversed: boolean;
    inAmt: number;
    outAmt: number;
    poolType: number;
    fromToken: BaseToken;
    toToken: BaseToken;
};
export type Quote = {
    inputToken: BaseToken;
    outputToken: BaseToken;
    inAmt: number;
    steps: Step[];
    outAmt: number;
};

export interface IPool {
    poolType: string;
    token0: BaseToken;
    token1: BaseToken;
    reserve0: BN;
    reserve1: BN;
    xMult: number;
    yMult: number;
    totalLP: string | undefined;

    poolAddress: string;
    swapFeeMillionth: number;
    protocolFeeShareThousandth: number;

    volumeUsd(): number;
    feesUsd(price0: number, price1: number): number;
    tvlUsd(price0: number, price1: number): number;

    getUserLiquidity(userLpAmount: UserLpAmount): IUserLiquidity;

    get24HourStats(type: 'protocolFees' | 'lpFees' | 'fullFees' | 'volume'): [number, number];
    depositV1(xUiAmount: number, yUiAmount: number): Promise<null | TransactionReceipt>;
    withdrawV1(inputLPUiAmount: string): Promise<null | TransactionReceipt>;

    setTxOption(txOption?: TxOption): void;
}

export type Config = {
    wBTC: BaseToken;
    swapRouter: string;
    pools: PoolConfig[];
};
