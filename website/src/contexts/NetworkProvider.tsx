import { AddEthereumChainParameter } from '@web3-react/types';
import { Config } from 'obric-merlin';
import { CONFIG } from 'obric-merlin/dist/configs';
import { createContext, FC, ReactNode, useCallback, useEffect, useState } from 'react';

import { useEvmConnectContext } from '../wallet';

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

export type NetworkConfig = {
  chainConfig: AddEthereumChainParameter;
  rpcNodeUrl: string;
  icon: string;
  sdkConfig: Config;
};
interface NetworkContextType {
  networks: NetworkConfig[];
  currentNetwork: NetworkConfig;
  setCurrentNetwork: (network: NetworkConfig) => void;
}

export const ALL_NETWORK: NetworkConfig[] = [
  {
    chainConfig: {
      chainId: 686868,
      chainName: 'Merlin Testnet',
      nativeCurrency: BTC,
      rpcUrls: ['https://testnet-rpc.merlinchain.io'],
      blockExplorerUrls: ['https://testnet-scan.merlinchain.io/']
    },
    rpcNodeUrl: 'https://testnet-rpc.merlinchain.io',
    icon: '/images/merlin.png',
    sdkConfig: CONFIG.merlinTestnet
  },
  // {
  //   chainConfig: {
  //     chainId: 3636,
  //     chainName: 'Botanix Testnet',
  //     nativeCurrency: BTC,
  //     rpcUrls: ['https://node.botanixlabs.dev'],
  //     blockExplorerUrls: ['https://blockscout.botanixlabs.dev']
  //   },
  //   rpcNodeUrl: 'https://node.botanixlabs.dev',
  //   icon: '/images/botanix.png',
  //   sdkConfig: CONFIG.botanixTestnet
  // },
  {
    chainConfig: {
      chainId: 606808,
      chainName: 'Bob Testnet',
      nativeCurrency: ETH,
      rpcUrls: ['https://sepolia-dencun.rpc.gobob.xyz/'],
      blockExplorerUrls: ['https://sepolia-dencun.explorer.gobob.xyz/']
    },
    rpcNodeUrl: 'https://sepolia-dencun.rpc.gobob.xyz/',
    icon: 'images/bob.png',
    sdkConfig: CONFIG.bobTestnet
  },
  {
    chainConfig: {
      chainId: 1102,
      chainName: 'B2 Haven Testnet',
      nativeCurrency: BTC,
      rpcUrls: ['https://haven-rpc.bsquared.network'],
      blockExplorerUrls: ['https://haven-explorer.bsquared.network/']
    },
    rpcNodeUrl: 'https://haven-rpc.bsquared.network',
    icon: '/images/bSquared.png',
    sdkConfig: CONFIG.b2Testnet
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
      blockExplorerUrls: ['https://haven-explorer.bsquared.network/']
    },
    rpcNodeUrl: 'https://testnet-rpc.bitlayer.org',
    icon: '/images/bitlayer.png',
    sdkConfig: CONFIG.bitlayerTestnet
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

const NetworkContext = createContext<NetworkContextType>({} as NetworkContextType);

interface TConfigProps {
  children: ReactNode;
}

const NetworkProvider: FC<TConfigProps> = ({ children }) => {
  const [currentNetwork, setCurrentNetworkState] = useState<NetworkConfig>();
  const { setCurrentChain } = useEvmConnectContext();
  const setCurrentNetwork = useCallback(
    (network: NetworkConfig) => {
      localStorage.setItem('current-network', network.chainConfig.chainId.toString());
      setCurrentNetworkState(network);
    },
    [setCurrentNetworkState]
  );
  useEffect(() => {
    const currentNetworkChainId = localStorage.getItem('current-network');
    if (currentNetworkChainId) {
      for (const networkConfig of ALL_NETWORK) {
        if (networkConfig.chainConfig.chainId.toString() === currentNetworkChainId) {
          setCurrentNetworkState(networkConfig);
          setCurrentChain(networkConfig.chainConfig);
          break;
        }
      }
    } else {
      setCurrentNetworkState(ALL_NETWORK[0]);
    }
  }, []);
  return (
    <NetworkContext.Provider value={{ networks: ALL_NETWORK, currentNetwork, setCurrentNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
};
export { NetworkProvider, NetworkContext };
