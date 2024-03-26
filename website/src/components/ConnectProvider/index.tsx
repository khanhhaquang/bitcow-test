'use client';

import { initializeConnector } from '@web3-react/core';
import { useState } from 'react';

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
  const [evmChainId] = useState<number>(686868);
  const [walletConnectV2, walletConnectV2hooks] =
    initializeConnector<EvmConnectors.WalletconnectV2Connector>(
      (actions) =>
        new EvmConnectors.WalletconnectV2Connector({
          actions,
          options: {
            projectId: walletConnectProjectId,
            chains: [4200, 686868, 3636],
            optionalChains: [4200, 686868, 3636],
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
  const evmConnectors = [
    [walletConnectV2, walletConnectV2hooks],
    [coinbaseWallet, coinbaseHooks]
  ];

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
                chainIds: [evmChainId],
                version: '1.0.0'
              }
            ]
          }
        }
      }}
      evmChainId={evmChainId}
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
