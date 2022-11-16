import {
  WalletProvider,
  AptosWalletAdapter,
  MartianWalletAdapter,
  // FewchaWalletAdapter,
  PontemWalletAdapter,
  SpikaWalletAdapter
} from '@manahippo/aptos-wallet-adapter';
import { configureStore } from '@reduxjs/toolkit';
import reducer from 'modules/rootReducer';
import { useMemo } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { logger } from 'redux-logger';

import ErrorBoundary from 'components/ErrorBoundary';
import { AptosWalletProvider } from 'contexts/AptosWalletProvider';
import { PoolsProvider } from 'contexts/PoolsProvider';

const isDevelopmentMode = process.env.NODE_ENV === 'development';

export const store = configureStore({
  reducer,
  devTools: isDevelopmentMode,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: {
        ignoredPaths: ['connection']
      }
    }).concat(isDevelopmentMode ? [logger] : [])
});

type TProps = {
  children: any;
};

const Providers: React.FC<TProps> = (props: TProps) => {
  const wallets = useMemo(
    () => [
      new MartianWalletAdapter(),
      new AptosWalletAdapter(),
      // new FewchaWalletAdapter(),
      new PontemWalletAdapter(),
      new SpikaWalletAdapter()
    ],
    []
  );

  return (
    <ErrorBoundary>
      <WalletProvider
        wallets={wallets}
        autoConnect
        onError={(error: Error) => {
          console.log('wallet errors: ', error);
        }}>
        <AptosWalletProvider>
          <PoolsProvider>
            <ReduxProvider store={store}>{props.children}</ReduxProvider>
          </PoolsProvider>
        </AptosWalletProvider>
      </WalletProvider>
    </ErrorBoundary>
  );
};

export default Providers;
