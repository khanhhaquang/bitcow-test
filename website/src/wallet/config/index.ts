import type { AddEthereumChainParameter } from '@web3-react/types';

type ChainConfig = { [chainId: number]: AddEthereumChainParameter };
const BTC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Bitcoin',
  symbol: 'BTC',
  decimals: 18
};
export const CHAINS: ChainConfig = {
  4200: {
    chainId: 4200,
    chainName: 'Merlin Mainnet',
    nativeCurrency: BTC,
    rpcUrls: ['https://rpc.merlinchain.io'],
    blockExplorerUrls: ['https://scan.merlinchain.io/']
  },
  686868: {
    chainId: 686868,
    chainName: 'Merlin Testnet',
    nativeCurrency: BTC,
    rpcUrls: ['https://testnet-rpc.merlinchain.io'],
    blockExplorerUrls: ['https://testnet-scan.merlinchain.io/']
  },
  3636: {
    chainId: 3636,
    chainName: 'Botanix Testnet',
    nativeCurrency: BTC,
    rpcUrls: ['https://node.botanixlabs.dev'],
    blockExplorerUrls: ['https://blockscout.botanixlabs.dev']
  }
};
