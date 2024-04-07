/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import BigNumber from 'bignumber.js';
import { Eip1193Provider, ethers } from 'ethers';
import {
  TokenInfo,
  TokenInfo as Token,
  IPool,
  Quote,
  Sdk as ObricSDK,
  TxOption,
  UserLpAmount,
  CreateTokenInfo
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
  createFee: bigint;
  bitusdToken: TokenInfo;
  clearCache: () => void;
  pendingTx: boolean;
  requestSwap: (quote: Quote, minOutputAmt: number) => Promise<boolean>;
  requestAddLiquidity: (pool: IPool, xAmount: number, yAmount: number) => Promise<boolean>;
  requestWithdrawLiquidity: (pool: IPool, amt: string) => Promise<boolean>;
  requestCreatePair: (
    tokenInfo: CreateTokenInfo,
    mintAmount: number,
    addLiquidityAmount: number,
    bitusdAddLiquidityAmount: number,
    protocolFeeShareThousandth: number,
    feeMillionth: number,
    protocolFeeAddress: string,
    addTokenListFee: string
  ) => Promise<boolean>;
}

interface TProviderProps {
  children: ReactNode;
}

const MerlinWalletContext = createContext<MerlinWalletContextType>({} as MerlinWalletContextType);

const MerlinWalletProvider: FC<TProviderProps> = ({ children }) => {
  const { wallet, openModal, closeModal, setCurrentChain } = useEvmConnectContext();
  const [obricSDK, setObricSDK] = useState<ObricSDK>();

  const [shouldRefreshSdk, setShouldRefreshSdk] = useState(false);
  const [shouldRefreshUserMessage, setShouldRefreshUserMessage] = useState(false);
  const [refreshingSdk, setRefreshingSdk] = useState(false);
  const [pendingTx, setPendingTx] = useState<boolean>(false);
  const [txOption, setTxOption] = useState<TxOption>({});

  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [symbolToToken, setSymbolToToken] = useState<Record<string, Token>>({});
  const [tokenBalances, setTokenBalances] = useState<Record<string, number>>({});
  const [liquidityPools, setLiquidityPools] = useState<IPool[]>([]);
  const [userPoolLpAmount, setUserPoolLpAmount] = useState<Record<string, UserLpAmount>>({});
  const [timeOutCount, setTimeOutCount] = useState(0);
  const [timeOutArray, setTimeOutArray] = useState<boolean[]>([]);
  const [createFee] = useState<bigint>(BigInt(150000000000000));
  const [bitusdToken, setBitusdToken] = useState<TokenInfo>();

  const { currentNetwork } = useNetwork();
  const clearCache = useCallback(() => {
    setLiquidityPools([]);
    setTokenList([]);
    setSymbolToToken({});
    setTokenBalances({});
    setUserPoolLpAmount({});
    setBitusdToken(undefined);
  }, []);

  useEffect(() => {
    clearCache();
  }, [currentNetwork, clearCache]);

  const checkNetwork = useCallback(async () => {
    return setCurrentChain(currentNetwork.chainConfig);
  }, [setCurrentChain, currentNetwork]);
  useEffect(() => {
    if (currentNetwork) {
      const provider = new ethers.JsonRpcProvider(currentNetwork.rpcNodeUrl, undefined, {
        batchMaxCount: 1
      });
      setObricSDK(new ObricSDK(provider as any, currentNetwork.sdkConfig, txOption));
      setShouldRefreshSdk(true);
    }
  }, [currentNetwork, txOption]);
  useEffect(() => {
    if (timeOutCount >= 2) {
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
      setShouldRefreshUserMessage(true);
    } else {
      obricSDK.setSigner(undefined);
      setShouldRefreshUserMessage(true);
    }
  }, [obricSDK, wallet]);
  useEffect(() => {
    setObricSdkSigner();
  }, [setObricSdkSigner]);

  const fetchTokenBalances = useCallback(async () => {
    try {
      if (obricSDK) {
        const timeOut = setTimeout(() => {
          timeOutArray.push(true);
          setTimeOutCount(timeOutArray.length);
        }, 5000);
        const balances = await obricSDK.getTokensBalance();
        clearTimeout(timeOut);
        if (balances) {
          setUserPoolLpAmount(balances.userPoolLp);
          setTokenBalances(balances.userTokenBalances);
        } else {
          setUserPoolLpAmount({});
          setTokenBalances({});
        }
      } else {
        setUserPoolLpAmount({});
        setTokenBalances({});
      }
    } catch (e) {
      console.log(e);
    }
  }, [obricSDK, timeOutArray]);

  const reloadObricSdk = useCallback(async () => {
    try {
      if (obricSDK) {
        setRefreshingSdk(true);
        const timeOut = setTimeout(() => {
          timeOutArray.push(true);
          setTimeOutCount(timeOutArray.length);
        }, 5000);
        const { tokens, pools } = await obricSDK.reload();
        clearTimeout(timeOut);
        setTokenList(tokens);
        const bitusd = tokens.find((token) => token.symbol === 'bitusd');
        setBitusdToken(bitusd);
        setSymbolToToken(obricSDK.coinList.symbolToToken);
        setLiquidityPools(pools);
      } else {
        console.log('clear tokenlist');
        setLiquidityPools([]);
        setTokenList([]);
        setSymbolToToken({});
        setBitusdToken(undefined);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshingSdk(false);
    }
  }, [obricSDK, timeOutArray]);

  useEffect(() => {
    if (shouldRefreshSdk) {
      reloadObricSdk();
      setShouldRefreshSdk(false);
    }
  }, [shouldRefreshSdk, reloadObricSdk]);

  useEffect(() => {
    if (shouldRefreshUserMessage && !refreshingSdk) {
      fetchTokenBalances();
      setShouldRefreshUserMessage(false);
    }
  }, [shouldRefreshUserMessage, refreshingSdk, fetchTokenBalances]);

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
        if (!(await checkNetwork())) {
          return;
        }
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
            success = true;
          } else if (result.status === 0) {
            openTxErrorNotification(
              result.hash,
              `Failed to swap ${quote.inAmt} ${fromToken.symbol} to ${toToken.symbol}`
            );
            success = false;
          }
        } catch (e) {
          checkTransactionError(e);
          success = false;
        } finally {
          setPendingTx(false);
          setShouldRefreshSdk(true);
          setShouldRefreshUserMessage(true);
        }
      } else {
        success = false;
      }
      return success;
    },
    [obricSDK, checkApprove, wallet, checkTransactionError, checkNetwork]
  );

  const requestAddLiquidity = useCallback(
    async (pool, xAmount, yAmount) => {
      let success = false;
      try {
        if (!wallet) throw new Error('Please connect wallet first');
        if (obricSDK) {
          if (!(await checkNetwork())) {
            return;
          }
          setPendingTx(true);
          if (
            (await checkApprove(pool.xToken, pool.poolAddress, xAmount)) &&
            (await checkApprove(pool.yToken, pool.poolAddress, yAmount * 1.0001))
          ) {
            const result = await pool.depositV1(xAmount, yAmount);
            if (result.status === 1) {
              openTxSuccessNotification(
                result.hash,
                `Deposit success`
              );
              success = true;
            } else if (result.status === 0) {
              openTxErrorNotification(
                result.hash,
                `Failed to deposit to ${pool.token0.symbol}-${pool.token1.symbol} pool`
              );
              success = false;
            }
          } else {
            success = false;
          }
        }
      } catch (error) {
        checkTransactionError(error);
        success = false;
      } finally {
        setPendingTx(false);
        setShouldRefreshSdk(true);
        setShouldRefreshUserMessage(true);
        return success;
      }
    },
    [obricSDK, checkApprove, wallet, checkTransactionError, checkNetwork]
  );

  const requestWithdrawLiquidity = useCallback(
    async (pool: IPool, amt: string) => {
      let success = false;
      try {
        if (!wallet) throw new Error('Please connect wallet first');
        if (obricSDK) {
          if (!(await checkNetwork())) {
            return;
          }
          setPendingTx(true);
          const result = await pool.withdrawV1(amt);
          if (result.status === 1) {
            openTxSuccessNotification(
              result.hash,
              `Withdraw success from ${amt} lp ${pool.token0.symbol}-${pool.token1.symbol}`
            );
            success = true;
          } else if (result.status === 0) {
            openTxErrorNotification(
              result.hash,
              `Failed to withdraw from ${pool.token0.symbol}-${pool.token1.symbol}`
            );
            success = false;
          }
        } else {
          success = false;
        }
      } catch (error) {
        checkTransactionError(error);
        success = false;
      } finally {
        setPendingTx(false);
        setShouldRefreshSdk(true);
        setShouldRefreshUserMessage(true);
        return success;
      }
    },
    [obricSDK, wallet, checkTransactionError, checkNetwork]
  );

  const requestCreatePair = useCallback(
    async (
      tokenInfo: CreateTokenInfo,
      mintAmount: number,
      addLiquidityAmount: number,
      bitusdAddLiquidityAmount: number,
      protocolFeeShareThousandth: number,
      feeMillionth: number,
      protocolFeeAddress: string,
      addTokenListFee: string
    ) => {
      let success = true;
      try {
        if (!wallet) throw new Error('Please connect wallet first');
        if (obricSDK && tokenList) {
          if (!(await checkNetwork())) {
            return;
          }
          if (
            bitusdToken &&
            (await checkApprove(
              bitusdToken,
              obricSDK.config.tradingPairV1Creator,
              bitusdAddLiquidityAmount
            ))
          ) {
            const {
              success: createSuccess,
              hash,
              tokenAddress,
              pairAddress
            } = await obricSDK.poolCreator.cretePair(
              tokenInfo,
              new BigNumber(mintAmount).times(10 ** tokenInfo.decimals).toFixed(0),
              new BigNumber(addLiquidityAmount).times(10 ** tokenInfo.decimals).toFixed(0),
              new BigNumber(bitusdAddLiquidityAmount).times(10 ** bitusdToken.decimals).toFixed(0),
              protocolFeeShareThousandth,
              feeMillionth,
              protocolFeeAddress,
              addTokenListFee
            );
            if (createSuccess) {
              openTxSuccessNotification(hash, 'Create token and pool success');
              success = true;
            } else {
              openTxErrorNotification(hash, 'Failed to create token and pool');
              success = false;
            }
          } else {
            success = false;
          }
        } else {
          success = false;
        }
      } catch (error) {
        console.log(error);
        checkTransactionError(error);
        success = false;
      } finally {
        setShouldRefreshSdk(true);
        setShouldRefreshUserMessage(true);
        setPendingTx(false);
        return success;
      }
    },
    [obricSDK, wallet, tokenList, checkApprove, checkTransactionError, bitusdToken, checkNetwork]
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
        createFee,
        bitusdToken,
        clearCache,
        pendingTx,
        requestSwap,
        requestAddLiquidity,
        requestWithdrawLiquidity,
        requestCreatePair
      }}>
      {children}
    </MerlinWalletContext.Provider>
  );
};

export { MerlinWalletProvider, MerlinWalletContext };
