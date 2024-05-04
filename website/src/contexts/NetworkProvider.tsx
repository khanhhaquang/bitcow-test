import { createContext, FC, ReactNode, useCallback, useEffect, useState } from 'react';

import { ALL_NETWORK } from '../config';
import { NetworkConfig } from '../types/bitcow';
import { useEvmConnectContext } from '../wallet';

interface NetworkContextType {
  networks: NetworkConfig[];
  currentNetwork: NetworkConfig;
  setCurrentNetwork: (network: NetworkConfig) => void;
}

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
    const localStorageNetwork = localStorage.getItem('current-network');
    const currentNetworkChainId =
      ALL_NETWORK.find(
        (network) => network.chainConfig.chainId.toString() === localStorageNetwork
      )?.chainConfig.chainId.toString() || ALL_NETWORK[0].chainConfig.chainId.toString();
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
  }, [setCurrentChain]);
  return (
    <NetworkContext.Provider value={{ networks: ALL_NETWORK, currentNetwork, setCurrentNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
};
export { NetworkProvider, NetworkContext };
