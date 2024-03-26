import { Command } from 'commander';
import { checkAndApprovePool, checkAndApproveSdk, getPool, getSdk } from './utils';
import { sleep } from '../utils/common';

export const main = new Command();

main.name('obric-cli').description('Obric SDK cli tool.');

async function printSDK() {
    const sdk = await getSdk();
    const fees = sdk.pools[0].feesUsd(1, 1);
    console.log(fees);
    await sleep(1000);
    await sdk.print();
    await sleep(1000);
    const balances = await sdk.coinList.getBalances();
    await sleep(1000);
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

async function deposit(xToken: string, yToken: string, xAmount: string) {
    const pool = await getPool(xToken, yToken);
    await pool.printMessage();
    await sleep(1000);
    await pool.depositV1(parseFloat(xAmount));
    await pool.reload();
    console.log('');
    await pool.printMessage();
}
main.command('deposit').argument('xToken').argument('yToken').argument('xAmount').argument('yAmount').action(deposit);

async function withdraw(xToken: string, yToken: string, lpAmount: string) {
    const pool = await getPool(xToken, yToken);

    await pool.printMessage();
    await pool.withdrawV1(parseFloat(lpAmount));
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
main.command('swap')
    .argument('inputToken')
    .argument('outputToken')
    .argument('amount')
    // .argument('minOut', '', 'undefined')
    .action(swap);

main.parse();
