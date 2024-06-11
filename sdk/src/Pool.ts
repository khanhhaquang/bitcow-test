import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import { Contract, Provider, Signer } from 'ethers';

import { ABI_ERC20 } from './abi/ERC20';
import { ABI_SS_TRADING_PAIR_V1 } from './abi/SsTradindPairV1';
import { MILLIONTH } from './constant';
import { ContractRunner } from './ContractRunner';
import {
  IPool,
  IUserLiquidity,
  Pair,
  PairStats,
  Token,
  StatsV1,
  TxOption,
  UserLpAmount
} from './types';
import { bigintToBigNumber, bnToBigNumber } from './utils/common';
import sqrt from './utils/math';
import { parseStatsV1 } from './utils/statsV1';
export class Pool extends ContractRunner implements IPool {
  poolContract: Contract;

  xTokenContract: Contract;

  yTokenContract: Contract;

  pair: Pair;

  stats: StatsV1 | undefined;

  public xToken: Token;

  public yToken: Token;

  constructor(provider: Provider, pairStats: PairStats, txOption?: TxOption, signer?: Signer) {
    super(provider, txOption, signer);
    this.pair = pairStats.pair;
    this.stats = pairStats.statsV1;
    this.xToken = {
      address: this.pair.xToken,
      symbol: this.pair.xSymbol,
      decimals: this.pair.xDecimals,
      mult: 10 ** this.pair.xDecimals
    };
    this.yToken = {
      address: this.pair.yToken,
      symbol: this.pair.ySymbol,
      decimals: this.pair.yDecimals,
      mult: 10 ** this.pair.yDecimals
    };
    this.poolContract = new Contract(this.pair.pairAddress, ABI_SS_TRADING_PAIR_V1, this.provider);
    this.xTokenContract = new Contract(this.pair.xToken, ABI_ERC20, this.provider);
    this.yTokenContract = new Contract(this.pair.yToken, ABI_ERC20, this.provider);
  }

  get swapFeeMillionth() {
    return Number(this.stats?.feeMillionth.toString()) / MILLIONTH;
  }

  get protocolFeeShareThousandth() {
    return Number(this.stats?.protocolFeeShareThousandth.toString()) / 1000;
  }

  getUserAddress() {
    return super.getAddress();
  }

  get poolAddress() {
    return this.pair.pairAddress;
  }

  get lpAddress() {
    return this.pair.lpToken;
  }

  async reload() {
    await this.loadStats();
  }

  private getVolumeMult() {
    return Math.max(this.xMult, this.yMult);
  }

  private async loadStats() {
    const stats = await this.poolContract.getStats();
    this.stats = parseStatsV1(stats);
  }

  get token0(): Token {
    return this.xToken;
  }

  get token1(): Token {
    return this.yToken;
  }

  get xMult(): number {
    return this.xToken.mult;
  }

  get yMult(): number {
    return this.yToken.mult;
  }

  get lpMult(): number {
    return this.xMult;
  }

  get poolType(): string {
    return 'v1' as const;
  }

  get totalLP(): string | undefined {
    return this.stats?.totalLP.toString();
  }

  get reserve0(): BN {
    if (this.stats) {
      return this.stats.currentX;
    } else {
      throw new Error('Pool stats not loaded');
    }
  }

  get reserve1(): BN {
    if (this.stats) {
      return this.stats.currentY;
    } else {
      throw new Error('Pool stats not loaded');
    }
  }

  get targetReserve0(): number {
    if (this.stats) {
      return bnToBigNumber(this.stats.targetX).div(this.xMult).toNumber();
    } else {
      throw new Error('Pool stats not loaded');
    }
  }

  get targetReserve1(): number {
    if (this.stats) {
      return bnToBigNumber(this.stats.targetY).div(this.yMult).toNumber();
    } else {
      throw new Error('Pool stats not loaded');
    }
  }

  assertStats() {
    if (this.stats === undefined) {
      throw Error('Pool not loaded');
    }
  }

