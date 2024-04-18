import { Command } from 'commander';
import { checkAndApprovePool, checkAndApproveSdk, getPool, getSdk, readFile, UTIL_CONFIGS, writeFile } from './utils';
import { sleep } from '../utils/common';

import { ethers } from 'ethers';
import { Sdk } from '../Sdk';
import { PairStats, TokenInfo } from '../types';

export const main = new Command();

main.name('obric-cli').description('Obric SDK cli tool.');

async function print() {
    return new Promise((r) =>
        setTimeout(() => {
            console.log('hello');
            r(true);
        }, 10000)
    );
}

async function printSDK() {
    const sdk = await getSdk();
    await sdk.coinList.reload(500, 500);

    const balances = await sdk.getTokensBalance(500, false);

    await sdk.print();
    console.log(balances);
}

main.command('print-sdk').action(printSDK);

async function approvePool(xToken: string, yToken: string) {
    const pool = await getPool(xToken, yToken);
    const sdk = await getSdk();
    await pool.printMessage();
    await checkAndApprovePool(sdk, pool);
}

main.command('approve-pool').argument('xToken').argument('yToken').action(approvePool);

async function deposit(xToken: string, yToken: string, xAmount: string, yAmount: string) {
    const pool = await getPool(xToken, yToken);
    await pool.printMessage();
    await sleep(1000);
    await pool.depositV1(parseFloat(xAmount), parseFloat(yAmount));
    await pool.reload();
    console.log('');
    await pool.printMessage();
}
main.command('deposit')
    .argument('xToken')
    .argument('yToken')
    .argument('xAmount')
    // .argument('yAmount', '', '63000')
    .action(deposit);

async function withdraw(xToken: string, yToken: string, lpAmount: string) {
    const pool = await getPool(xToken, yToken);

    await pool.printMessage();
    await pool.withdrawV1(lpAmount);
    await pool.reload();
    await pool.printMessage();
}
main.command('withdraw').argument('xToken').argument('yToken').argument('lpAmount').action(withdraw);

async function approveSdk() {
    const sdk = await getSdk();
    await checkAndApproveSdk(sdk);
}

main.command('approve-sdk').action(approveSdk);

async function getQuote(inputToken: string, outputToken: string, amount: string) {
    const sdk = await getSdk();
    sdk.getQuoteSymbol(inputToken, outputToken, parseFloat(amount));
}

main.command('quote').argument('inputToken').argument('outputToken').argument('amount').action(getQuote);

async function swap(inputToken: string, outputToken: string, amount: string, minOut: string) {
    const sdk = await getSdk();
    const quote = sdk.getQuoteSymbol(inputToken, outputToken, parseFloat(amount));
    if (quote) {
        console.log(await sdk.swap(quote, 0));
    } else {
        console.log('Quote not found');
    }
}
main.command('swap').argument('inputToken').argument('outputToken').argument('amount').action(swap);

async function cacheTokenList() {
    const tokensMap: Record<number, TokenInfo[]> = await readFile('tokens', {});
    const pairsMap: Record<number, PairStats[]> = await readFile('pairs', {});
    for (const config of UTIL_CONFIGS) {
        console.log('ChainId:', config.config.chainId);

        if ([686868, 1102, 3636].includes(config.config.chainId)) {
            if (pairsMap[config.config.chainId] === undefined) {
                pairsMap[config.config.chainId] = [];
            }
            if (tokensMap[config.config.chainId] === undefined) {
                tokensMap[config.config.chainId] = [];
            }
            console.log('continue\n');
            continue;
        }
        console.log('Old pair count:', pairsMap[config.config.chainId].length);
        const provider = new ethers.JsonRpcProvider(config.URL);
        const sdk = new Sdk(provider, config.config, 0.2);

        const stats = await sdk.fetchStats(10);
        pairsMap[config.config.chainId] = stats;

        const tokens = await sdk.coinList.reload(30, 30);
        tokensMap[config.config.chainId] = tokens;

        console.log();
    }

    await writeFile('tokens', tokensMap);
    await writeFile('pairs', pairsMap);
}

main.command('cache').action(cacheTokenList);

main.parse();
