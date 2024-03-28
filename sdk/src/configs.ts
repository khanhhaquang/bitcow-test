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
export const CONFIG: { merlinTestnet: Config; botanixTestnet: Config } = {
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
                    coingeckoId: '',
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
                    coingeckoId: '',
                    logoUrl: ''
                },
                lpToken: '0x7A04d8a8862738C9a380f71bcF15e2eC7c910ab8'
            }
        ]
    }
};