  get24HourStats(type: 'protocolFees' | 'lpFees' | 'fullFees' | 'volume'): [number, number] {
    this.assertStats();
    const seconds = Date.now() / 1000;
    const days = Math.floor(seconds / 86400);
    const feeRecords = this.stats!.feeRecords;
    const volumeMult = this.getVolumeMult();

    const currDay = (days + 6) % 7;
    const currVolume = feeRecords.volumes[currDay].div(volumeMult).toNumber();
    let prevDay = 0;
    let prevVolume = 0;
    for (let i = 5; i > 0; i--) {
      const day = (days + i) % 7;
      const volume = feeRecords.volumes[day].div(volumeMult).toNumber();
      if (volume > prevVolume) {
        prevVolume = volume;
        prevDay = day;
      }
    }

    if (currVolume < prevVolume) {
      return [0, 0];
    }

    const currFees = [
      feeRecords.xProtocolFees[currDay].div(this.xMult).toNumber(),
      feeRecords.yProtocolFees[currDay].div(this.yMult).toNumber()
    ];
    const prevFees = [
      feeRecords.xProtocolFees[prevDay].div(this.xMult).toNumber(),
      feeRecords.yProtocolFees[prevDay].div(this.yMult).toNumber()
    ];

    const feeShare = this.protocolFeeShareThousandth;

    const protocolFees: [number, number] = [currFees[0] - prevFees[0], currFees[1] - prevFees[1]];
    const fullFees: [number, number] = [protocolFees[0] / feeShare, protocolFees[1] / feeShare];
    const lpFees: [number, number] = [fullFees[0] * (1 - feeShare), fullFees[1] * (1 - feeShare)];
    const volume: [number, number] = [(currVolume - prevVolume) / 1000, 0];
    if (type === 'protocolFees') {
      return protocolFees;
    } else if (type === 'lpFees') {
      return lpFees;
    } else if (type === 'fullFees') {
      return fullFees;
    } else if (type === 'volume') {
      return volume;
    } else {
      throw `Unreachable type: ${type}`;
    }
  }

  feesUsd(price0: number, price1: number) {
    const [xFee, yFee] = this.get24HourStats('fullFees');
    return xFee * price0 + yFee * price1;
  }

  volumeUsd() {
    return this.get24HourStats('volume')[0];
  }

  tvlUsd(price0: number, price1: number): number {
    if (price0 === 0) {
      return bnToBigNumber(this.stats?.currentY).div(this.yMult).toNumber() * price1 * 2;
    } else if (price1 === 0) {
      return bnToBigNumber(this.stats?.currentX).div(this.xMult).toNumber() * price0 * 2;
    } else {
      return (
        bnToBigNumber(this.stats?.currentX).div(this.xMult).toNumber() * price0 +
        bnToBigNumber(this.stats?.currentY).div(this.yMult).toNumber() * price1
      );
    }
  }

  getUserLiquidity(userLpAmount: UserLpAmount): IUserLiquidity {
    const userLpAmountBigNumber = bigintToBigNumber(userLpAmount);
    const result = {
      invested: userLpAmountBigNumber.gt(0),
      lpAmount: userLpAmountBigNumber.div(this.lpMult).toNumber(),
      assetsPooled: {} as Record<string, number>,
      liquidityShare: 0
    };
    const lpSupply = bnToBigNumber(this.stats?.totalLP);
    if (lpSupply.gt(0)) {
      result.assetsPooled[this.xToken.symbol] = new BigNumber(this.targetReserve0.toString())
        .times(userLpAmountBigNumber.div(lpSupply))
        .toNumber();
      result.assetsPooled[this.yToken.symbol] = new BigNumber(this.targetReserve1.toString())
        .times(userLpAmountBigNumber.div(lpSupply))
        .toNumber();
      result.liquidityShare = userLpAmountBigNumber.div(lpSupply).toNumber();
    }
    return result;
  }

  quoteXtoY(inputX: BN) {
    this.assertStats();
    if (inputX.eqn(0)) return new BN(0);

    const stats = this.stats!;
    let outputBeforeFeeY;
    if (stats.concentration.eqn(1)) {
      outputBeforeFeeY = stats.currentY.sub(stats.bigK.div(stats.currentX.add(inputX)));
    } else {
      // target_x_K = sqrt(big_k / p), where p = mult_x / mult_y
      // Note: BN.sqr is not sqrt !
      const targetXK = sqrt(stats.bigK.mul(stats.multY).div(stats.multX));
      // 1. find current (x,y) on curve-K
      const currentXK = targetXK.sub(stats.targetX).add(stats.currentX);
      if (currentXK.eqn(0)) {
        return new BN(0);
      }
      // BN.div(0) = 0
      const currentYK = stats.bigK.div(currentXK);
      // 2. find new (x, y) on curve-K
      const newXK = currentXK.add(inputX);
      const newYK = stats.bigK.div(newXK);
      outputBeforeFeeY = currentYK.sub(newYK);
    }

    if (outputBeforeFeeY.gt(stats.currentY)) throw new Error('Insufficient active Y');
    const feeY = outputBeforeFeeY.mul(stats.feeMillionth).divn(MILLIONTH);
    const outputAfterFeeY = outputBeforeFeeY.sub(feeY);

    return outputAfterFeeY;
  }

