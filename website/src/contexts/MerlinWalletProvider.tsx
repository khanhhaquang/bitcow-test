/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Eip1193Provider, ethers } from 'ethers';
import {
  TokenInfo,
  TokenInfo as Token,
  IPool,
  Quote,
  Sdk as ObricSDK,
  TxOption,
  UserLpAmount
} from 'obric-merlin';
import { createContext, FC, ReactNode, useCallback, useEffect, useState } from 'react';

import {
  openErrorNotification,
  openTxErrorNotification,
  openTxSuccessNotification
} from 'utils/notifications';

import useNetwork from '../hooks/useNetwork';
import { useEvmConnectContext, Wallet } from '../wallet';

interface MerlinWalletContextType {
  wallet?: Wallet;
  openWalletModal: () => void;
  closeWalletModal: () => void;
  obricSDK: ObricSDK;
  liquidityPools: IPool[];
  tokenList: TokenInfo[];
  symbolToToken: Record<string, TokenInfo>;
  tokenBalances: Record<string, number>;
  userPoolLpAmount: Record<string, UserLpAmount>;
  pendingTx: boolean;
  requestSwap: (quote: Quote, minOutputAmt: number) => Promise<boolean>;
  requestAddLiquidity: (pool: IPool, xAmount: number, yAmount: number) => Promise<boolean>;
  requestWithdrawLiquidity: (pool: IPool, amt: string) => Promise<boolean>;
}

interface TProviderProps {
  children: ReactNode;
}

const MerlinWalletContext = createContext<MerlinWalletContextType>({} as MerlinWalletContextType);

