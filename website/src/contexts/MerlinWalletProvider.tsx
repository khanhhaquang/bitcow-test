/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import BigNumber from 'bignumber.js';
import {
  TokenInfo,
  TokenInfo as Token,
  IPool,
  Quote,
  Sdk as BitcowSDK,
  TxOption,
  UserLpAmount,
  CreateTokenInfo
} from 'bitcow';
import { Eip1193Provider, ethers } from 'ethers';
import { createContext, FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import {
  openErrorNotification,
  openTxErrorNotification,
  openTxSuccessNotification
} from 'utils/notifications';

import { NetworkConfig } from './NetworkProvider';

import useNetwork from '../hooks/useNetwork';
import { useEvmConnectContext, Wallet } from '../wallet';
interface MerlinWalletContextType {
  wallet?: Wallet;
  openWalletModal: () => void;
  closeWalletModal: () => void;
  bitcowSDK: BitcowSDK;
  liquidityPools: IPool[];
  fetchedPoolsCount: number;
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

  const [bitcowSDK, setBitcowSDK] = useState<BitcowSDK>();

  const [pendingTx, setPendingTx] = useState<boolean>(false);
  const [txOption] = useState<TxOption>({});

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
  const [fetchedPoolsCount, setFetchedPoolsCount] = useState(0);
  const [startInit, setStartInit] = useState(false);
  const { currentNetwork } = useNetwork();
  const currentNetworkRef = useRef<NetworkConfig>();
  const clearCache = useCallback(() => {
    setLiquidityPools([]);
    setFetchedPoolsCount(0);
    setTokenList([]);
    setSymbolToToken({});
    setTokenBalances({});
    setUserPoolLpAmount({});
    setBitusdToken(undefined);
    setStartInit(false);
  }, []);

  const setTokensCache = useCallback((bitcowSDK2: BitcowSDK) => {
    if (bitcowSDK2) {
      const tokens = bitcowSDK2.coinList.tokens;
      setTokenList(tokens);
      const bitusd = tokens.find((token) => token.symbol === 'bitusd');
      setBitusdToken(bitusd);
      setSymbolToToken(bitcowSDK2.coinList.symbolToToken);
      return bitusd;
    }
  }, []);

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
      currentNetworkRef.current = currentNetwork;
      const sdk = new BitcowSDK(
        provider as any,
        currentNetwork.sdkConfig,
        currentNetwork.requestsPerSecond,
        txOption,
        undefined,
        (message, optionalParams) => {
          // console.log(currentNetwork.chainConfig.chainName, message, optionalParams);
        }
      );
      clearCache();
      setBitcowSDK(sdk);
      setLiquidityPools(sdk.pools);
      setTokensCache(sdk);
    }
  }, [currentNetwork, txOption, setTokensCache, clearCache]);

  const checkNetwork = useCallback(async () => {
    return setCurrentChain(currentNetworkRef.current.chainConfig);
  }, [setCurrentChain]);

  useEffect(() => {
    if (timeOutCount >= 2) {
      openErrorNotification({
        detail: `The ${currentNetworkRef.current.chainConfig.chainName} is currently unstable. We recommend switching to a different testnet for testing.`
      });
      setTimeOutArray([]);
      setTimeOutCount(0);
    }
  }, [timeOutCount]);

  useEffect(() => {
    if (bitcowSDK) {
      bitcowSDK.setTxOption(txOption);
    }
  }, [txOption, bitcowSDK]);

  const fetchPools = useCallback(async () => {
    try {
      if (bitcowSDK) {
        setStartInit(true);
        const timeOut = setTimeout(() => {
          timeOutArray.push(true);
          setTimeOutCount(timeOutArray.length);
        }, timeOutLength);
        const pools = await bitcowSDK.reload(
          currentNetworkRef.current.poolsFirstPaginateCount,
          currentNetworkRef.current.poolsPaginateCount
        );
        if (currentNetworkRef.current.chainConfig.chainId === bitcowSDK.config.chainId) {
          setLiquidityPools(pools);
          setFetchedPoolsCount(pools.length);
        }
        clearTimeout(timeOut);
      } else {
        setLiquidityPools([]);
        setFetchedPoolsCount(0);
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  }, [bitcowSDK, timeOutArray, timeOutLength]);

  const fetchTokenList = useCallback(async () => {
    let bitusd: TokenInfo | undefined;
    try {
      if (bitcowSDK) {
        setStartInit(true);
        const timeOut = setTimeout(() => {
          timeOutArray.push(true);
          setTimeOutCount(timeOutArray.length);
        }, timeOutLength);
        await bitcowSDK.coinList.reload(
          currentNetworkRef.current.tokensFirstPaginateCount,
          currentNetworkRef.current.tokensPaginateCount
        );
        if (currentNetworkRef.current.chainConfig.chainId === bitcowSDK.config.chainId) {
          bitusd = setTokensCache(bitcowSDK);
        }
        clearTimeout(timeOut);
      }
    } catch (e) {
      console.log(e);
    } finally {
      return bitusd;
    }
  }, [bitcowSDK, timeOutArray, timeOutLength, setTokensCache]);

  const fetchTokenBalances = useCallback(
    async (lpFirst: boolean) => {
      try {
        if (bitcowSDK) {
          const timeOut = setTimeout(() => {
            timeOutArray.push(true);
            setTimeOutCount(timeOutArray.length);
          }, timeOutLength);
          const balances = await bitcowSDK.getTokensBalance(
            currentNetworkRef.current.balancePaginateCount,
            lpFirst
          );
          if (balances) {
            setUserPoolLpAmount(balances.userPoolLp);
            setTokenBalances(balances.userTokenBalances);
          } else {
            setUserPoolLpAmount({});
            setTokenBalances({});
          }
          clearTimeout(timeOut);
        }
      } catch (e) {
        console.log(e);
      }
    },
    [bitcowSDK, timeOutArray, timeOutLength]
  );

  const setBitcowSdkSigner = useCallback(async () => {
    if (!bitcowSDK) {
      return;
    }
    if (wallet) {
      if (wallet.chainId === bitcowSDK.config.chainId) {
        const browserProvider = new ethers.BrowserProvider(wallet.provider as Eip1193Provider);
        const signer = await browserProvider.getSigner();
        bitcowSDK.setSigner(signer as any, wallet.accounts[0].evm);
        fetchTokenBalances(true);
      } else {
        setTokenBalances({});
        setUserPoolLpAmount({});
      }
    } else {
      bitcowSDK.setSigner(undefined, undefined);
      fetchTokenBalances(true);
    }
  }, [bitcowSDK, wallet, fetchTokenBalances]);

  useEffect(() => {
    setBitcowSdkSigner();
  }, [setBitcowSdkSigner]);

  const swapPageReload = useCallback(
    async (init: boolean) => {
      if (init) {
        await fetchTokenList();
      }
      await fetchPools();
      await fetchTokenBalances(false);
    },
    [fetchTokenList, fetchPools, fetchTokenBalances]
  );

  const poolPageReload = useCallback(
    async (init: boolean) => {
      await fetchPools();
      if (init) {
        await fetchTokenList();
      }
      await fetchTokenBalances(true);
    },
    [fetchTokenList, fetchPools, fetchTokenBalances]
  );

  const tokensPageReload = useCallback(
    async (init: boolean) => {
      const bitusd = await fetchTokenList();
      if (bitusd) {
        const balances = await bitcowSDK.coinList.getBalances(1, [bitusd.address]);
        setTokenBalances({
          [bitusd.address]: new BigNumber(balances[bitusd.address].toString())
            .div(10 ** bitusd.decimals)
            .toNumber()
        });
      }
    },
    [fetchTokenList, bitcowSDK]
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
    console.log(e);
    openErrorNotification({ detail: e.message });
  }, []);

  const checkApprove = useCallback(
    async (token: TokenInfo, spender: string, minAmount: number) => {
      // todo
      try {
        const result = await bitcowSDK.coinList.approve(token, spender, minAmount);
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
    [bitcowSDK, checkTransactionError, currentNetwork]
  );
  const requestSwap = useCallback(
    async (quote, minOutputAmt) => {
      let success = false;
      if (!wallet) throw new Error('Please connect wallet first');
      const fromToken = quote.inputToken;
      const toToken = quote.outputToken;
      // todo check transaction result detail
      if (bitcowSDK) {
        if (!(await checkNetwork())) {
          return;
        }
        setPendingTx(true);
        if (!(await checkApprove(fromToken, bitcowSDK.swapRouter, quote.inAmt))) {
          setPendingTx(false);
          success = false;
          return success;
        }
        try {
          const result = await bitcowSDK.swap(quote, minOutputAmt);
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
      bitcowSDK,
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
        if (bitcowSDK) {
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
      } catch (error: any) {
        if (error.action === 'estimateGas' && error.code === 'CALL_EXCEPTION') {
          openErrorNotification({
            detail: `Pool balance has changed. To provide ${xAmount} ${pool.xToken.symbol} token, you will need more than ${yAmount} ${pool.yToken.symbol} token. You may refresh the page to get updated pool balance`
          });
        } else {
          checkTransactionError(error);
        }
        success = false;
      } finally {
        setPendingTx(false);
        poolPageReload(false);
        return success;
      }
    },
    [
      bitcowSDK,
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
        if (bitcowSDK) {
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
    [bitcowSDK, wallet, checkTransactionError, checkNetwork, currentNetwork, poolPageReload]
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
        if (bitcowSDK && tokenList) {
          if (!(await checkNetwork())) {
            return;
          }
          if (
            bitusdToken &&
            (await checkApprove(
              bitusdToken,
              bitcowSDK.config.tradingPairV1Creator,
              bitusdAddLiquidityAmount
            ))
          ) {
            const result = await bitcowSDK.poolCreator.cretePair(
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
      bitcowSDK,
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
        bitcowSDK: bitcowSDK,
        liquidityPools,
        fetchedPoolsCount,
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
