import { ethers } from 'ethers';
import fs from 'mz/fs';

import { CONFIG } from '../configs';
import { Pool } from '../Pool';
import { Sdk } from '../Sdk';

// export const URL = `https://rpc.particle.network/evm-chain?chainId=686868&projectUuid=4fc09dbd-b5a7-4d3a-9610-40200de091d1&projectKey=c7ImwhUKrhSx7d6kpoKbbrHJmzrWhgJGvlU0dbRH`;

const merlinConfig = {
  URL: 'https://rpc.merlinchain.io',
  config: CONFIG.merlin
};

const bitlayerConfig = {
  URL: 'https://rpc.bitlayer.org',
  config: CONFIG.bitlayer
};

/*
const merlinTestnetConfig = {
  URL: 'https://merlin-testnet.blockpi.network/v1/rpc/b890f4dba4f9b56ad2a8301d7bb77ddb3d1f3cc7',
  config: CONFIG.merlinTestnet
};
const botanixTestnetConfig = {
  URL: 'https://node.botanixlabs.dev/',
  config: CONFIG.botanixTestnet
};

const b2TestnetConfig = {
  URL: 'https://haven-rpc.bsquared.network/',
  config: CONFIG.b2Testnet
};

const bobTestnetConfig = {
  URL: 'https://sepolia-dencun.rpc.gobob.xyz/',
  config: CONFIG.bobTestnet
};

const bitLayerTestnetConfig = {
  URL: 'https://testnet-rpc.bitlayer.org',
  config: CONFIG.bitlayerTestnet
};
*/

export const UTIL_CONFIGS = [
  merlinConfig,
  bitlayerConfig
  /*
    merlinTestnetConfig,
    botanixTestnetConfig,
    b2TestnetConfig,
    bobTestnetConfig,
    bitLayerTestnetConfig
   */
];

const currentConfig = bitlayerConfig;

export const txOption = undefined;

export function getProvider() {
  return new ethers.JsonRpcProvider(currentConfig.URL);
}
export function getSigner() {
  if (process.env.MERLIN_CHAIN_DEPLOYER) {
    const provider = getProvider();
    const signer = new ethers.Wallet(process.env.MERLIN_CHAIN_DEPLOYER, provider);
    console.log('Use address ', signer.address);
    return { provider, signer };
  } else {
    throw new Error('Tester not found from env');
  }
}

export async function getPool(xToken: string, yToken: string): Promise<Pool> {
  const sdk = await getSdk();
  for (const pool of sdk.pools) {
    if (pool.xToken.symbol == xToken && pool.yToken.symbol == yToken) {
      return pool;
    } else if (pool.xToken.symbol == yToken && pool.yToken.symbol === xToken) {
      return pool;
    }
  }
  throw new Error('Pool of ' + xToken + '-' + yToken + ' not found');
}
export async function getSdk() {
  const signer = getSigner();
  return Sdk.create(signer.provider, currentConfig.config, 0.2, txOption, signer.signer);
}
export async function checkAndApprovePool(sdk: Sdk, pool: Pool) {
  await sdk.coinList.approve(pool.xToken, pool.poolAddress, 1000000);
  await sdk.coinList.approve(pool.yToken, pool.poolAddress, 1000000);
}

export async function checkAndApproveSdk(sdk: Sdk) {
  for (const token of sdk.coinList.tokens) {
    await sdk.coinList.approve(token, sdk.swapRouter, 10000000);
  }
}

function getPath(fileName: string) {
  return __dirname + '/../cache/' + fileName + '.json';
}

export async function readFile(fileName: string, defaultValue?: any): Promise<any | undefined> {
  const path = getPath(fileName);
  const exists = await fs.exists(path);
  if (exists) {
    const str: string = fs.readFileSync(path) as any;
    return JSON.parse(str);
  } else {
    return defaultValue;
  }
}

export async function writeFile(fileName: string, data: Record<string, any>) {
  const path = getPath(fileName);
  try {
    const str = JSON.stringify(data);
    fs.writeFileSync(path, str);
  } catch (e) {
    throw e;
  }
}