  quoteYtoX(inputY: BN) {
    this.assertStats();
    if (inputY.eqn(0)) throw new Error('Invalid input y amount');

    const stats = this.stats!;
    // 0. get target_x on curve-K
    const bigK = stats.bigK;
    let outputBeforeFeeX;
    if (stats.concentration.eqn(1)) {
      outputBeforeFeeX = stats.currentX.sub(stats.bigK.div(stats.currentY.add(inputY)));
    } else {
      // target_x_K = sqrt(big_k / p), where p = mult_x / mult_y
      const targetXK = sqrt(bigK.mul(stats.multY).div(stats.multX));

      // 1. find current (x,y) on curve-K
      const currentXK = targetXK.sub(stats.targetX).add(stats.currentX);
      if (currentXK.eqn(0)) {
        return new BN(0);
      }
      // BN.div(0) = 0
      const currentYK = bigK.div(currentXK);

      // 2. find new (x, y) on curve-K
      const newYK = currentYK.add(inputY);
      const newXK = bigK.div(newYK);

      outputBeforeFeeX = currentXK.sub(newXK);
    }

    if (outputBeforeFeeX.gt(stats.currentX)) throw new Error('Insufficient active X');

    const feeX = outputBeforeFeeX.mul(stats.feeMillionth).divn(MILLIONTH);

    const outputAfterFeeX = outputBeforeFeeX.sub(feeX);

    return outputAfterFeeX;
  }

  async depositV1(xUiAmount: number, yUiAmount: number) {
    return this.send(
      this.poolContract.deposit,
      new BigNumber(xUiAmount).times(this.xMult).toFixed(0),
      new BigNumber(yUiAmount).times(this.yMult).toFixed(0),
      this.txOption
    );
  }

  /**
   *
   * @param inputLPAmount
   */
  async withdrawV1(inputLPAmount: string) {
    return this.send(this.poolContract.withdraw, inputLPAmount, this.txOption);
  }

  async updatePrice(xPrice: number, yPrice: number) {
    return this.send(this.poolContract.updatePrice, xPrice, yPrice, this.txOption);
  }

  async printMessage() {
    this.printPoolMessage();
    await this.printUserMessage();
  }

  printPoolMessage() {
    console.log('X token: ', this.xToken.symbol);
    console.log('Y token: ', this.yToken.symbol);
    console.log('X mult: ', this.xMult);
    console.log('Y mult: ', this.yMult);
    console.log('Reserve 0: ', this.reserve0.toString());
    console.log('Reserve 1: ', this.reserve1.toString());
    console.log('Target reserve 0: ', this.targetReserve0.toString());
    console.log('Target reserve 1: ', this.targetReserve1.toString());
    console.log('lp supply: ', this.totalLP);

    console.log('Swap fee millionth: ', this.swapFeeMillionth);
    console.log('Protocol fee share thousandth: ', this.protocolFeeShareThousandth.toString());
    console.log('Big k: ', this.stats?.bigK.toString());
    console.log('State multX:', this.stats?.multX.toString());
    console.log('State multY:', this.stats?.multY.toString());
    console.log('24 hour stats (protocolFees):', this.get24HourStats('protocolFees'));
    console.log('24 hour stats (lpFees):', this.get24HourStats('lpFees'));
    console.log('24 hour stats (fullFees):', this.get24HourStats('fullFees'));
    console.log('24 hour stats (volume):', this.get24HourStats('volume'));
  }

  async printUserMessage() {
    // const userLiquidity = this.getUserLiquidity(userLpAmount);
    // console.log('Invested', userLiquidity.invested);
    // console.log('lp amount: ', userLiquidity.lpAmount);
    // console.log('Assets Pooled: ', JSON.stringify(userLiquidity.assetsPooled));
    // console.log('Liquidity share: ', userLiquidity.liquidityShare);
  }
}
