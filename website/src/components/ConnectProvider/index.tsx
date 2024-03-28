'use client';

import { initializeConnector } from '@web3-react/core';
import { useMemo } from 'react';

import { ALL_NETWORK } from '../../contexts/NetworkProvider';
import useNetwork from '../../hooks/useNetwork';
import { BtcConnectors, EIP6963Wallet, EvmConnectors, EvmConnectProvider } from '../../wallet';

// import VConsole from 'vconsole';
//
// if (typeof window !== 'undefined') {
//   (window as any).__PARTICLE_ENVIRONMENT__ = process.env.NEXT_PUBLIC_PARTICLE_ENV;
//   if (process.env.NEXT_PUBLIC_PARTICLE_ENV === 'development') {
//     setTimeout(() => {
//       new VConsole({ theme: 'dark' });
//     }, 300);
//   }
// }

export default function ConnectProvider({
  children,
  walletConnectProjectId
}: {
  children: React.ReactNode;
  walletConnectProjectId: string;
}) {
  useNetwork();
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

    const [coinbaseWallet, coinbaseHooks] = initializeConnector<EvmConnectors.CoinbaseConnector>(
      (actions) =>
        new EvmConnectors.CoinbaseConnector({
          actions,
          options: {
            url: 'https://bitcow.xyz',
            appName: 'Bitcow',
            reloadOnDisconnect: false
          }
        })
    );
    console.log('new connectors');
    return [
      [walletConnectV2, walletConnectV2hooks],
      [coinbaseWallet, coinbaseHooks]
    ];
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
                chainIds: [686868],
                version: '1.0.0'
              }
            ]
          }
        }
      }}
      btcConnectors={[
        new BtcConnectors.UnisatConnector(),
        new BtcConnectors.OKXConnector(),
        new BtcConnectors.BitgetConnector()
      ]}
      // @ts-ignore
      evmConnectors={evmConnectors}
      evmConnectorMaxCount={4}
      evmSelectEip6963={[EIP6963Wallet.MetaMask, EIP6963Wallet.OKX]}>
      {children}
    </EvmConnectProvider>
  );
}
