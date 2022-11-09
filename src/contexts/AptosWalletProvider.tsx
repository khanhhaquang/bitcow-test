/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NetworkInfo, useWallet, Wallet } from '@manahippo/aptos-wallet-adapter';
import { createContext, FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { ActiveAptosWallet } from 'types/aptos';
import { AptosClient, HexString } from 'aptos';
import { SDK as ObricSDK } from 'obric';
import { openErrorNotification } from 'utils/notifications';
import useNetworkConfiguration from 'hooks/useNetworkConfiguration';
import { RawCoinInfo } from '@manahippo/coin-list';
import { MoveResource } from 'aptos/src/generated';
// import { App as CoinListApp } from '@manahippo/coin-list';

interface AptosWalletContextType {
  activeWallet?: ActiveAptosWallet;
  activeNetwork?: NetworkInfo;
  selectedWallet?: Wallet;
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  tokenList: RawCoinInfo[];
  tokenInfo: Record<string, RawCoinInfo[]>;
  walletResource: MoveResource[];
  obricSDK: ObricSDK;
}

interface TProviderProps {
  children: ReactNode;
}

const AptosWalletContext = createContext<AptosWalletContextType>({} as AptosWalletContextType);

const hexStringV0ToV1 = (v0: any) => {
  if (typeof v0 === 'string') {
    return new HexString(v0);
  } else if (v0.hexString) {
    return new HexString(v0.toString());
  } else {
    throw new Error(`Invalid hex string object: ${v0}`);
  }
};

const AptosWalletProvider: FC<TProviderProps> = ({ children }) => {
  const { connected, account, network, wallet } = useWallet();
  const [obricSDK, setObricSDK] = useState<ObricSDK>();
  const [activeWallet, setActiveWallet] = useState<ActiveAptosWallet>(undefined);
  const [activeNetwork, setActiveNetwork] = useState<NetworkInfo>();
  const [selectedWallet, setSelectedWallet] = useState<Wallet>();
  const [open, setOpen] = useState(false);
  const [walletResource, setWalletResource] = useState<MoveResource[]>();
  const [tokenList, setTokenList] = useState<RawCoinInfo[]>();
  const [tokenInfo, setTokenInfo] = useState<Record<string, RawCoinInfo[]>>();
  const [coinStore, setCoinStore] = useState();
  const [shouldRefresh, setShouldRefresh] = useState(false);

  // useEffect(() => {
  //   const currentNetwork = process.env.REACT_APP_CURRENT_NETWORK;
  //   if (connected && !new RegExp(currentNetwork, 'i').test(network?.name)) {
  //     openErrorNotification({
  //       detail: `Your wallet network is ${network.name} mismatched with the network of the site: ${currentNetwork}. This might cause transaction failures`,
  //       title: 'Wallet Network Mismatch'
  //     });
  //   }
  // }, [connected, network?.name]);
  // console.log('MEMEME>>>', obricSDK?.coinList.getCoinInfoByType());

  const { networkCfg } = useNetworkConfiguration();
  const aptosClient = useMemo(
    () =>
      new AptosClient(networkCfg.fullNodeUrl, {
        CREDENTIALS: 'same-origin',
        WITH_CREDENTIALS: false
      }),
    [networkCfg.fullNodeUrl]
  );

  const refreshSDKState = useCallback(() => {
    if (obricSDK) {
      obricSDK.loadState();
      setShouldRefresh(false);
    }
  }, [obricSDK]);

  useEffect(() => {
    if (shouldRefresh) {
      refreshSDKState();
    }
  }, [shouldRefresh, refreshSDKState]);

  const getBasiqSdk = useCallback(() => {
    setObricSDK(ObricSDK.create(aptosClient));
    setShouldRefresh(true);
  }, [aptosClient]);

  useEffect(() => {
    getBasiqSdk();
  }, [getBasiqSdk]);

  const fetchCoinList = useCallback(async () => {
    // const list = DEFAULT_COIN_LIST;
    const list = obricSDK.coinList.coinList;
    const tokens = obricSDK.coinList.symbolToCoinInfo;
    const resources = await obricSDK?.aptosClient.getAccountResources(activeWallet);
    console.log('MEMEM>>>', resources);
    setTokenList(list);
    setTokenInfo(tokens);
    setWalletResource(resources);
  }, [
    activeWallet,
    obricSDK?.aptosClient,
    obricSDK?.coinList.coinList,
    obricSDK?.coinList.symbolToCoinInfo
  ]);

  useEffect(() => {
    if (account) {
      fetchCoinList();
    }
  }, [account, fetchCoinList]);

  useEffect(() => {
    if (connected && account?.address) {
      setActiveWallet(hexStringV0ToV1(account?.address));
      setActiveNetwork(network);
      setSelectedWallet(wallet);
    } else {
      setActiveWallet(undefined);
    }
  }, [connected, account, network, wallet]);

  useEffect(() => {
    setActiveNetwork(network);
  }, [network]);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  return (
    <AptosWalletContext.Provider
      value={{
        activeWallet,
        activeNetwork,
        selectedWallet,
        open,
        openModal,
        closeModal,
        tokenList,
        tokenInfo,
        walletResource,
        obricSDK
      }}>
      {children}
    </AptosWalletContext.Provider>
  );
};

export { AptosWalletProvider, AptosWalletContext };
