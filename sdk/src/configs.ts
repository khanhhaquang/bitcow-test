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
        tokenList: '',
        tradingPairV1List: '',
        tradingPairV1Creator: '',
        swapRouter: '0x783498553A0091E9A0A75c3B723b508bb860e01B'
    },
    bitlayerTestnet: {
        tokenList: '',
        tradingPairV1List: '',
        tradingPairV1Creator: '',
        swapRouter: '0x5193d68a90D89d4F9ea5e005F124b2F2De9A5371'
    }
};
