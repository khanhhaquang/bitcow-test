import { Command } from 'commander';
import { Contract, ethers, Provider } from 'ethers';

import {
  checkAndApprovePool,
  checkAndApproveSdk,
  getPool,
  getSdk,
  readFile,
  UTIL_CONFIGS,
  writeFile
} from './utils';

import { Sdk } from '../Sdk';
import { PairStats, TokenInfo } from '../types';
import { sleep } from '../utils/common';
import { ABI_ERC20 } from '../abi/ERC20';

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
main
  .command('deposit')
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
main
  .command('withdraw')
  .argument('xToken')
  .argument('yToken')
  .argument('lpAmount')
  .action(withdraw);

async function updatePrice(xToken: string, yToken: string, xPrice: string, yPrice: string) {
  const pool = await getPool(xToken, yToken);
  await pool.printMessage();
  await sleep(1000);
  await pool.updatePrice(parseFloat(xPrice), parseFloat(yPrice));
  await pool.reload();
  console.log('');
  await pool.printMessage();
}
main
  .command('update-price')
  .argument('xToken')
  .argument('yToken')
  .argument('xPrice')
  .argument('yPrice')
  .action(updatePrice);

async function approveSdk() {
  const sdk = await getSdk();
  await checkAndApproveSdk(sdk);
}

main.command('approve-sdk').action(approveSdk);

async function getQuote(inputToken: string, outputToken: string, amount: string) {
  const sdk = await getSdk();
  sdk.getQuoteSymbol(inputToken, outputToken, parseFloat(amount));
}

main
  .command('quote')
  .argument('inputToken')
  .argument('outputToken')
  .argument('amount')
  .action(getQuote);

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
async function getTokenInfo(tokenAddress: string, provider: Provider) {
  const testTokenXContract = new Contract(tokenAddress, ABI_ERC20, provider);
  const testTokenXName = await testTokenXContract.name();
  const testTokenXSymbol = await testTokenXContract.symbol();
  return {
    address: tokenAddress,
    name: testTokenXName,
    symbol: testTokenXSymbol,
    decimals: 18,
    description: '',
    projectUrl: '',
    logoUrl: '',
    coingeckoId: ''
  };
}
async function createPair() {
  const sdk = await getSdk();
  const testTokenX = '0xbFcf24768Fe4ECFBE23a198D806222d8b857841e';
  const testTokens = [
    '0xF9A7cc9D316f2d3A12F6D2207902fF0838E7a166',
    '0x69855b8862D30E17E5C53617a1dE7F3C0925A6B2',
    '0xaa47F494DE09780EA39A2f9Ab2e0aC1A28cF77C8',
    '0x6C9bccf47d80dBDC998142F7BE060E0476390AA9',
    '0xcC6A0fBd2261A4B41808e6C097dc1fb46c3A471e',
    '0xB024dA0812a366Ad0227dc56cc14FAA86f55a4Ba',
    '0x171EA2F3C529B62d1602380BD70152D273644e90',
    '0x3Fb05F02FDCf7f8D603b253E06147640b4dBF38B',
    '0xcc2256b315c049Be47A558820209CC5698462847'
  ];
  const xTokenInfo = await getTokenInfo(testTokenX, sdk.signer?.provider!);
  const xLiquidityAmount = 10000;
  const yLiquidityAmount = 10000;
  for (const testToken of testTokens) {
    const yTokenInfo = await getTokenInfo(testToken, sdk.signer?.provider!);

    await sdk.coinList.approveWithTokenAddress(
      xTokenInfo,
      sdk.config.pairV1Manager!,
      xLiquidityAmount
    );
    await sdk.coinList.approveWithTokenAddress(
      yTokenInfo,
      sdk.config.pairV1Manager!,
      yLiquidityAmount
    );
    const tx = await sdk.pairV1Manager?.createPair(
      xTokenInfo,
      yTokenInfo,
      xLiquidityAmount,
      yLiquidityAmount,
      30,
      0,
      1000,
      1000
    );
    console.log(tx);
  }
}

main.command('create-pair').action(createPair);

async function tokenInfo(tokenAddress: string) {
  const sdk = await getSdk();
  const tokenInfo = await sdk.pairV1Manager?.getTokenInfo(tokenAddress);
  console.log(tokenInfo);
  const pairs = await sdk.pairV1Manager?.searchPairsAll(tokenAddress, 100);
  console.log(pairs);
  const pairAddresses = pairs!.map((pair) => pair.pairAddress);
  const stats = await sdk.pairV1Manager?.fetchPairStats(pairAddresses, 100);
  console.log(stats);
}

main.command('token-info').argument('tokenAddress').action(tokenInfo);

async function cacheTokenList() {
  const tokensMap: Record<number, TokenInfo[]> = await readFile('tokens', {});
  const pairsMap: Record<number, PairStats[]> = await readFile('pairs', {});
  for (const config of UTIL_CONFIGS) {
    console.log('ChainId:', config.config.chainId);

    if (![686868].includes(config.config.chainId)) {
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
    const sdk = new Sdk(provider, config.config, 0.2, []);

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
