import { BaseToken } from './types';

export const BTC: BaseToken = {
    name: 'Bit coin',
    symbol: 'BTC',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    coingeckoId: 'wrapped-bitcoin',
    logoUrl: ''
};

const MERLIN_TESTNET_WBTC: BaseToken = {
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    address: '0x67A1f4A939b477A6b7c5BF94D97E45dE87E608eF',
    decimals: 18,
    coingeckoId: 'wrapped-bitcoin',
    logoUrl: ''
};
const MERLIN_MAINNET_WBTC: BaseToken = {
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    address: '0xF6D226f9Dc15d9bB51182815b320D3fBE324e1bA',
    decimals: 18,
    coingeckoId: 'wrapped-bitcoin',
    logoUrl: ''
};

export const WBTC = MERLIN_TESTNET_WBTC;

export const USDC: BaseToken = {
    name: 'USD Coin',
    symbol: 'USDC',
    address: '0xAB452fd85A304B3F9A26F5b6c32d6e1a424Cdd6C',
    decimals: 18,
    coingeckoId: 'usd-coin',
    logoUrl: ''
};
export const USDT: BaseToken = {
    name: 'Tether USD',
    symbol: 'USDT',
    address: '0x6553608C7d47A09f545bf892055061a4329C3dDA',
    decimals: 18,
    coingeckoId: 'tether',
    logoUrl: ''
};
export const USDM: BaseToken = {
    name: 'Merlin USD',
    symbol: 'USDM',
    address: '0xDa772cc259Ec5A27e1970CD50AA75271f133AD00',
    decimals: 18,
    coingeckoId: 'tether',
    logoUrl: ''
};

export type PoolConfig = {
    address: string;
    xToken: BaseToken;
    yToken: BaseToken;
    lpToken: string;
};

export const POOL_USDC_USDT: PoolConfig = {
    address: '0x9395f2aFaF1EAef26413917E8C8dE3F9E9Ea9A69',
    xToken: USDC,
    yToken: USDT,
    lpToken: '0xC2aF226f5c19299235b1E34f2436bD599af396f4'
};
export const POOL_USDC_USDM: PoolConfig = {
    address: '0x7Ac654271908F455F607bE6DFcb072D186ddC030',
    xToken: USDC,
    yToken: USDM,
    lpToken: '0xd3729b5F9b043851906177939Cba20294e795b8E'
};

export const POOLS: PoolConfig[] = [POOL_USDC_USDT, POOL_USDC_USDM];
