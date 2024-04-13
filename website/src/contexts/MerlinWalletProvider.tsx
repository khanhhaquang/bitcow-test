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
  poolsCount: number;
  tokenList: TokenInfo[];
  symbolToToken: Record<string, TokenInfo>;
  tokenBalances: Record<string, number>;
  userPoolLpAmount: Record<string, UserLpAmount>;
  initProvider: (from: 'swap' | 'pool' | 'tokens') => void;
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

  const [pendingTx, setPendingTx] = useState<boolean>(false);
  const [txOption, setTxOption] = useState<TxOption>({});

  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [symbolToToken, setSymbolToToken] = useState<Record<string, Token>>({});
  const [tokenBalances, setTokenBalances] = useState<Record<string, number>>({});
  const [liquidityPools, setLiquidityPools] = useState<IPool[]>([]);
  const [userPoolLpAmount, setUserPoolLpAmount] = useState<Record<string, UserLpAmount>>({});
  const [timeOutCount, setTimeOutCount] = useState(0);
  const [timeOutLength] = useState(150000);
  const [timeOutArray, setTimeOutArray] = useState<boolean[]>([]);
  const [createFee] = useState<bigint>(BigInt(150000000000000));
  const [bitusdToken, setBitusdToken] = useState<TokenInfo>();
  const [poolsCount, setPoolsCount] = useState(0);
  const [startInit, setStartInit] = useState(false);
  const { currentNetwork } = useNetwork();
  const clearCache = useCallback(() => {
    setLiquidityPools([]);
    setPoolsCount(0);
    setTokenList([]);
    setSymbolToToken({});
    setTokenBalances({});
    setUserPoolLpAmount({});
    setBitusdToken(undefined);
    setStartInit(false);
  }, []);

  useEffect(() => {
    clearCache();
  }, [currentNetwork, clearCache]);

  const checkNetwork = useCallback(async () => {
    return setCurrentChain(currentNetwork.chainConfig);
  }, [setCurrentChain, currentNetwork]);
  useEffect(() => {
    if (currentNetwork) {
      const provider = new ethers.JsonRpcProvider(
        currentNetwork.rpcNodeUrl,
        currentNetwork.chainConfig.chainId,
        {
          batchMaxCount: 1,
          staticNetwork: true
        }
      );
      console.log('setObricSdk');
      setObricSDK(new ObricSDK(provider as any, currentNetwork.sdkConfig, 0.4, txOption));
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

  const fetchPools = useCallback(
    async (init: boolean, firstPaginateCount: number, paginateCount: number) => {
      try {
        if (obricSDK) {
          const timeOut = setTimeout(() => {
            timeOutArray.push(true);
            setTimeOutCount(timeOutArray.length);
          }, timeOutLength);
          if (init) {
            setStartInit(true);
            await obricSDK.reload(firstPaginateCount, paginateCount, (pagePools, allCount) => {
              setLiquidityPools(pagePools);
              setPoolsCount(allCount);
            });
          } else {
            const pools = await obricSDK.reload(firstPaginateCount, paginateCount);
            setLiquidityPools(pools);
            setPoolsCount(pools.length);
          }
          clearTimeout(timeOut);
        } else {
          setLiquidityPools([]);
          setPoolsCount(0);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    [obricSDK, timeOutArray, timeOutLength]
  );

  const fetchTokenList = useCallback(
    async (init: boolean, firstPaginateCount: number, paginateCount: number) => {
      let bitusd: TokenInfo | undefined;
      try {
        if (obricSDK) {
          const timeOut = setTimeout(() => {
            timeOutArray.push(true);
            setTimeOutCount(timeOutArray.length);
          }, timeOutLength);
          if (init) {
            setStartInit(true);
            await obricSDK.coinList.reload(firstPaginateCount, paginateCount, (tokens) => {
              setTokenList(tokens);
              bitusd = tokens.find((token) => token.symbol === 'bitusd');
              setBitusdToken(bitusd);
              setSymbolToToken(obricSDK.coinList.symbolToToken);
            });
          } else {
            const tokens = await obricSDK.coinList.reload(firstPaginateCount, paginateCount);
            setTokenList(tokens);
            bitusd = tokens.find((token) => token.symbol === 'bitusd');
            setBitusdToken(bitusd);
            setSymbolToToken(obricSDK.coinList.symbolToToken);
          }

          clearTimeout(timeOut);
        } else {
          setTokenList([]);
          setSymbolToToken({});
          setBitusdToken(undefined);
        }
      } catch (e) {
        console.log(e);
      } finally {
        return bitusd;
      }
    },
    [obricSDK, timeOutArray, timeOutLength]
  );

  const fetchTokenBalances = useCallback(
    async (lpFirst: boolean) => {
      try {
        if (obricSDK) {
          setStartInit(true);
          const timeOut = setTimeout(() => {
            timeOutArray.push(true);
            setTimeOutCount(timeOutArray.length);
          }, timeOutLength);
          const balances = await obricSDK.getTokensBalance(500, lpFirst);
          if (balances) {
            setUserPoolLpAmount(balances.userPoolLp);
            setTokenBalances(balances.userTokenBalances);
          } else {
            setUserPoolLpAmount({});
            setTokenBalances({});
          }
          clearTimeout(timeOut);
        } else {
          setUserPoolLpAmount({});
          setTokenBalances({});
        }
      } catch (e) {
        console.log(e);
      }
    },
    [obricSDK, timeOutArray, timeOutLength]
  );

  const setObricSdkSigner = useCallback(async () => {
    if (!obricSDK) {
      return;
    }
    if (wallet) {
      const browserProvider = new ethers.BrowserProvider(wallet.provider as Eip1193Provider);
      const signer = await browserProvider.getSigner();
      obricSDK.setSigner(signer as any);
      fetchTokenBalances(true);
    } else {
      obricSDK.setSigner(undefined);
      fetchTokenBalances(true);
    }
  }, [obricSDK, wallet, fetchTokenBalances]);

  useEffect(() => {
    setObricSdkSigner();
  }, [setObricSdkSigner]);

  const swapPageReload = useCallback(
    async (init: boolean) => {
      if (init) {
        await fetchTokenList(true, 40, 500);
      }
      await fetchPools(init, 140, 140);
      await fetchTokenBalances(false);
    },
    [fetchTokenList, fetchPools, fetchTokenBalances]
  );

  const poolPageReload = useCallback(
    async (init: boolean) => {
      if (init) {
        await fetchPools(init, 40, 140);
      } else {
        await fetchPools(init, 140, 140);
      }
      if (init) {
        await fetchTokenList(true, 500, 500);
      }
      await fetchTokenBalances(true);
    },
    [fetchTokenList, fetchPools, fetchTokenBalances]
  );

  const tokensPageReload = useCallback(
    async (init: boolean) => {
      const bitusd = await fetchTokenList(init, 500, 500);
      if (bitusd) {
        const balances = await obricSDK.coinList.getBalances(1, [bitusd.address]);
        setTokenBalances({
          [bitusd.address]: new BigNumber(balances[bitusd.address].toString())
            .div(10 ** bitusd.decimals)
            .toNumber()
        });
      }
    },
    [fetchTokenList, obricSDK]
  );

  const initProvider = useCallback(
    (from: string) => {
      if (startInit) {
        return;
      }
      if (from === 'swap') {
        swapPageReload(true);
      } else if (from === 'pool') {
        poolPageReload(true);
      } else if (from === 'tokens') {
        tokensPageReload(true);
      }
    },
    [swapPageReload, poolPageReload, tokensPageReload, startInit]
  );

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
          openTxErrorNotification(
            currentNetwork.chainConfig.blockExplorerUrls[0],
            result.hash,
            `Fail approve to ${token.symbol}`
          );
          return false;
        } else {
          return true;
        }
      } catch (e: any) {
        checkTransactionError(e);
        return false;
      }
    },
    [obricSDK, checkTransactionError, currentNetwork]
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
              currentNetwork.chainConfig.blockExplorerUrls[0],
              result.hash,
              `Swapped ${quote.inAmt} ${fromToken.symbol} to ${toToken.symbol}`
            );
            success = true;
          } else if (result.status === 0) {
            openTxErrorNotification(
              currentNetwork.chainConfig.blockExplorerUrls[0],
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
          swapPageReload(false);
        }
      } else {
        success = false;
      }
      return success;
    },
    [
      obricSDK,
      checkApprove,
      wallet,
      checkTransactionError,
      checkNetwork,
      currentNetwork,
      swapPageReload
    ]
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
                currentNetwork.chainConfig.blockExplorerUrls[0],
                result.hash,
                'Deposit success'
              );
              success = true;
            } else if (result.status === 0) {
              openTxErrorNotification(
                currentNetwork.chainConfig.blockExplorerUrls[0],
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
        poolPageReload(false);
        return success;
      }
    },
    [
      obricSDK,
      checkApprove,
      wallet,
      checkTransactionError,
      checkNetwork,
      currentNetwork,
      poolPageReload
    ]
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
              currentNetwork.chainConfig.blockExplorerUrls[0],
              result.hash,
              `Withdraw success from ${amt} lp ${pool.token0.symbol}-${pool.token1.symbol}`
            );
            success = true;
          } else if (result.status === 0) {
            openTxErrorNotification(
              currentNetwork.chainConfig.blockExplorerUrls[0],
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
        poolPageReload(false);
        return success;
      }
    },
    [obricSDK, wallet, checkTransactionError, checkNetwork, currentNetwork, poolPageReload]
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
            const result = await obricSDK.poolCreator.cretePair(
              tokenInfo,
              new BigNumber(mintAmount).times(10 ** tokenInfo.decimals).toFixed(0),
              new BigNumber(addLiquidityAmount).times(10 ** tokenInfo.decimals).toFixed(0),
              new BigNumber(bitusdAddLiquidityAmount).times(10 ** bitusdToken.decimals).toFixed(0),
              protocolFeeShareThousandth,
              feeMillionth,
              protocolFeeAddress,
              addTokenListFee
            );
            if (result.status === 1) {
              openTxSuccessNotification(
                currentNetwork.chainConfig.blockExplorerUrls[0],
                result.hash,
                'Create token and pool success'
              );
              success = true;
            } else if (result.status === 0) {
              openTxErrorNotification(
                currentNetwork.chainConfig.blockExplorerUrls[0],
                result.hash,
                'Failed to create token and pool'
              );
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
        setPendingTx(false);
        tokensPageReload(false);
        return success;
      }
    },
    [
      obricSDK,
      wallet,
      tokenList,
      checkApprove,
      checkTransactionError,
      bitusdToken,
      checkNetwork,
      currentNetwork,
      tokensPageReload
    ]
  );

  return (
    <MerlinWalletContext.Provider
      value={{
        wallet,
        openWalletModal: openModal,
        closeWalletModal: closeModal,
        obricSDK,
        liquidityPools,
        poolsCount,
        tokenList,
        symbolToToken,
        tokenBalances,
        userPoolLpAmount,
        initProvider,
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
