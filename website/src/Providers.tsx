import { configureStore } from '@reduxjs/toolkit';
import reducer from 'modules/rootReducer';
import { Provider as ReduxProvider } from 'react-redux';
import { logger } from 'redux-logger';

import ErrorBoundary from 'components/ErrorBoundary';
import { MerlinWalletProvider } from 'contexts/MerlinWalletProvider';
import { NetworkProvider } from 'contexts/NetworkProvider';
import { PoolsProvider } from 'contexts/PoolsProvider';

import ConnectProvider from './components/ConnectProvider';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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
  children: ReactNode;
};

const queryClient = new QueryClient();

const Providers: React.FC<TProps> = (props: TProps) => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={isDevelopmentMode} />
        <ConnectProvider walletConnectProjectId={'a6cc11517a10f6f12953fd67b1eb67e7'}>
          <NetworkProvider>
            <MerlinWalletProvider>
              <PoolsProvider>
                <ReduxProvider store={store}>{props.children}</ReduxProvider>
              </PoolsProvider>
            </MerlinWalletProvider>
          </NetworkProvider>
        </ConnectProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default Providers;
