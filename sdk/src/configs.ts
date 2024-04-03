import { TokenInfo, Config } from './types';

export const BTC: TokenInfo = {
    name: 'Bit coin',
    symbol: 'BTC',
    address: '0x0000000000000000000000000000000000000000',
    description: '',
    projectUrl: '',
    decimals: 18,
    coingeckoId: 'bitcoin',
    logoUrl: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png'
};

export type PoolConfig = {
    address: string;
    xToken: BaseToken;
    yToken: BaseToken;
    lpToken: string;
};
const merlinTestnetWBTC: BaseToken = {
    name: 'wBTC',
    symbol: 'wBTC',
    address: '0x8fA0a1e68cCEd45EC233C6ef6891d76716d40659',
    decimals: 18,
    coingeckoId: 'wrapped-bitcoin',
    logoUrl: ''
};
const botanixTestnetWBTC: BaseToken = {
    name: 'wBTC',
    symbol: 'wBTC',
    address: '0xe60fA1906D5933b02aF5a6E8e48a532B33e4d6CF',
    decimals: 18,
    coingeckoId: 'wrapped-bitcoin',
    logoUrl: ''
};
const b2TestnetWBTC: BaseToken = {
    name: 'wBTC',
    symbol: 'wBTC',
    address: '0x37A36B6a8DA84e08E8341E89AcfeAF177C3bBD59',
    decimals: 18,
    coingeckoId: 'wrapped-bitcoin',
    logoUrl: ''
};
const bobTestnetWBTC: BaseToken = {
    name: 'wBTC',
    symbol: 'wBTC',
    address: '0x600B1c002627a8Aed4029A6987E7D253aD6eC4e0',
    decimals: 18,
    coingeckoId: 'wrapped-bitcoin',
    logoUrl: ''
};
const bitlayerTestnetWBTC: BaseToken = {
    name: 'wBTC',
    symbol: 'wBTC',
    address: '0x542c5c6c1391584057885acdc170aa3c1f964da5',
    decimals: 18,
    coingeckoId: 'wrapped-bitcoin',
    logoUrl: ''
};
export const CONFIG: {
    merlinTestnet: Config;
    botanixTestnet: Config;
    b2Testnet: Config;
    bobTestnet: Config;
    bitlayerTestnet: Config;
} = {
    merlinTestnet: {
        tokenList: '0xc8E4075b246721c010a079e4c3d70268A7c44E17',
        tradingPairV1List: '0x4b395899BAff3Ca27E798BF067a56eb8DEf8061F',
        tradingPairV1Creator: '0x58bb560D09Fc4dFb295E3c05e7c3A3646957c8C5',
        swapRouter: '0x5193d68a90D89d4F9ea5e005F124b2F2De9A5371'
    },
    botanixTestnet: {
        tokenList: '',
        tradingPairV1List: '',
        tradingPairV1Creator: '',
        swapRouter: '0x5193d68a90D89d4F9ea5e005F124b2F2De9A5371'
    },
    b2Testnet: {
        tokenList: '',
        tradingPairV1List: '',
        tradingPairV1Creator: '',
        swapRouter: '0x5193d68a90D89d4F9ea5e005F124b2F2De9A5371'
    },
    bobTestnet: {
        wBTC: bobTestnetWBTC,
        swapRouter: '0x783498553A0091E9A0A75c3B723b508bb860e01B',
        pools: [
            {
                address: '0xc5cec08C53f77AC1931F23eeD7efC8E2CC49255F',
                xToken: bobTestnetWBTC,
                yToken: {
                    name: 'BITUSD',
                    symbol: 'bitusd',
                    address: '0x22EF08b04ee7FAF44592faeE64CDC057943FDA26',
                    decimals: 18,
                    coingeckoId: 'usd-coin',
                    logoUrl: ''
                },
                lpToken: '0xb08361Ff06d3F201A44108E64C5D622A3CD4Da98'
            }
        ]
    },
    bitlayerTestnet: {
        wBTC: bitlayerTestnetWBTC,
        swapRouter: '0x5193d68a90D89d4F9ea5e005F124b2F2De9A5371',
        pools: [
            {
                address: '0x04D0dCB13bb2c2E5Ef22DF392f6c277F4df7e4a7',
                xToken: bitlayerTestnetWBTC,
                yToken: {
                    name: 'BITUSD',
                    symbol: 'bitusd',
                    address: '0x5ca6be430a0e5fb022fc0c842430043fed80cf2b',
                    decimals: 18,
                    coingeckoId: 'usd-coin',
                    logoUrl: ''
                },
                lpToken: '0x783498553A0091E9A0A75c3B723b508bb860e01B'
            }
        ]
    }
};
