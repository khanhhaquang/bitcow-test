import { configureStore } from '@reduxjs/toolkit';
import reducer from 'modules/rootReducer';
import { Provider as ReduxProvider } from 'react-redux';
import { logger } from 'redux-logger';

import ErrorBoundary from 'components/ErrorBoundary';
import { MerlinWalletProvider } from 'contexts/MerlinWalletProvider';
import { PoolsProvider } from 'contexts/PoolsProvider';

import ConnectProvider from './components/ConnectProvider';

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
  return (
    <ErrorBoundary>
      <ConnectProvider walletConnectProjectId={'a6cc11517a10f6f12953fd67b1eb67e7'}>
        <MerlinWalletProvider>
          <PoolsProvider>
            <ReduxProvider store={store}>{props.children}</ReduxProvider>
          </PoolsProvider>
        </MerlinWalletProvider>
      </ConnectProvider>
    </ErrorBoundary>
  );
};

export default Providers;
