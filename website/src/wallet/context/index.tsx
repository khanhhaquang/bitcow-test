import { chains } from '@particle-network/chains';
import type { Web3ReactHooks } from '@web3-react/core';
import { initializeConnector, useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { AddEthereumChainParameter } from '@web3-react/types';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { ConnectOptions } from '../btcContext';
import { ConnectProvider as BtcConnectProvider, useConnectProvider } from '../btcContext';
import EvmConnectModal from '../components/evmConnectModal';
import type { BaseConnector as BtcConnector } from '../connector';
import type { EIP6963Wallet } from '../const';
import { EVM_CURRENT_CONNECTOR_ID } from '../const';
import { WalletconnectV2Connector } from '../evmConnector';
import { EIP6963Connector, parseChainId } from '../evmConnector/eip6963';
import { useInjectedProviderDetails } from '../evmConnector/eip6963/providers';
import type { EIP6963ProviderDetail } from '../evmConnector/eip6963/types';
import { useConnector, useETHProvider, useModalStateValue } from '../hooks';
import type { EvmConnector, Metadata, Wallet } from '../types/types';
import { WalletType } from '../types/types';
import { authToken } from 'utils/storage';

interface EvmGlobalState {
  openModal: () => void;
  closeModal: () => void;
  currentChain: AddEthereumChainParameter;
  setCurrentChain: (chain: AddEthereumChainParameter) => Promise<boolean>;
  btcConnectors: BtcConnector[];
  evmConnectors: [EvmConnector, Web3ReactHooks][];
  btcConnect: (connector: BtcConnector) => void;
  evmConnect: (connector: EvmConnector) => void;
  wallet: Wallet | undefined;
  setWallet: (wallet: Wallet | undefined) => void;
  disconnect: () => void;
}
const EvmConnectContext = createContext<EvmGlobalState>({} as any);

const EvmConnectProviderInner = ({
  children,
  evmConnectors,
  autoConnect
}: {
  children: React.ReactNode;
  evmConnectors: [EvmConnector, Web3ReactHooks][];
  autoConnect?: boolean;
}) => {
  const { closeModal, isModalOpen, openModal } = useModalStateValue();

  const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
  const [currentChain, setCurrentChainState] = useState<AddEthereumChainParameter>();
  const {
    connectors: btckitConnectors,
    connector: btckitConnector,
    disconnect: btckitDisconnect,
    accounts: btckitBtcAccounts
  } = useConnectProvider();
  const { connect: btckitConnect } = useConnector();
  const { provider: btckitEvmProvider, evmAccount: btckitEvmAccount } = useETHProvider();

  const {
    connector: web3ReactConnector,
    provider: web3ReactProvider,
    account: web3ReactAccount,
    chainId: web3ReactChainId
  } = useWeb3React();

  const onDisconnect = useCallback(async () => {
    try {
      if (wallet?.type === WalletType.BTC) {
        if (btckitDisconnect) {
          btckitDisconnect();
        }
      } else if (wallet?.type === WalletType.EVM) {
        localStorage.removeItem(EVM_CURRENT_CONNECTOR_ID);
        if (web3ReactConnector?.deactivate) {
          web3ReactConnector.deactivate();
        } else {
          await web3ReactConnector.resetState();
        }
      }
      authToken.clear();
    } catch (e) {
      console.log('disconnect err', e);
    }
  }, [wallet, btckitDisconnect, web3ReactConnector]);

  const btcConnect = useCallback(
    async (connector: BtcConnector) => {
      await btckitConnect(connector.metadata.id);
    },
    [btckitConnect]
  );
  const evnConnectWithChain = useCallback(
    async (connector: EvmConnector, chain: AddEthereumChainParameter) => {
      try {
        if (connector instanceof WalletconnectV2Connector) {
          await connector.activate(chain.chainId);
        } else {
          await connector.activate(chain);
        }
        return true;
      } catch (e) {
        return false;
      }
    },
    []
  );
  const evmConnect = useCallback(
    async (connector: EvmConnector) => {
      if (currentChain) {
        await evnConnectWithChain(connector, currentChain);
      }
    },
    [currentChain, evnConnectWithChain]
  );

  const setCurrentChain = useCallback(
    async (chain: AddEthereumChainParameter) => {
      let success = true;
      if (wallet && wallet.type === WalletType.EVM) {
        const result = await wallet.provider.request({ method: 'eth_chainId' });
        const chainId = parseChainId(result);
        if (chainId !== chain.chainId) {
          const connectorId = localStorage.getItem(EVM_CURRENT_CONNECTOR_ID);
          if (connectorId) {
            const connector = evmConnectors.find(
              (connectorValue) => connectorValue[0].metadata.id === connectorId
            );
            success = await evnConnectWithChain(connector[0], chain);
          }
        }
      } else if (
        wallet &&
        wallet.type === WalletType.BTC &&
        chains.getEVMChainInfoById(currentChain.chainId) === undefined
      ) {
        await onDisconnect();
        success = true;
      }
      if (currentChain === undefined || currentChain.chainId != chain.chainId) {
        setCurrentChainState(chain);
      }
      return success;
    },
    [wallet, currentChain, evmConnectors, onDisconnect, evnConnectWithChain]
  );
  useEffect(() => {
    if (btckitConnector && btckitEvmAccount) {
      setWallet({
        type: WalletType.BTC,
        chainId: btckitEvmProvider.signer.chainId,
        metadata: btckitConnector.metadata,
        provider: btckitEvmProvider,
        accounts: [{ evm: btckitEvmAccount, btc: btckitBtcAccounts[0] }]
      });
    } else {
      setWallet(undefined);
    }
  }, [btckitConnector, btckitEvmAccount, btckitBtcAccounts, btckitEvmProvider]);

  useEffect(() => {
    if (web3ReactAccount && web3ReactProvider && web3ReactChainId) {
      setWallet({
        type: WalletType.EVM,
        chainId: web3ReactChainId,
        metadata: (web3ReactConnector as unknown as Metadata).metadata,
        provider: web3ReactProvider.provider,
        accounts: [{ evm: web3ReactAccount }]
      });
    } else {
      setWallet(undefined);
    }
  }, [web3ReactAccount, web3ReactProvider, web3ReactConnector, web3ReactChainId]);

  useEffect(() => {
    if (autoConnect) {
      const connectorId = localStorage.getItem(EVM_CURRENT_CONNECTOR_ID);
      if (connectorId) {
        const connector = evmConnectors.find(
          (connectorValue) => connectorValue[0].metadata.id === connectorId
        );
        if (connector) {
          try {
            if (connector[0].connectEagerly) {
              connector[0].connectEagerly?.();
            } else {
              connector[0].activate();
            }
          } catch (e) {
            console.log('autoConnect err', e);
          }
        }
      }
    }
  }, [autoConnect, evmConnectors]);

  return (
    <EvmConnectContext.Provider
      value={{
        openModal,
        closeModal,
        btcConnectors: btckitConnectors,
        currentChain,
        setCurrentChain,
        evmConnectors,
        btcConnect,
        evmConnect,
        wallet,
        setWallet,
        disconnect: onDisconnect
      }}>
      {children}
      <EvmConnectModal open={isModalOpen} onClose={closeModal}></EvmConnectModal>
    </EvmConnectContext.Provider>
  );
};
function getSelectedInjectors(
  allEip6963Injectors: readonly EIP6963ProviderDetail[],
  maxSelectCount: number,
  selectEip6963?: EIP6963Wallet[]
) {
  let selectedEip6963Injectors: EIP6963ProviderDetail[];
  if (selectEip6963 && selectEip6963.length > 0) {
    selectedEip6963Injectors = [];
    for (const eip6963Wallet of selectEip6963) {
      if (selectedEip6963Injectors.length >= maxSelectCount) {
        break;
      }
      for (const eip6963Injector of allEip6963Injectors) {
        if (selectedEip6963Injectors.length >= maxSelectCount) {
          break;
        }
        if (eip6963Wallet.toString() === eip6963Injector.info.name) {
          selectedEip6963Injectors.push(eip6963Injector);
        }
      }
    }
    if (selectedEip6963Injectors.length < maxSelectCount) {
      for (const eip6963Injector of allEip6963Injectors) {
        if (selectedEip6963Injectors.length >= maxSelectCount) {
          break;
        }
        if (!selectedEip6963Injectors.includes(eip6963Injector)) {
          selectedEip6963Injectors.push(eip6963Injector);
        }
      }
    }
  } else {
    selectedEip6963Injectors = allEip6963Injectors.slice(0, maxSelectCount);
  }
  return selectedEip6963Injectors;
}
export const EvmConnectProvider = ({
  children,
  options,
  btcConnectors,
  evmConnectors,
  evmConnectorMaxCount,
  evmSelectEip6963,
  autoConnect = true
}: {
  children: React.ReactNode;
  options: ConnectOptions;
  btcConnectors: BtcConnector[];
  evmConnectors: [EvmConnector, Web3ReactHooks][];
  evmConnectorMaxCount: number;
  evmSelectEip6963?: EIP6963Wallet[];
  autoConnect?: boolean;
}) => {
  const allEip6963Injectors = useInjectedProviderDetails();

  const allEvmConnectors = useMemo(() => {
    const selectedEip6963Injectors = getSelectedInjectors(
      allEip6963Injectors,
      evmConnectorMaxCount - 1,
      evmSelectEip6963
    );

    const eip6963Connectors = selectedEip6963Injectors.map(
      (providerDetail): [EvmConnector, Web3ReactHooks] => {
        const [connector, hooks] = initializeConnector<EIP6963Connector>((actions) => {
          return new EIP6963Connector({ actions, providerDetail });
        });
        return [connector as EvmConnector, hooks];
      }
    );
    return [
      ...eip6963Connectors,
      ...evmConnectors.slice(0, evmConnectorMaxCount - eip6963Connectors.length)
    ];
  }, [evmConnectors, allEip6963Injectors, evmConnectorMaxCount, evmSelectEip6963]);

  // leave out btc-connect for now
  if (true) {
    return (
      <BtcConnectProvider options={options} connectors={btcConnectors} autoConnect={autoConnect}>
        <Web3ReactProvider key={new Date().toISOString()} connectors={allEvmConnectors}>
          <EvmConnectProviderInner evmConnectors={allEvmConnectors} autoConnect={autoConnect}>
            {children}
          </EvmConnectProviderInner>
        </Web3ReactProvider>
      </BtcConnectProvider>
    );
  } else {
    return (
      <Web3ReactProvider key={new Date().toISOString()} connectors={allEvmConnectors}>
        <EvmConnectProviderInner evmConnectors={allEvmConnectors} autoConnect={autoConnect}>
          {children}
        </EvmConnectProviderInner>
      </Web3ReactProvider>
    );
  }
};

export const useEvmConnectContext = () => {
  const context = useContext(EvmConnectContext);
  return context;
};
