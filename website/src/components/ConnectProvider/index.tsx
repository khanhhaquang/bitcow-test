'use client';

import { chains } from '@particle-network/chains';
import { initializeConnector } from '@web3-react/core';
import { useMemo } from 'react';

import { ALL_NETWORK } from '../../config';
import { EIP6963Wallet, EvmConnectors, EvmConnectProvider } from '../../wallet';

export default function ConnectProvider({
  children,
  walletConnectProjectId
}: {
  children: React.ReactNode;
  walletConnectProjectId: string;
}) {
  const btcWalletsChains = useMemo(() => {
    return ALL_NETWORK.filter(
      (network) => chains.getEVMChainInfoById(network.chainConfig.chainId) !== undefined
    ).map((network) => network.chainConfig.chainId);
  }, []);
  const evmConnectors = useMemo(() => {
    const chainIds = ALL_NETWORK.map((network) => network.chainConfig.chainId);
    const [walletConnectV2, walletConnectV2hooks] =
      initializeConnector<EvmConnectors.WalletconnectV2Connector>(
        (actions) =>
          new EvmConnectors.WalletconnectV2Connector({
            actions,
            options: {
              projectId: walletConnectProjectId,
              chains: chainIds,
              optionalChains: chainIds,
              showQrModal: true
            }
          })
      );

    return [[walletConnectV2, walletConnectV2hooks]];
  }, [walletConnectProjectId]);

  return (
    <EvmConnectProvider
      options={{
        projectId: '4fc09dbd-b5a7-4d3a-9610-40200de091d1',
        clientKey: 'c7ImwhUKrhSx7d6kpoKbbrHJmzrWhgJGvlU0dbRH',
        appId: 'd10e3dc4-6ba8-419e-8c00-f4805d289a29',
        aaOptions: {
          accountContracts: {
            BTC: [
              {
                chainIds: btcWalletsChains,
                version: '1.0.0'
              }
            ]
          }
        }
      }}
      btcConnectors={[]}
      // @ts-ignore
      evmConnectors={evmConnectors}
      evmConnectorMaxCount={4}
      evmSelectEip6963={[EIP6963Wallet.MetaMask, EIP6963Wallet.OKX]}>
      {children}
    </EvmConnectProvider>
  );
}
