/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NetworkInfo, useWallet, Wallet } from '@manahippo/aptos-wallet-adapter';
import { RawCoinInfo } from '@manahippo/coin-list';
import { AptosClient, HexString, Types } from 'aptos';
import { MoveResource, UserTransaction } from 'aptos/src/generated';
import { IPool, SDK as ObricSDK } from 'obric';
import { PieceSwapPoolInfo } from 'obric/dist/obric/piece_swap';
import { SSTradingPair } from 'obric/dist/obric/ssswap2';
import { createContext, FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import useNetworkConfiguration from 'hooks/useNetworkConfiguration';
import { ActiveAptosWallet } from 'types/aptos';
import {
  openErrorNotification,
  openTxErrorNotification,
  openTxSuccessNotification
} from 'utils/notifications';

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
  pendingTx: boolean;
  liquidityPools: IPool[];
  requestSwap: (params: {
    fromToken: RawCoinInfo;
    toToken: RawCoinInfo;
    inputAmt: number;
    minOutputAmt: number;
    options?: Partial<Types.SubmitTransactionRequest>;
  }) => Promise<boolean>;
  requestAddLiquidity: (params: {
    xToken: RawCoinInfo;
    yToken: RawCoinInfo;
    xAmt: number;
    yAmt: number;
  }) => Promise<boolean>;
  requestWithdrawLiquidity: (params: {
    xToken: RawCoinInfo;
    yToken: RawCoinInfo;
    amt: number;
  }) => Promise<boolean>;
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
  const { connected, account, network, wallet, signAndSubmitTransaction } = useWallet();
  const [obricSDK, setObricSDK] = useState<ObricSDK>();
  const [activeWallet, setActiveWallet] = useState<ActiveAptosWallet>(undefined);
  const [activeNetwork, setActiveNetwork] = useState<NetworkInfo>();
  const [selectedWallet, setSelectedWallet] = useState<Wallet>();
  const [open, setOpen] = useState(false);
  const [walletResource, setWalletResource] = useState<MoveResource[]>([]);
  const [tokenList, setTokenList] = useState<RawCoinInfo[]>();
  const [tokenInfo, setTokenInfo] = useState<Record<string, RawCoinInfo[]>>();
  const [liquidityPools, setLiquidityPools] = useState<IPool[]>();
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [pendingTx, setPendingTx] = useState<boolean>(false);

  const { networkCfg } = useNetworkConfiguration();
  const aptosClient = useMemo(
    () =>
      new AptosClient(networkCfg.fullNodeUrl, {
        CREDENTIALS: 'same-origin',
        WITH_CREDENTIALS: false
      }),
    [networkCfg.fullNodeUrl]
  );

  const getBasiqSdk = useCallback(() => {
    setObricSDK(ObricSDK.create(aptosClient));
    setShouldRefresh(true);
  }, [aptosClient]);

  useEffect(() => {
    getBasiqSdk();
  }, [getBasiqSdk]);

  const fetchCoinList = useCallback(async () => {
    if (obricSDK) {
      const list = obricSDK.coinList.getCoinInfoList();
      const tokens = obricSDK.coinList.symbolToCoinInfo;
      setTokenList(list);
      setTokenInfo(tokens);
    }
  }, [obricSDK]);

  const fetchActiveWalletResources = useCallback(async () => {
    if (obricSDK) {
      const resources = await obricSDK?.aptosClient.getAccountResources(activeWallet);
      //const txHistory = await obricSDK?.aptosClient.getAccountTransactions(activeWallet);

      console.log(`Updating to ${resources.length} wallet resources`);
      setWalletResource(resources);
    }
  }, [activeWallet, obricSDK]);

  useEffect(() => {
    if (activeWallet && obricSDK) {
      fetchActiveWalletResources();
    }
  }, [activeWallet, obricSDK, fetchActiveWalletResources]);

  const fetchPools = useCallback(async () => {
    if (obricSDK) {
      const result: IPool[] = [];
      const v1Pools = obricSDK.aptosV1Pools;
      const v2Pools = obricSDK.aptosV2Pools;
      setLiquidityPools(result.concat(v1Pools).concat(v2Pools));
    }
  }, [obricSDK]);

  useEffect(() => {
    if (obricSDK) {
      fetchPools();
    }
  }, [fetchPools, obricSDK, activeWallet]);

  const refreshSDKState = useCallback(async () => {
    if (obricSDK) {
      await obricSDK.loadState();
      fetchActiveWalletResources();
      fetchPools();
      setShouldRefresh(false);
    }
  }, [fetchActiveWalletResources, fetchPools, obricSDK]);

  useEffect(() => {
    if (shouldRefresh) {
      refreshSDKState();
    }
  }, [shouldRefresh, refreshSDKState]);

  useEffect(() => {
    if (obricSDK) {
      fetchCoinList();
    }
  }, [obricSDK, fetchCoinList]);

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

  const requestSwap = useCallback(
    async ({ fromToken, toToken, inputAmt, minOutputAmt, options }) => {
      let success = false;
      try {
        if (!activeWallet) throw new Error('Please connect wallet first');
        if (obricSDK) {
          const payload = await obricSDK.swapPayload(
            fromToken.symbol,
            toToken.symbol,
            inputAmt,
            minOutputAmt
          );
          const result = await signAndSubmitTransaction(
            payload as Types.TransactionPayload_EntryFunctionPayload,
            options
          );
          if (result && result.hash) {
            // pending tx notification first
            setPendingTx(true);
            const txnResult = (await aptosClient.waitForTransactionWithResult(result.hash, {
              timeoutSecs: 20,
              checkSuccess: true
            })) as UserTransaction;
            if (txnResult.success) {
              openTxSuccessNotification(
                result.hash,
                `Swapped ${inputAmt} ${fromToken.symbol} to ${toToken.symbol}`
              );
            } else {
              openTxErrorNotification(
                result.hash,
                `Failed to swap ${inputAmt} ${fromToken.symbol} to ${toToken.symbol}`
              );
            }
            setPendingTx(false);
            success = true;
          }
        }
      } catch (error) {
        console.log('Request swap error:', error);
        if (error instanceof Error) {
          openErrorNotification({ detail: error?.message });
        }
        success = false;
      } finally {
        setShouldRefresh(true);
        return success;
      }
    },
    [activeWallet, aptosClient, obricSDK, signAndSubmitTransaction]
  );

  const requestAddLiquidity = useCallback(
    async ({ xToken, yToken, xAmt, yAmt }) => {
      let success = false;
      try {
        if (!activeWallet) throw new Error('Please connect wallet first');
        if (obricSDK) {
          const payload = await obricSDK.addLiquidityPayloadV1(
            xToken.symbol,
            yToken.symbol,
            xAmt,
            yAmt
          );
          const result = await signAndSubmitTransaction(
            payload as Types.TransactionPayload_EntryFunctionPayload
          );
          if (result && result.hash) {
            // pending tx notification first
            setPendingTx(true);
            const txnResult = (await aptosClient.waitForTransactionWithResult(result.hash, {
              timeoutSecs: 20,
              checkSuccess: true
            })) as UserTransaction;
            if (txnResult.success) {
              openTxSuccessNotification(result.hash, `Added ${xToken.symbol} - ${yToken.symbol}`);
            } else {
              openTxErrorNotification(
                result.hash,
                `Failed to add to ${xToken.symbol} - ${yToken.symbol}`
              );
            }
            setPendingTx(false);
            success = true;
          }
        }
      } catch (error) {
        console.log('Request add liquidity error:', error);
        if (error instanceof Error) {
          openErrorNotification({ detail: error?.message });
        }
        success = false;
      } finally {
        setShouldRefresh(true);
        return success;
      }
    },
    [activeWallet, aptosClient, obricSDK, signAndSubmitTransaction]
  );

  const requestWithdrawLiquidity = useCallback(
    async ({ xToken, yToken, amt }) => {
      let success = false;
      try {
        if (!activeWallet) throw new Error('Please connect wallet first');
        if (obricSDK) {
          const payload = await obricSDK.withdrawLiquidityPayloadV1(
            xToken.symbol,
            yToken.symbol,
            amt
          );
          const result = await signAndSubmitTransaction(
            payload as Types.TransactionPayload_EntryFunctionPayload
          );
          if (result && result.hash) {
            // pending tx notification first
            setPendingTx(true);
            const txnResult = (await aptosClient.waitForTransactionWithResult(result.hash, {
              timeoutSecs: 20,
              checkSuccess: true
            })) as UserTransaction;
            if (txnResult.success) {
              openTxSuccessNotification(
                result.hash,
                `Withdraw ${amt} froom ${xToken.symbol} - ${yToken.symbol}`
              );
            } else {
              openTxErrorNotification(
                result.hash,
                `Failed to withdraw ${amt} from ${xToken.symbol} - ${yToken.symbol}`
              );
            }
            setPendingTx(false);
            success = true;
          }
        }
      } catch (error) {
        console.log('Request withdraw liquidity error:', error);
        if (error instanceof Error) {
          openErrorNotification({ detail: error?.message });
        }
        success = false;
      } finally {
        setShouldRefresh(true);
        return success;
      }
    },
    [activeWallet, aptosClient, obricSDK, signAndSubmitTransaction]
  );

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
        obricSDK,
        pendingTx,
        requestSwap,
        requestAddLiquidity,
        requestWithdrawLiquidity,
        liquidityPools
      }}>
      {children}
    </AptosWalletContext.Provider>
  );
};

export { AptosWalletProvider, AptosWalletContext };