const MerlinWalletProvider: FC<TProviderProps> = ({ children }) => {
  const { wallet, openModal, closeModal } = useEvmConnectContext();
  const [obricSDK, setObricSDK] = useState<ObricSDK>();

  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [pendingTx, setPendingTx] = useState<boolean>(false);
  const [txOption, setTxOption] = useState<TxOption>({});

  const [tokenList, setTokenList] = useState<Token[]>();
  const [symbolToToken, setSymbolToToken] = useState<Record<string, Token>>();
  const [tokenBalances, setTokenBalances] = useState<Record<string, number>>();
  const [liquidityPools, setLiquidityPools] = useState<IPool[]>();
  const [userPoolLpAmount, setUserPoolLpAmount] = useState<Record<string, UserLpAmount>>();
  const [timeOutCount, setTimeOutCount] = useState(0);
  const [timeOutArray, setTimeOutArray] = useState<boolean[]>([]);
  const { currentNetwork } = useNetwork();
  useEffect(() => {
    console.log('currentNetwork', currentNetwork);
    if (currentNetwork) {
      const provider = new ethers.JsonRpcProvider(currentNetwork.rpcNodeUrl, undefined, {
        batchMaxCount: 1
      });
      setObricSDK(new ObricSDK(provider as any, currentNetwork.sdkConfig, txOption));
      setShouldRefresh(true);
    }
  }, [currentNetwork, txOption]);
  useEffect(() => {
    if (timeOutCount > 2) {
      openErrorNotification({
        detail: `The ${currentNetwork.chainConfig.chainName} is currently unstable. We recommend switching to a different testnet for testing.`
      });
      setTimeOutArray([]);
      setTimeOutCount(0);
    }
  }, [timeOutCount, currentNetwork]);

  useEffect(() => {
    if (obricSDK) {
      obricSDK.setTxOption(txOption);
    }
  }, [txOption, obricSDK]);

  const setObricSdkSigner = useCallback(async () => {
    if (!obricSDK) {
      return;
    }
    if (wallet) {
      const browserProvider = new ethers.BrowserProvider(wallet.provider as Eip1193Provider);
      const signer = await browserProvider.getSigner();
      obricSDK.setSigner(signer as any);
      setShouldRefresh(true);
    } else {
      obricSDK.setSigner(undefined);
      setShouldRefresh(true);
    }
  }, [obricSDK, wallet]);
  useEffect(() => {
    setObricSdkSigner();
  }, [setObricSdkSigner]);

  const fetchTokenBalances = useCallback(async () => {
    try {
      const timeOut = setTimeout(() => {
        timeOutArray.push(true);
        setTimeOutCount(timeOutArray.length);
      }, 5000);
      const balances = await obricSDK.coinList.getBalances();
      clearTimeout(timeOut);
      setTokenBalances(balances);
    } catch (e) {}
  }, [obricSDK, timeOutArray]);

  const fetchUserPoolLpAmount = useCallback(async () => {
    try {
      const timeOut = setTimeout(() => {
        timeOutArray.push(true);
        setTimeOutCount(timeOutArray.length);
      }, 5000);
      const userLP = await obricSDK.getUserPoolLpAmount();
      clearTimeout(timeOut);
      setUserPoolLpAmount(userLP);
    } catch (e) {}
  }, [obricSDK, timeOutArray]);

  const reloadObricSdk = useCallback(async () => {
    try {
      const timeOut = setTimeout(() => {
        timeOutArray.push(true);
        setTimeOutCount(timeOutArray.length);
      }, 5000);
      const { tokens, pools } = await obricSDK.reload();
      console.log(tokens);
      clearTimeout(timeOut);
      setTokenList(tokens);
      setSymbolToToken(obricSDK.coinList.symbolToToken);
      setLiquidityPools(pools);
      fetchTokenBalances();
      fetchUserPoolLpAmount();
    } catch (e) {}
  }, [obricSDK, fetchTokenBalances, fetchUserPoolLpAmount, timeOutArray]);

  const refreshSDKState = useCallback(async () => {
    if (obricSDK && shouldRefresh) {
      reloadObricSdk();
      setShouldRefresh(false);
    }
  }, [obricSDK, shouldRefresh, reloadObricSdk]);

  useEffect(() => {
    if (shouldRefresh) {
      console.log('refresh');
      refreshSDKState();
    }
  }, [shouldRefresh, refreshSDKState]);

  const checkTransactionError = useCallback((e: any) => {
    if (e.code === 'ACTION_REJECTED' || e.reason === 'rejected' || e.info?.error?.code === 4001) {
      openErrorNotification({ detail: 'User rejected' });
      return;
    }
    openErrorNotification({ detail: e.message });
  }, []);

  const checkApprove = useCallback(
    async (token: TokenInfo, spender: string, minAmount: number) => {
      // todo
      try {
        const result = await obricSDK.coinList.approve(token, spender, minAmount);
        if (result === undefined) {
          return true;
        } else if (result === null) {
          openErrorNotification({ detail: `Fail approve to ${token.symbol}` });
          return false;
        } else if (result.status === 0) {
          openTxErrorNotification(result.hash, `Fail approve to ${token.symbol}`);
          return false;
        } else {
          return true;
        }
      } catch (e: any) {
        checkTransactionError(e);
        return false;
      }
    },
    [obricSDK, checkTransactionError]
  );
  const requestSwap = useCallback(
    async (quote, minOutputAmt) => {
      let success = false;
      if (!wallet) throw new Error('Please connect wallet first');
      const fromToken = quote.inputToken;
      const toToken = quote.outputToken;
      // todo check transaction result detail
      if (obricSDK) {
        setPendingTx(true);
        if (!(await checkApprove(fromToken, obricSDK.swapRouter, quote.inAmt))) {
          setPendingTx(false);
          success = false;
          return success;
        }
        try {
          const result = await obricSDK.swap(quote, minOutputAmt);
          if (result.status === 1) {
            openTxSuccessNotification(
              result.hash,
              `Swapped ${quote.inAmt} ${fromToken.symbol} to ${toToken.symbol}`
            );
          } else if (result.status === 0) {
            openTxErrorNotification(
              result.hash,
              `Failed to swap ${quote.inAmt} ${fromToken.symbol} to ${toToken.symbol}`
            );
          }

          success = true;
        } catch (e) {
          checkTransactionError(e);
          success = false;
        } finally {
          setPendingTx(false);
          setShouldRefresh(true);
        }
      } else {
        success = false;
      }
      return success;
    },
    [obricSDK, checkApprove, wallet, checkTransactionError]
  );

  const requestAddLiquidity = useCallback(
    async (pool, xAmount, yAmount) => {
      let success = false;
      try {
        if (!wallet) throw new Error('Please connect wallet first');
        if (obricSDK) {
          setPendingTx(true);
          if (
            (await checkApprove(pool.xToken, pool.poolAddress, xAmount)) &&
            (await checkApprove(pool.yToken, pool.poolAddress, yAmount * 1.0001))
          ) {
            const result = await pool.depositV1(xAmount, yAmount);
            if (result.status === 1) {
              openTxSuccessNotification(
                result.hash,
                `Deposit success to ${pool.token0.symbol}-${pool.token1.symbol}`
              );
            } else if (result.status === 0) {
              openTxErrorNotification(
                result.hash,
                `Failed to deposit to ${pool.token0.symbol}-${pool.token1.symbol}`
              );
            }
            success = true;
          } else {
            success = false;
          }
        }
      } catch (error) {
        checkTransactionError(error);
        success = false;
      } finally {
        setPendingTx(false);
        setShouldRefresh(true);
        return success;
      }
    },
    [obricSDK, checkApprove, wallet, checkTransactionError]
  );

  const requestWithdrawLiquidity = useCallback(
    async (pool: IPool, amt: string) => {
      let success = false;
      try {
        if (!wallet) throw new Error('Please connect wallet first');
        if (obricSDK) {
          setPendingTx(true);
          const result = await pool.withdrawV1(amt);
          if (result.status === 1) {
            openTxSuccessNotification(
              result.hash,
              `Withdraw success from ${amt} lp ${pool.token0.symbol}-${pool.token1.symbol}`
            );
          } else if (result.status === 0) {
            openTxErrorNotification(
              result.hash,
              `Failed to withdraw from ${pool.token0.symbol}-${pool.token1.symbol}`
            );
          }
          setPendingTx(false);
          success = true;
        }
      } catch (error) {
        checkTransactionError(error);
        setPendingTx(false);
      } finally {
        setShouldRefresh(true);
        return success;
      }
    },
    [obricSDK, wallet, checkTransactionError]
  );

  return (
    <MerlinWalletContext.Provider
      value={{
        wallet,
        openWalletModal: openModal,
        closeWalletModal: closeModal,
        obricSDK,
        liquidityPools,
        tokenList,
        symbolToToken,
        tokenBalances,
        userPoolLpAmount,
        pendingTx,
        requestSwap,
        requestAddLiquidity,
        requestWithdrawLiquidity
      }}>
      {children}
    </MerlinWalletContext.Provider>
  );
};

export { MerlinWalletProvider, MerlinWalletContext };
