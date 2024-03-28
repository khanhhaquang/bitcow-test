import { PoolConfig } from './configs';
import { Contract, Provider, Signer } from 'ethers';
import { ABI_SS_TRADING_PAIR_V1 } from './abi/SsTradindPair';
import BigNumber from 'bignumber.js';
import { ABI_ERC20 } from './abi/ERC20';
import { IPool, IUserLiquidity, StatsV1, Token, TxOption, UserLpAmount } from './types';
import { MILLIONTH } from './constant';
import BN from 'bn.js';
import sqrt from './utils/math';
import { bigintToBN, bigintToBigNumber, bnToBigNumber } from './utils/common';
import { ContractRunner } from './ContractRunner';
export class Pool extends ContractRunner implements IPool {
    poolContract: Contract;
    xTokenContract: Contract;
    yTokenContract: Contract;
    private lpTokenContract: Contract;
    xToken: Token;
    yToken: Token;
    stats: StatsV1 | undefined;

    constructor(provider: Provider, private poolConfig: PoolConfig, txOption?: TxOption, signer?: Signer) {
        super(provider, txOption, signer);
        this.poolContract = new Contract(poolConfig.address, ABI_SS_TRADING_PAIR_V1, this.provider);
        this.xTokenContract = new Contract(poolConfig.xToken.address, ABI_ERC20, this.provider);
        this.yTokenContract = new Contract(poolConfig.yToken.address, ABI_ERC20, this.provider);
        this.lpTokenContract = new Contract(poolConfig.lpToken, ABI_ERC20, this.provider);
        this.xToken = { ...poolConfig.xToken, liquidity: 0, mult: 10 ** poolConfig.xToken.decimals };
        this.yToken = { ...poolConfig.yToken, liquidity: 0, mult: 10 ** poolConfig.yToken.decimals };
    }
    private getMult() {
        if (this.xToken.decimals > this.yToken.decimals) {
            return {
                multX: new BN(1),
                multY: new BN(10).pow(new BN(this.xToken.decimals - this.yToken.decimals))
            };
        } else if (this.yToken.decimals > this.xToken.decimals) {
            return {
                multX: new BN(10).pow(new BN(this.yToken.decimals - this.xToken.decimals)),
                multY: new BN(1)
            };
        } else {
            return {
                multX: new BN(1),
                multY: new BN(1)
            };
        }
    }
    get swapFeeMillionth() {
        return Number(this.stats?.feeMillionth.toString()) / MILLIONTH;
    }
    get protocolFeeShareThousandth() {
        return Number(this.stats?.protocolFeeShareThousandth.toString()) / 1000;
    }
    setTxOption(txOption?: TxOption) {
        this.txOption = txOption;
    }
    async getUserAddress() {
        return await super.getAddress();
    }
    get poolAddress() {
        return this.poolConfig.address;
    }
    static async create(provider: Provider, poolConfig: PoolConfig, txOption?: TxOption, signer?: Signer) {
        const pool = new Pool(provider, poolConfig, txOption, signer);
        await pool.reload();
        return pool;
    }

    /**
     * only initAndLoadAll once
     */
    async reload() {
        await this.loadStats();
    }

