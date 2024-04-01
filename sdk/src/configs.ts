import { BaseToken, Config } from './types';

export const BTC: BaseToken = {
    name: 'Bit coin',
    symbol: 'BTC',
    address: '0x0000000000000000000000000000000000000000',
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
export const CONFIG: { merlinTestnet: Config; botanixTestnet: Config; b2Testnet: Config; bobTestnet: Config } = {
    merlinTestnet: {
        wBTC: merlinTestnetWBTC,
        swapRouter: '0x5193d68a90D89d4F9ea5e005F124b2F2De9A5371',
        pools: [
            {
                address: '0x088Ca4ad4E99862B1f402E8455A54c9e5CabB359',
                xToken: merlinTestnetWBTC,
                yToken: {
                    name: 'BITUSD',
                    symbol: 'bitusd',
                    address: '0x54E25BAb70acB85A65A1C0517212eD3DAE215230',
                    decimals: 18,
                    coingeckoId: 'usd-coin',
                    logoUrl: ''
                },
                lpToken: '0x2c4Fe36668D7BCAb0274B92143B40e7A9062f913'
            }
        ]
    },
    botanixTestnet: {
        wBTC: botanixTestnetWBTC,
        swapRouter: '0x5193d68a90D89d4F9ea5e005F124b2F2De9A5371',
        pools: [
            {
                address: '0xC0f7cd107EFCB4f26Df298CBdAB680Fb4781403E',
                xToken: botanixTestnetWBTC,
                yToken: {
                    name: 'BITUSD',
                    symbol: 'bitusd',
                    address: '0x193ce459Ed559266971e2BBbB06a089ED6d6D99B',
                    decimals: 18,
                    coingeckoId: 'usd-coin',
                    logoUrl: ''
                },
                lpToken: '0x7A04d8a8862738C9a380f71bcF15e2eC7c910ab8'
            }
        ]
    },
    b2Testnet: {
        wBTC: b2TestnetWBTC,
        swapRouter: '0x5193d68a90D89d4F9ea5e005F124b2F2De9A5371',
        pools: [
            {
                address: '0x04D0dCB13bb2c2E5Ef22DF392f6c277F4df7e4a7',
                xToken: b2TestnetWBTC,
                yToken: {
                    name: 'BITUSD',
                    symbol: 'bitusd',
                    address: '0xEfa34e54dc5F262167cc56d777997c38835b52ca',
                    decimals: 18,
                    coingeckoId: 'usd-coin',
                    logoUrl: ''
                },
                lpToken: '0x783498553A0091E9A0A75c3B723b508bb860e01B'
            }
        ]
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
    }
};
