/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Eip1193Provider, ethers } from 'ethers';
import {
  BaseToken,
  BaseToken as Token,
  BN,
  IPool,
  Quote,
  Sdk as ObricSDK,
  TxOption,
  UserLpAmount
} from 'obric-merlin';
import { CONFIG } from 'obric-merlin/dist/configs';
import { createContext, FC, ReactNode, useCallback, useEffect, useState } from 'react';

import useNetworkConfiguration from 'hooks/useNetworkConfiguration';
import {
  openErrorNotification,
  openTxErrorNotification,
  openTxSuccessNotification
} from 'utils/notifications';

import { useEvmConnectContext, Wallet } from '../wallet';

interface MerlinWalletContextType {
  wallet?: Wallet;
  openWalletModal: () => void;
  closeWalletModal: () => void;
  obricSDK: ObricSDK;
  liquidityPools: IPool[];
  tokenList: BaseToken[];
  symbolToToken: Record<string, BaseToken>;
  tokenBalances: Record<string, number>;
  userPoolLpAmount: Record<string, UserLpAmount>;
  pendingTx: boolean;
  requestSwap: (quote: Quote, minOutputAmt: number) => Promise<boolean>;
  requestAddLiquidity: (pool: IPool, xAmount: number) => Promise<boolean>;
  requestWithdrawLiquidity: (pool: IPool, amt: number) => Promise<boolean>;
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
  const [txOption, setTxOption] = useState<TxOption>({ gasPrice: 100000000 });

  const [tokenList, setTokenList] = useState<Token[]>();
  const [symbolToToken, setSymbolToToken] = useState<Record<string, Token>>();
  const [tokenBalances, setTokenBalances] = useState<Record<string, number>>();
  const [liquidityPools, setLiquidityPools] = useState<IPool[]>();
  const [userPoolLpAmount, setUserPoolLpAmount] = useState<Record<string, UserLpAmount>>();

  const { networkCfg } = useNetworkConfiguration();

  useEffect(() => {
    const provider = new ethers.JsonRpcProvider(networkCfg.fullNodeUrl, undefined, {
      batchMaxCount: 1
    });
    setObricSDK(new ObricSDK(provider as any, CONFIG.merlinTestnet, txOption));
    setShouldRefresh(true);
  }, [networkCfg, txOption]);

  const fetchCoinList = useCallback(() => {
    if (obricSDK) {
      const allToken = obricSDK.coinList.tokens;
      setTokenList(allToken);
      const symbolToTokenInner = {};
      for (const token of allToken) {
        symbolToTokenInner[token.symbol] = token;
      }
      setSymbolToToken(symbolToTokenInner);
    }
  }, [obricSDK]);

  useEffect(() => {
    if (obricSDK) {
      fetchCoinList();
    }
  }, [obricSDK, fetchCoinList]);

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

  const fetchPools = useCallback(async () => {
    await obricSDK.reload();
    setLiquidityPools([...obricSDK.pools]);
  }, [obricSDK]);

  const fetchTokenBalances = useCallback(async () => {
    const balances = await obricSDK.coinList.getBalances();
    setTokenBalances(balances);
  }, [obricSDK]);

  const fetchUserPoolLpAmount = useCallback(async () => {
    setUserPoolLpAmount(await obricSDK.getUserPoolLpAmount());
  }, [obricSDK]);

  const refreshSDKState = useCallback(async () => {
    if (obricSDK && shouldRefresh) {
      console.log('refreshSDKState');
      fetchPools();
      fetchTokenBalances();
      fetchUserPoolLpAmount();
      setShouldRefresh(false);
    }
  }, [obricSDK, shouldRefresh, fetchTokenBalances, fetchPools, fetchUserPoolLpAmount]);

  useEffect(() => {
    if (shouldRefresh) {
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
    async (token: BaseToken, spender: string) => {
      // todo
      try {
        const result = await obricSDK.coinList.approve(token, spender);
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
        if (!(await checkApprove(fromToken, obricSDK.swapRouter))) {
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
    async (pool, xAmount) => {
      let success = false;
      try {
        if (!wallet) throw new Error('Please connect wallet first');
        if (obricSDK) {
          setPendingTx(true);
          if (
            (await checkApprove(pool.xToken, pool.poolAddress)) &&
            (await checkApprove(pool.yToken, pool.poolAddress))
          ) {
            const result = await pool.depositV1(xAmount);
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
    async (pool: IPool, amt: number) => {
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
