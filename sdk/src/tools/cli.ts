import { Command } from 'commander';
import { checkAndApprovePool, checkAndApproveSdk, getPool, getSdk } from './utils';
import { sleep } from '../utils/common';
import PromiseThrottle from 'promise-throttle';

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

main.parse();
