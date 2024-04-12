import { PairStats, StatsV1, TokenInfo } from '../types';
import { bigintToBigNumber, bigintToBN } from './common';

export function parseStatsV1(fetchStatsV1: any): StatsV1 {
    const statsV1: StatsV1 = {
        concentration: bigintToBN(fetchStatsV1.concentration),
        feeMillionth: bigintToBN(fetchStatsV1.feeMillionth),
        protocolFeeShareThousandth: bigintToBN(fetchStatsV1.protocolFeeShareThousandth),

        totalProtocolFeeX: bigintToBN(fetchStatsV1.totalProtocolFeeX),
        totalProtocolFeeY: bigintToBN(fetchStatsV1.totalProtocolFeeY),
        cumulativeVolume: bigintToBN(fetchStatsV1.cumulativeVolume),
        feeRecords: {
            xProtocolFees: fetchStatsV1.feeRecords[0].map(bigintToBigNumber),
            yProtocolFees: fetchStatsV1.feeRecords[1].map(bigintToBigNumber),
            volumes: fetchStatsV1.feeRecords[2].map(bigintToBigNumber)
        },
        currentX: bigintToBN(fetchStatsV1.currentX_),
        currentY: bigintToBN(fetchStatsV1.currentY_),
        totalLP: bigintToBN(fetchStatsV1.totalLP_),
        multX: bigintToBN(fetchStatsV1.multX_),
        multY: bigintToBN(fetchStatsV1.multY_),

        bigK: bigintToBN(),
        targetX: bigintToBN(),
        targetY: bigintToBN()
    };
    fillStats(statsV1);
    return statsV1;
}
function fillStats(stats: StatsV1) {
    if (stats.concentration.eqn(1)) {
        stats.bigK = stats.currentX.mul(stats.currentY);
        stats.targetX = stats.currentX;
        stats.targetY = stats.currentY;
    } else {
        stats.targetX = stats.currentX.mul(stats.multX).add(stats.currentY.mul(stats.multY)).divn(2).div(stats.multX);
        stats.targetY = stats.targetX.mul(stats.multX).div(stats.multY);
        stats.bigK = stats.concentration.mul(stats.concentration).mul(stats.targetX).mul(stats.targetY);
    }
}
export function parsePairStats(pairStats: any): PairStats {
    const pair = pairStats.pair;
    return {
        pair: {
            pairAddress: pair.pairAddress,
            xToken: pair.xToken,
            xDecimals: parseFloat(pair.xDecimals.toString()),
            xSymbol: pair.xSymbol,
            yToken: pair.yToken,
            yDecimals: parseFloat(pair.yDecimals.toString()),
            ySymbol: pair.ySymbol,
            lpToken: pair.lpToken
        },
        statsV1: parseStatsV1(pairStats.statsV1)
    };
}
export function parseTokenInfo(token: any): TokenInfo {
    return {
        address: token.tokenAddress,
        name: token.name,
        symbol: token.symbol,
        decimals: Number(token.decimals.toString()),
        description: token.description,
        projectUrl: token.projectUrl,
        logoUrl: token.logoUrl,
        coingeckoId: token.coingeckoId
    };
}
