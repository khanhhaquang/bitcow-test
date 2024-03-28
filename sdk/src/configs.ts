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
    address: '0xe160e532C187023f47978F09749b7600fDFEFe6e',
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
        swapRouter: '0x2d112A7C62735CC1ee2a66AffAA99364aA039a6C',
        pools: [
            {
                address: '0x04D0dCB13bb2c2E5Ef22DF392f6c277F4df7e4a7',
                xToken: merlinTestnetWBTC,
                yToken: {
                    name: 'BITUSD',
                    symbol: 'bitusd',
                    address: '0x532d60C7Fb7b1395e74382047b308fE746309527',
                    decimals: 18,
                    coingeckoId: '',
                    logoUrl: ''
                },
                lpToken: '0x783498553A0091E9A0A75c3B723b508bb860e01B'
            }
        ]
    },
    botanixTestnet: {
        wBTC: botanixTestnetWBTC,
        swapRouter: '0x5193d68a90D89d4F9ea5e005F124b2F2De9A5371',
        pools: [
            {
                address: '0x04D0dCB13bb2c2E5Ef22DF392f6c277F4df7e4a7',
                xToken: botanixTestnetWBTC,
                yToken: {
                    name: 'BITUSD',
                    symbol: 'bitusd',
                    address: '0x594e3f78299Ec1AF0F69d36AaB451D3EF2976661',
                    decimals: 18,
                    coingeckoId: '',
                    logoUrl: ''
                },
                lpToken: '0x783498553A0091E9A0A75c3B723b508bb860e01B'
            }
        ]
    }
};
