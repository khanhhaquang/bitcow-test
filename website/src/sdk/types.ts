import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import { TransactionReceipt } from 'ethers';

export type TxOption = { gasPrice?: number; gasLimit?: number };

export type Token = {
  address: string;
  decimals: number;
  symbol: string;
  mult: number;
};

export type CreateTokenInfo = {
  name: string;
  symbol: string;
  decimals: number;
  description: string;
  projectUrl: string;
  logoUrl: string;
  coingeckoId: string;
};

export type TokenInfo = {
  address: string;
} & CreateTokenInfo;

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

export type Pair = {
  pairAddress: string;
  xToken: string;
  xDecimals: number;
  xSymbol: string;
  yToken: string;
  yDecimals: number;
  ySymbol: string;
  lpToken: string;
};

export type PairStats = {
  pair: Pair;
  statsV1: StatsV1;
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
  fromToken: TokenInfo;
  toToken: TokenInfo;
};
export type Quote = {
  inputToken: TokenInfo;
  outputToken: TokenInfo;
  inAmt: number;
  steps: Step[];
  outAmt: number;
};

export interface IPool {
  poolType: string;
  reserve0: BN;
  reserve1: BN;
  token0: Token;
  token1: Token;

  xMult: number;
  yMult: number;
  totalLP: string | undefined;

  poolAddress: string;
  swapFeeMillionth: number;
  protocolFeeShareThousandth: number;
  lpAddress: string;

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
  chainId: number;
  tokenList: string;
  tradingPairV1List: string;
  tradingPairV1Creator: string;
  swapRouter: string;
  tokensBalance: string;

  pairV1Manager?:string;
};
