import { ethers } from 'ethers';
import { Pool } from '../Pool';
import { PoolConfig, CONFIG } from '../configs';
import { Sdk } from '../Sdk';

// export const URL = `https://rpc.particle.network/evm-chain?chainId=686868&projectUuid=4fc09dbd-b5a7-4d3a-9610-40200de091d1&projectKey=c7ImwhUKrhSx7d6kpoKbbrHJmzrWhgJGvlU0dbRH`;
export const URL = `https://testnet-rpc.merlinchain.io`;
export const txOption = undefined;

export function getProvider() {
    return new ethers.JsonRpcProvider(URL);
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
function getPoolConfig(xToken: string, yToken: string): PoolConfig {
    for (const pool of CONFIG.merlinTestnet.pools) {
        if (pool.xToken.symbol === xToken && pool.yToken.symbol === yToken) {
            return pool;
        }
    }
    throw new Error('Pool of ' + xToken + '-' + yToken + ' not found');
}

export async function getPool(xToken: string, yToken: string): Promise<Pool> {
    const signer = getSigner();
    return await Pool.create(signer.provider, getPoolConfig(xToken, yToken), txOption, signer.signer);
}
export async function getSdk() {
    const signer = getSigner();
    return await Sdk.create(signer.provider, CONFIG.merlinTestnet, txOption, signer.signer);
}
export async function checkAndApprovePool(sdk: Sdk, pool: Pool) {
    await sdk.coinList.approve(pool.xToken, pool.poolAddress);
    await sdk.coinList.approve(pool.yToken, pool.poolAddress);
}

export async function checkAndApproveSdk(sdk: Sdk) {
    for (const token of sdk.coinList.tokens) {
        await sdk.coinList.approve(token, sdk.swapRouter);
    }
}
