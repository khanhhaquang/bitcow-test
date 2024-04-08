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
        swapRouter: '0x5193d68a90D89d4F9ea5e005F124b2F2De9A5371',
        tokensBalance: '0x0a14f1c19af60fcbdD841c6845CC05Ac8F23a073'
    },
    botanixTestnet: {
        tokenList: '0x545fF95Ee16557e117D0d5Ce1049Eb640C3538A2',
        tradingPairV1List: '0x4Ab8d39455325da4A0173d7452E54f533400a1c8',
        tradingPairV1Creator: '0xe26a6E9E16969909dfcAa5024864d867553FfEd6',
        swapRouter: '0x5193d68a90D89d4F9ea5e005F124b2F2De9A5371',
        tokensBalance: '0xBCC1Bdcd623Ce48a814c1ede8ddF6422de9C3a0b'
    },
    b2Testnet: {
        tokenList: '0xb77c49BAe3d30888ce2176dA3FAb997e531904c7',
        tradingPairV1List: '0x1E328605b63e426BA6196F1E30e9a7F3b43f81a0',
        tradingPairV1Creator: '0x0271a2A842F9233A59A05C9E446aeA9f334fc49C',
        swapRouter: '0x5193d68a90D89d4F9ea5e005F124b2F2De9A5371',
        tokensBalance: '0x6AbD920E041A9A52F4979935054791CBe24425e8'
    },
    bobTestnet: {
        tokenList: '0x40700E1cCd16eAE708A1daB55048E877914c889C',
        tradingPairV1List: '0x7A04d8a8862738C9a380f71bcF15e2eC7c910ab8',
        tradingPairV1Creator: '0xC0f7cd107EFCB4f26Df298CBdAB680Fb4781403E',
        swapRouter: '0x783498553A0091E9A0A75c3B723b508bb860e01B',
        tokensBalance: '0xE30CDfF0B7aEBb81d5B48B99DE42b191e98F355a'
    },
    bitlayerTestnet: {
        tokenList: '0xeE4b636fF9864446e271eACCcdf560A8517f64c3',
        tradingPairV1List: '0x40700E1cCd16eAE708A1daB55048E877914c889C',
        tradingPairV1Creator: '0x7A04d8a8862738C9a380f71bcF15e2eC7c910ab8',
        swapRouter: '0x5193d68a90D89d4F9ea5e005F124b2F2De9A5371',
        tokensBalance: '0x088Ca4ad4E99862B1f402E8455A54c9e5CabB359'
    }
};
