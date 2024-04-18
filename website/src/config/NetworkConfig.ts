import { AddEthereumChainParameter } from '@web3-react/types';
import { CONFIG } from 'bitcow/dist/configs';

import { NetworkConfig } from '../types/bitcow';

const BTC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Bitcoin',
  symbol: 'BTC',
  decimals: 18
};
const ETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18
};

export const ALL_NETWORK: NetworkConfig[] = [
  {
    chainConfig: {
      chainId: 686868,
      chainName: 'Merlin Testnet',
      nativeCurrency: BTC,
      rpcUrls: ['https://testnet-rpc.merlinchain.io'],
      blockExplorerUrls: ['https://testnet-scan.merlinchain.io']
    },
    sdkConfig: CONFIG.merlinTestnet,
    rpcNodeUrl:
      'https://merlin-testnet.blockpi.network/v1/rpc/b890f4dba4f9b56ad2a8301d7bb77ddb3d1f3cc7',
    icon: '/images/merlin.png',
    requestsPerSecond: 0.3,
    poolsFirstPaginateCount: 8,
    poolsPaginateCount: 8,
    tokensFirstPaginateCount: 8,
    tokensPaginateCount: 8,
    balancePaginateCount: 600,
    fetchAllTokenBalance: false
  },
  {
    chainConfig: {
      chainId: 3636,
      chainName: 'Botanix Testnet',
      nativeCurrency: BTC,
      rpcUrls: ['https://node.botanixlabs.dev'],
      blockExplorerUrls: ['https://blockscout.botanixlabs.dev']
    },
    sdkConfig: CONFIG.botanixTestnet,
    rpcNodeUrl: 'https://node.botanixlabs.dev',
    icon: '/images/botanix.png',
    requestsPerSecond: 0.4,
    poolsFirstPaginateCount: 140,
    poolsPaginateCount: 140,
    tokensFirstPaginateCount: 600,
    tokensPaginateCount: 600,
    balancePaginateCount: 600,
    fetchAllTokenBalance: true
  },
  {
    chainConfig: {
      chainId: 606808,
      chainName: 'Bob Testnet',
      nativeCurrency: ETH,
      rpcUrls: ['https://sepolia-dencun.rpc.gobob.xyz/'],
      blockExplorerUrls: ['https://sepolia-dencun.explorer.gobob.xyz']
    },
    sdkConfig: CONFIG.bobTestnet,
    rpcNodeUrl: 'https://sepolia-dencun.rpc.gobob.xyz/',
    icon: 'images/bob.png',
    requestsPerSecond: 0.4,
    poolsFirstPaginateCount: 140,
    poolsPaginateCount: 140,
    tokensFirstPaginateCount: 600,
    tokensPaginateCount: 600,
    balancePaginateCount: 600,
    fetchAllTokenBalance: true
  },
  {
    chainConfig: {
      chainId: 1102,
      chainName: 'B2 Haven Testnet',
      nativeCurrency: BTC,
      rpcUrls: ['https://haven-rpc.bsquared.network'],
      blockExplorerUrls: ['https://haven-explorer.bsquared.network']
    },
    sdkConfig: CONFIG.b2Testnet,
    rpcNodeUrl: 'https://haven-rpc.bsquared.network',
    icon: '/images/bSquared.png',
    requestsPerSecond: 0.4,
    poolsFirstPaginateCount: 140,
    poolsPaginateCount: 140,
    tokensFirstPaginateCount: 600,
    tokensPaginateCount: 600,
    balancePaginateCount: 600,
    fetchAllTokenBalance: true
  },
  {
    chainConfig: {
      chainId: 200810,
      chainName: 'Bitlayer Testnet',
      nativeCurrency: BTC,
      rpcUrls: [
        'https://testnet-rpc.bitlayer.org',
        'https://testnet-rpc.bitlayer.org',
        'https://rpc.ankr.com/bitlayer_testnet'
      ],

      blockExplorerUrls: ['https://testnet.btrscan.com']
    },
    sdkConfig: CONFIG.bitlayerTestnet,
    rpcNodeUrl: 'https://testnet-rpc.bitlayer.org',
    icon: '/images/bitlayer.png',
    requestsPerSecond: 5,
    poolsFirstPaginateCount: 140,
    poolsPaginateCount: 140,
    tokensFirstPaginateCount: 600,
    tokensPaginateCount: 600,
    balancePaginateCount: 600,
    fetchAllTokenBalance: true
  }
  //   {
  //     chainConfig: {
  //       chainId: 4200,
  //       chainName: 'Merlin',
  //       nativeCurrency: BTC,
  //       rpcUrls: ['https://rpc.merlinchain.io'],
  //       blockExplorerUrls: ['https://scan.merlinchain.io/']
  //     },
  //     rpcNodeUrl: 'https://rpc.merlinchain.io',
  //     icon: '/images/merlin.png'
  //   }
];