    private getVolumeMult() {
        return Math.max(this.xMult, this.yMult);
    }
    private async loadStats() {
        const stats = await this.poolContract.getStats();
        const mult = this.getMult();
        const bigk = await this.poolContract.bigK();
        this.stats = {
            concentration: bigintToBN(stats.concentration_),
            feeMillionth: bigintToBN(stats.feeMillionth_),
            protocolFeeShareThousandth: bigintToBN(stats.protocolFeeShareThousandth_),

            bigK: bigintToBN(stats.bigK_),
            targetX: bigintToBN(stats.targetX_),

            totalProtocolFeeX: bigintToBN(stats.totalProtocolFeeX_),
            totalProtocolFeeY: bigintToBN(stats.totalProtocolFeeY_),
            cumulativeVolume: bigintToBN(stats.cumulativeVolume_),
            feeRecords: {
                xProtocolFees: stats.feeRecords_[0].map(bigintToBigNumber),
                yProtocolFees: stats.feeRecords_[1].map(bigintToBigNumber),
                volumes: stats.feeRecords_[2].map(bigintToBigNumber)
            },

            currentX: bigintToBN(stats.currentX_),
            currentY: bigintToBN(stats.currentY_),
            totalLP: bigintToBN(stats.totalLP_),

            // calc in sdk
            targetY: bigintToBN(undefined),
            multX: mult.multX,
            multY: mult.multY
        };

        this.updateTargetY();
    }
    private updateTargetY() {
        const stats = this.stats!;
        const valueX = stats.currentX.mul(stats.multX);
        const valueY = stats.currentY.mul(stats.multY);
        const valueTotal = valueX.add(valueY);
        const targetXValue = stats.targetX.mul(stats.multX);
        const targetYValue = valueTotal.sub(targetXValue);
        stats.targetY = targetYValue.div(stats.multY);
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

    get reserve0(): number {
        if (this.stats) {
            return bnToBigNumber(this.stats.currentX).div(this.xMult).toNumber();
        } else {
            throw new Error('Pool stats not loaded');
        }
    }
    get reserve1(): number {
        if (this.stats) {
            return bnToBigNumber(this.stats.currentY).div(this.yMult).toNumber();
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
        const currDay = (days + 6) % 7;
        const prevDay = (days + 5) % 7;
        const feeRecords = this.stats!.feeRecords;
        const currFees = [
            feeRecords.xProtocolFees[currDay].div(this.xMult).toNumber(),
            feeRecords.yProtocolFees[currDay].div(this.yMult).toNumber()
        ];
        const prevFees = [
            feeRecords.xProtocolFees[prevDay].div(this.xMult).toNumber(),
            feeRecords.yProtocolFees[prevDay].div(this.yMult).toNumber()
        ];

        const volumeMult = this.getVolumeMult();

        const currVolume = feeRecords.volumes[currDay].div(volumeMult).toNumber();
        const prevVolume = feeRecords.volumes[prevDay].div(volumeMult).toNumber();

        const feeShare = this.protocolFeeShareThousandth;

        const protocolFees: [number, number] = [currFees[0] - prevFees[0], currFees[1] - prevFees[1]];
        const fullFees: [number, number] = [protocolFees[0] / feeShare, protocolFees[1] / feeShare];
        const lpFees: [number, number] = [fullFees[0] * (1 - feeShare), fullFees[1] * (1 - feeShare)];
        const volume: [number, number] = [currVolume - prevVolume, 0];

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
        return this.reserve0 * price0 + this.reserve1 * price1;
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

    async getUserLpAmount(): Promise<UserLpAmount> {
        let address = await this.getAddress();
        if (address) {
            return await this.lpTokenContract.balanceOf(address);
        } else {
            return BigInt(0);
        }
    }

    quoteXtoY(inputX: BN) {
        this.assertStats();
        if (inputX.eqn(0)) throw new Error('Invalid input x amount');

        const stats = this.stats!;

        // target_x_K = sqrt(big_k / p), where p = mult_x / mult_y
        // Note: BN.sqr is not sqrt !
        const targetXK = sqrt(stats.bigK.mul(stats.multY).div(stats.multX));
        const targetXK_ = targetXK.toString();
        // 1. find current (x,y) on curve-K
        const currentXK = targetXK.sub(stats.targetX).add(stats.currentX);
        const currentXK_ = currentXK.toString();
        if (currentXK.eqn(0)) {
            return new BN(0);
        }
        // BN.div(0) = 0
        const currentYK = stats.bigK.div(currentXK);
        const currentYK_ = currentYK.toString();
        // 2. find new (x, y) on curve-K
        const newXK = currentXK.add(inputX);
        newXK.toString();
        console.log();
        const newYK = stats.bigK.div(newXK);
        newYK.toString();
        const outputBeforeFeeY = currentYK.sub(newYK);
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

        const outputBeforeFeeX = currentXK.sub(newXK);
        if (outputBeforeFeeX.gt(stats.currentX)) throw new Error('Insufficient active X');

        const feeX = outputBeforeFeeX.mul(stats.feeMillionth).divn(MILLIONTH);

        const outputAfterFeeX = outputBeforeFeeX.sub(feeX);

        return outputAfterFeeX;
    }

    async depositV1(xUiAmount: number, yUiAmount: number) {
        console.log(
            'new BigNumber(xUiAmount).times(this.xMult).toFixed(0)',
            new BigNumber(xUiAmount).times(this.xMult).toFixed(0)
        );
        console.log(
            'new BigNumber(yUiAmount).times(this.yMult).toFixed(0)',
            new BigNumber(yUiAmount).times(this.yMult).toFixed(0)
        );
        return await this.send(
            this.poolContract.deposit,
            new BigNumber(xUiAmount).times(this.xMult).toFixed(0),
            new BigNumber(yUiAmount).times(this.yMult).toFixed(0),
            this.txOption
        );
    }

    /**
     *
     * @param inputXLPUiAmount
     * @param inputYLPUiAmount
     */
    async withdrawV1(inputLPUiAmount: number) {
        return await this.send(
            this.poolContract.withdraw,
            new BigNumber(inputLPUiAmount).times(this.lpMult).toFixed(0),
            this.txOption
        );
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
        console.log('24 hour stats (protocolFees):', this.get24HourStats('protocolFees'));
        console.log('24 hour stats (lpFees):', this.get24HourStats('lpFees'));
        console.log('24 hour stats (fullFees):', this.get24HourStats('fullFees'));
        console.log('24 hour stats (volume):', this.get24HourStats('volume'));
    }
    async printUserMessage() {
        const userLpAmount = await this.getUserLpAmount();
        const userLiquidity = this.getUserLiquidity(userLpAmount);
        console.log('Invested', userLiquidity.invested);
        console.log('lp amount: ', userLiquidity.lpAmount);
        console.log('Assets Pooled: ', JSON.stringify(userLiquidity.assetsPooled));
        console.log('Liquidity share: ', userLiquidity.liquidityShare);
    }
}
