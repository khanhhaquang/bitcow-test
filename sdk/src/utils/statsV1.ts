import { PairStats, StatsV1, TokenInfo } from '../types';
import { bigintToBigNumber, bigintToBN, stringToBigNumber, stringToBN } from './common';

export function parsePairFromConfig(pairStats: any): PairStats {
    const pair = pairStats.pair;
    return {
        pair: {
            pairAddress: pair.pairAddress,
            xToken: pair.xToken,
            xDecimals: parseFloat(pair.xDecimals),
            xSymbol: pair.xSymbol,
            yToken: pair.yToken,
            yDecimals: parseFloat(pair.yDecimals),
            ySymbol: pair.ySymbol,
            lpToken: pair.lpToken
        },
        statsV1: parseStatsV1FromConfig(pairStats.statsV1)
    };
}

function parseStatsV1FromConfig(fetchStatsV1: any): StatsV1 {
    const statsV1: StatsV1 = {
        concentration: stringToBN(fetchStatsV1.concentration),
        feeMillionth: stringToBN(fetchStatsV1.feeMillionth),
        protocolFeeShareThousandth: stringToBN(fetchStatsV1.protocolFeeShareThousandth),

        totalProtocolFeeX: stringToBN(fetchStatsV1.totalProtocolFeeX),
        totalProtocolFeeY: stringToBN(fetchStatsV1.totalProtocolFeeY),
        cumulativeVolume: stringToBN(fetchStatsV1.cumulativeVolume),
        feeRecords: {
            xProtocolFees: fetchStatsV1.feeRecords.xProtocolFees.map(stringToBigNumber),
            yProtocolFees: fetchStatsV1.feeRecords.yProtocolFees.map(stringToBigNumber),
            volumes: fetchStatsV1.feeRecords.volumes.map(stringToBigNumber)
        },
        currentX: stringToBN(fetchStatsV1.currentX),
        currentY: stringToBN(fetchStatsV1.currentY),
        totalLP: stringToBN(fetchStatsV1.totalLP),
        multX: stringToBN(fetchStatsV1.multX),
        multY: stringToBN(fetchStatsV1.multY),

        bigK: stringToBN(),
        targetX: stringToBN(),
        targetY: stringToBN()
    };
    fillStats(statsV1);
    return statsV1;
}

export function parsePairStatsToConfig(pairStats: any): PairStats {
    const pair = pairStats.pair;
    return {
        pair: {
            pairAddress: pair.pairAddress,
            xToken: pair.xToken,
            xDecimals: pair.xDecimals.toString(),
            xSymbol: pair.xSymbol,
            yToken: pair.yToken,
            yDecimals: pair.yDecimals.toString(),
            ySymbol: pair.ySymbol,
            lpToken: pair.lpToken
        },
        statsV1: parseStatsToConfig(pairStats.statsV1)
    };
}
function parseStatsToConfig(fetchStatsV1: any): any {
    const statsV1 = {
        concentration: fetchStatsV1.concentration.toString(),
        feeMillionth: fetchStatsV1.feeMillionth.toString(),
        protocolFeeShareThousandth: fetchStatsV1.protocolFeeShareThousandth.toString(),

        totalProtocolFeeX: fetchStatsV1.totalProtocolFeeX.toString(),
        totalProtocolFeeY: fetchStatsV1.totalProtocolFeeY.toString(),
        cumulativeVolume: fetchStatsV1.cumulativeVolume.toString(),
        feeRecords: {
            xProtocolFees: fetchStatsV1.feeRecords[0].map((value: any) => value.toString()),
            yProtocolFees: fetchStatsV1.feeRecords[1].map((value: any) => value.toString()),
            volumes: fetchStatsV1.feeRecords[2].map((value: any) => value.toString())
        },
        currentX: fetchStatsV1.currentX_.toString(),
        currentY: fetchStatsV1.currentY_.toString(),
        totalLP: fetchStatsV1.totalLP_.toString(),
        multX: fetchStatsV1.multX_.toString(),
        multY: fetchStatsV1.multY_.toString()
    };

    return statsV1;
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
