import { initializeConnector, useWeb3React, Web3ReactProvider } from '@web3-react/core';
import type { Web3ReactHooks } from '@web3-react/core';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import type { ConnectOptions } from '../btcContext';
import { useConnectProvider, ConnectProvider as BtcConnectProvider } from '../btcContext';
import EvmConnectModal from '../components/evmConnectModal';
import { CHAINS } from '../config';
import type { BaseConnector as BtcConnector } from '../connector';
import { EVM_CURRENT_CONNECTOR_ID } from '../const';
import type { EIP6963Wallet } from '../const';
import { WalletconnectV2Connector } from '../evmConnector';
import { EIP6963Connector } from '../evmConnector/eip6963';
import { useInjectedProviderDetails } from '../evmConnector/eip6963/providers';
import type { EIP6963ProviderDetail } from '../evmConnector/eip6963/types';
import { useConnector, useETHProvider, useModalStateValue } from '../hooks';
import type { EvmConnector, Metadata, Wallet } from '../types/types';
import { WalletType } from '../types/types';

interface EvmGlobalState {
  openModal: () => void;
  closeModal: () => void;
  evmChainId: number;
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
  evmChainId,
  evmConnectors,
  autoConnect
}: {
  children: React.ReactNode;
  evmChainId: number;
  evmConnectors: [EvmConnector, Web3ReactHooks][];
  autoConnect?: boolean;
}) => {
  const { closeModal, isModalOpen, openModal } = useModalStateValue();

  const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
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
    account: web3ReactAccount
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
  const evmConnect = useCallback(
    async (connector: EvmConnector) => {
      try {
        if (connector instanceof WalletconnectV2Connector) {
          await connector.activate(evmChainId);
        } else {
          await connector.activate(CHAINS[evmChainId]);
        }
      } catch (e) {
        console.log('connect err', e);
      }
    },
    [evmChainId]
  );

  useEffect(() => {
    if (btckitConnector && btckitEvmAccount) {
      setWallet({
        type: WalletType.BTC,
        metadata: btckitConnector.metadata,
        provider: btckitEvmProvider,
        accounts: [{ evm: btckitEvmAccount, btc: btckitBtcAccounts[0] }]
      });
    } else {
      setWallet(undefined);
    }
  }, [btckitConnector, btckitEvmAccount, btckitBtcAccounts, btckitEvmProvider]);

  useEffect(() => {
    if (web3ReactAccount && web3ReactProvider) {
      setWallet({
        type: WalletType.EVM,
        metadata: (web3ReactConnector as unknown as Metadata).metadata,
        provider: web3ReactProvider.provider,
        accounts: [{ evm: web3ReactAccount }]
      });
    } else {
      setWallet(undefined);
    }
  }, [web3ReactAccount, web3ReactProvider, web3ReactConnector]);

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
        evmChainId,
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
  evmChainId,
  evmConnectors,
  evmConnectorMaxCount,
  evmSelectEip6963,
  autoConnect = true
}: {
  children: React.ReactNode;
  options: ConnectOptions;
  btcConnectors: BtcConnector[];
  evmChainId: number;
  evmConnectors: [EvmConnector, Web3ReactHooks][];
  evmConnectorMaxCount: number;
  evmSelectEip6963?: EIP6963Wallet[];
  autoConnect?: boolean;
}) => {
  const allEip6963Injectors = useInjectedProviderDetails();

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
  const allEvmConnectors = [
    ...eip6963Connectors,
    ...evmConnectors.slice(0, evmConnectorMaxCount - eip6963Connectors.length)
  ];
  return (
    <BtcConnectProvider options={options} connectors={btcConnectors} autoConnect={autoConnect}>
      <Web3ReactProvider connectors={allEvmConnectors}>
        <EvmConnectProviderInner
          evmChainId={evmChainId}
          evmConnectors={allEvmConnectors}
          autoConnect={autoConnect}>
          {children}
        </EvmConnectProviderInner>
      </Web3ReactProvider>
    </BtcConnectProvider>
  );
};

export const useEvmConnectContext = () => {
  const context = useContext(EvmConnectContext);
  return context;
};