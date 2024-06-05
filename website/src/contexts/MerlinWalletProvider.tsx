/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import BigNumber from 'bignumber.js';
import { Eip1193Provider, ethers } from 'ethers';
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { axiosSetupInterceptors } from 'config/axios';
import { UserService } from 'services/user';
import { ITxnLucky, LuckyDrawService } from 'services/luckyDraw';
import openNotification, {
  openErrorNotification,
  openTxErrorNotification,
  openTxSuccessNotification
} from 'utils/notifications';

import useNetwork from '../hooks/useNetwork';
import {
  TokenInfo,
  Token,
  IPool,
  Quote,
  Sdk as BitcowSDK,
  TxOption,
  CreateTokenInfo,
  isBTC
} from '../sdk';
import { NetworkConfig } from '../types/bitcow';
import { getLocalPairMessages } from '../utils/localPools';
import { useEvmConnectContext, Wallet } from '../wallet';
import { authToken, generateAuthToken, parseAuthToken } from 'utils/storage';

interface MerlinWalletContextType {
  wallet?: Wallet;
  walletAddress: string;
  openWalletModal: () => void;
  closeWalletModal: () => void;
  bitcowSDK?: BitcowSDK;
  createBitcowSDK: () => void;
  liquidityPools: IPool[];
  fetchedPoolsCount: number;
  tokenList: TokenInfo[];
  symbolToToken: Record<string, TokenInfo>;
  setNeedBalanceTokens: (tokens: string[]) => void;
  tokenBalances: Record<string, bigint>;
  initProvider: (from: 'swap' | 'pool' | 'tokens') => void;
  createFee: bigint;
  bitusdToken: TokenInfo;
  clearCache: () => void;
  pendingTx: boolean;
  checkTransactionError: (e) => void;
  requestSwap: (
    quote: Quote,
    minOutputAmt: number,
    onSuccessCallback?: (luckyTxn: ITxnLucky) => void
  ) => Promise<boolean>;
  requestAddLiquidity: (pool: IPool, xAmount: number, yAmount: number) => Promise<boolean>;
  requestWithdrawLiquidity: (pool: IPool, amt: string) => Promise<boolean>;
  requestCreatePairWithManager: (
    xTokenInfo: TokenInfo,
    yTokenInfo: TokenInfo,
    xTokenLiquidity: number,
    yTokenLiquidity: number,
    xPrice: number,
    yPrice: number
  ) => Promise<boolean>;
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
  isLoggedIn: boolean;
}

interface TProviderProps {
  children: ReactNode;
}

const MerlinWalletContext = createContext<MerlinWalletContextType>({} as MerlinWalletContextType);

const MerlinWalletProvider: FC<TProviderProps> = ({ children }) => {
  const { wallet, openModal, closeModal, setCurrentChain } = useEvmConnectContext();
  const [bitcowSDK, setBitcowSDK] = useState<BitcowSDK | undefined>();

  const [pendingTx, setPendingTx] = useState<boolean>(false);
  const [txOption] = useState<TxOption>({
    // gasPrice: 100000000
    // maxPriorityFeePerGas: 100000000
  } as TxOption);

  const [tokenList, setTokenList] = useState<TokenInfo[]>();
  const [symbolToToken, setSymbolToToken] = useState<Record<string, TokenInfo>>(undefined);
  const [needBalanceTokens, setNeedBalanceTokens] = useState<string[]>();
  const [tokenBalances, setTokenBalances] = useState<Record<string, bigint>>(undefined);
  const tokenBalancesRef = useRef<Record<string, bigint>>(undefined);
  const [liquidityPools, setLiquidityPools] = useState<IPool[]>();

  const [timeOutCount, setTimeOutCount] = useState(0);
  const [timeOutLength] = useState(150000);
  const [timeOutArray, setTimeOutArray] = useState<boolean[]>([]);
  const [createFee] = useState<bigint>(BigInt(150000000000000));
  const [bitusdToken, setBitusdToken] = useState<TokenInfo>();
  const [fetchedPoolsCount, setFetchedPoolsCount] = useState(0);
  const [startInit, setStartInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { currentNetwork } = useNetwork();
  const currentNetworkRef = useRef<NetworkConfig>();

  const walletAddress = useMemo(() => wallet?.accounts?.[0]?.evm || '', [wallet?.accounts]);

  const setTokenBalancesCache = useCallback((tokenBalancesInner: Record<string, bigint>) => {
    if (!currentNetworkRef.current.fetchAllTokenBalance && tokenBalancesInner === undefined) {
      tokenBalancesRef.current = {};
      setTokenBalances(tokenBalancesRef.current);
    } else {
      setTokenBalances(tokenBalancesInner);
      tokenBalancesRef.current = tokenBalancesInner;
    }
  }, []);

  const clearCache = useCallback(() => {
    setLiquidityPools(undefined);
    setFetchedPoolsCount(0);
    setTokenList(undefined);
    setSymbolToToken(undefined);
    setTokenBalancesCache(undefined);

    setBitusdToken(undefined);
    setStartInit(false);
  }, [setTokenBalancesCache]);

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

  const createBitcowSDK = useCallback(() => {
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
        getLocalPairMessages(currentNetwork.chainConfig.chainId),
        txOption,
        undefined,
        (message) => {
          // console.log(message);
        }
      );
      clearCache();
      if (!currentNetwork.fetchAllTokenBalance) {
        setTokenBalancesCache({});
      }
      setBitcowSDK(sdk);
      setLiquidityPools(sdk.pools);
      setTokensCache(sdk);
    }
  }, [currentNetwork, txOption, setTokensCache, clearCache, setTokenBalancesCache]);

  useEffect(() => {
    createBitcowSDK();
  }, [createBitcowSDK]);

  const checkNetwork = useCallback(async () => {
    return setCurrentChain(currentNetworkRef.current.chainConfig);
  }, [setCurrentChain]);

  useEffect(() => {
    if (timeOutCount >= 2) {
      // openErrorNotification({
      //   detail: `The ${currentNetworkRef.current.chainConfig.chainName} is currently unstable. We recommend switching to a different testnet for testing.`
      // });
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
        setLiquidityPools(undefined);
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
    async (lpFirst: boolean, from = 'init') => {
      try {
        if (bitcowSDK) {
          const timeOut = setTimeout(() => {
            timeOutArray.push(true);
            setTimeOutCount(timeOutArray.length);
          }, timeOutLength);
          if (currentNetworkRef.current.fetchAllTokenBalance) {
            const balances = await bitcowSDK.getTokensBalance(
              currentNetworkRef.current.balancePaginateCount,
              lpFirst
            );
            if (balances) {
              setTokenBalancesCache(balances);
            } else {
              setTokenBalancesCache(undefined);
            }
          } else {
            if (bitcowSDK.signer) {
              if (needBalanceTokens?.length) {
                const balances = await bitcowSDK.coinList.getBalances(
                  needBalanceTokens.length,
                  needBalanceTokens
                );
                setNeedBalanceTokens([]);
                setTokenBalancesCache({ ...tokenBalancesRef.current, ...balances });
              }
            } else {
              setTokenBalancesCache(undefined);
            }
          }
          clearTimeout(timeOut);
        }
      } catch (e) {
        console.log(e);
      }
    },
    [bitcowSDK, timeOutArray, timeOutLength, setTokenBalancesCache, needBalanceTokens]
  );

  const handleSigning = useCallback(async () => {
    try {
      const browserProvider = new ethers.BrowserProvider(wallet.provider as Eip1193Provider);
      const signer = await browserProvider.getSigner();
      bitcowSDK.setSigner(signer as any, wallet.accounts[0].evm);
      fetchTokenBalances(true, 'set signer');

      const {
        token: cachedToken,
        address: cachedAddress,
        chain: cachedChain
      } = parseAuthToken(authToken.get());

      if (
        !cachedToken ||
        cachedAddress !== wallet.accounts[0].evm ||
        cachedChain !== wallet.chainId
      ) {
        const newSignature = await signer.signMessage('hello play bitcow');
        const loginResult = await UserService.login.call(wallet.accounts[0].evm, newSignature);
        if (loginResult?.code === 0) {
          authToken.set(
            generateAuthToken(loginResult.data.token, wallet.accounts[0].evm, wallet.chainId)
          );
          setIsLoggedIn(true);
          openNotification({ type: 'success', detail: 'You have logged in' });
        } else {
          authToken.clear();
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(true);
      }
    } catch (error) {
      authToken.clear();
      setIsLoggedIn(false);
      openNotification({ type: 'error', detail: 'Logging failed' });
    }
  }, [wallet, bitcowSDK]);

  const setBitcowSdkSigner = useCallback(async () => {
    setIsLoggedIn(false);
    if (!bitcowSDK) {
      return;
    }
    if (wallet) {
      if (wallet.chainId === bitcowSDK.config.chainId) {
        if (wallet.accounts[0].evm != bitcowSDK.getAddress()) {
          handleSigning();
        }
      } else {
        setTokenBalancesCache(undefined);
      }
    } else {
      bitcowSDK.setSigner(undefined, undefined);
      fetchTokenBalances(true);
    }
  }, [bitcowSDK, wallet, fetchTokenBalances]);

  useEffect(() => {
    setBitcowSdkSigner();
    axiosSetupInterceptors(() => handleSigning());
  }, [setBitcowSdkSigner]);

  useEffect(() => {
    if (currentNetworkRef.current && !currentNetworkRef.current.fetchAllTokenBalance) {
      fetchTokenBalances(true);
    }
  }, [fetchTokenBalances]);

  const swapPageReload = useCallback(
    async (init: boolean) => {
      if (init) {
        await fetchTokenList();
      }
      await fetchPools();
      if (currentNetworkRef.current.fetchAllTokenBalance) {
        await fetchTokenBalances(false);
      }
    },
    [fetchTokenList, fetchPools, fetchTokenBalances]
  );

  const poolPageReload = useCallback(
    async (init: boolean) => {
      await fetchPools();
      if (init) {
        await fetchTokenList();
      }
      if (currentNetworkRef.current.fetchAllTokenBalance) {
        await fetchTokenBalances(true);
      }
    },
    [fetchTokenList, fetchPools, fetchTokenBalances]
  );

  const tokensPageReload = useCallback(
    async (init: boolean) => {
      const bitusd = await fetchTokenList();
      if (bitusd) {
        const balances = await bitcowSDK.coinList.getBalances(1, [bitusd.address]);
        setTokenBalancesCache({
          [bitusd.address]: balances[bitusd.address]
        });
      }
    },
    [fetchTokenList, bitcowSDK, setTokenBalancesCache]
  );

  const initProvider = useCallback(
    (from: string) => {
      if (currentNetworkRef.current === undefined) {
        return;
      }
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
    console.log('Txn error: ', e);
    if (
      e.message?.includes('missing revert data') ||
      e.message?.includes('execution reverted (unknown custom error)')
    ) {
      openErrorNotification({
        detail: 'You may want to try to refresh page or increase your gas fee. '
      });
      return;
    }
    openErrorNotification({ detail: e.message });
  }, []);

  const checkApprove = useCallback(
    async (token: TokenInfo | Token, spender: string, minAmount: number) => {
      // todo
      try {
        if (isBTC(token as TokenInfo)) {
          return true;
        }
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
    async (quote, minOutputAmt, onSuccessCallback) => {
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
            LuckyDrawService.getTxnLucky
              .call(result.hash)
              .then((resp) => {
                if (resp.code === 0 && resp.data.isLucky) {
                  onSuccessCallback?.(resp.data);
                }
              })
              .catch((e) => {
                console.log('Check Lucky chance:', e);
              });
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
          if (e.reason === 'Output amount less than min output amount') {
            openErrorNotification({
              detail:
                'Pool has changed, refreshing for you, please try again after receive amount is updated'
            });
          } else {
            checkTransactionError(e);
          }

          success = false;
        } finally {
          setPendingTx(false);
          swapPageReload(false);
          if (!currentNetworkRef.current.fetchAllTokenBalance) {
            setNeedBalanceTokens([fromToken.address, toToken.address]);
          }
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
    async (pool: IPool, xAmount, yAmount) => {
      let success = false;
      try {
        if (!wallet) throw new Error('Please connect wallet first');
        if (bitcowSDK) {
          if (!(await checkNetwork())) {
            return;
          }
          setPendingTx(true);
          if (
            (await checkApprove(pool.token0, pool.poolAddress, xAmount)) &&
            (await checkApprove(pool.token1, pool.poolAddress, yAmount * 1.0001))
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
            detail: `Pool balance has changed. To provide ${xAmount} ${pool.token0.symbol} token, you will need more than ${yAmount} ${pool.token1.symbol} token. You may refresh the page to get updated pool balance`
          });
        } else {
          checkTransactionError(error);
        }
        success = false;
      } finally {
        setPendingTx(false);
        poolPageReload(false);
        if (!currentNetworkRef.current.fetchAllTokenBalance) {
          setNeedBalanceTokens([pool.token0.address, pool.token1.address]);
        }

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
        if (!currentNetworkRef.current.fetchAllTokenBalance) {
          setNeedBalanceTokens([pool.token0.address, pool.token1.address]);
        }

        return success;
      }
    },
    [bitcowSDK, wallet, checkTransactionError, checkNetwork, currentNetwork, poolPageReload]
  );

  const requestCreatePairWithManager = useCallback(
    async (
      xTokenInfo: TokenInfo,
      yTokenInfo: TokenInfo,
      xTokenLiquidity: number,
      yTokenLiquidity: number,
      xPrice: number,
      yPrice: number
    ) => {
      let success = true;
      try {
        if (!wallet) throw new Error('Please connect wallet first');
        if (bitcowSDK && bitcowSDK.pairV1Manager) {
          if (!(await checkNetwork())) {
            return;
          }
          if (
            (await checkApprove(xTokenInfo, bitcowSDK.config.pairV1Manager, xTokenLiquidity)) &&
            (await checkApprove(yTokenInfo, bitcowSDK.config.pairV1Manager, yTokenLiquidity))
          ) {
            const result = await bitcowSDK.pairV1Manager.createPair(
              xTokenInfo,
              yTokenInfo,
              xTokenLiquidity,
              yTokenLiquidity,
              300,
              3000,
              xPrice,
              yPrice
            );
            if (result.status === 1) {
              openTxSuccessNotification(
                currentNetwork.chainConfig.blockExplorerUrls[0],
                result.hash,
                'Create pool success'
              );
              success = true;
            } else if (result.status === 0) {
              openTxErrorNotification(
                currentNetwork.chainConfig.blockExplorerUrls[0],
                result.hash,
                'Failed to create pool'
              );
              success = false;
            }
          } else {
            success = false;
          }
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
      checkApprove,
      checkNetwork,
      checkTransactionError,
      currentNetwork,
      tokensPageReload,
      wallet
    ]
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
        walletAddress,
        isLoggedIn,
        openWalletModal: openModal,
        closeWalletModal: closeModal,
        bitcowSDK,
        createBitcowSDK,
        liquidityPools,
        fetchedPoolsCount,
        setNeedBalanceTokens,
        tokenList,
        symbolToToken,
        tokenBalances,
        initProvider,
        createFee,
        bitusdToken,
        clearCache,
        pendingTx,
        requestSwap,
        requestAddLiquidity,
        requestWithdrawLiquidity,
        requestCreatePairWithManager,
        requestCreatePair,
        checkTransactionError
      }}>
      {children}
    </MerlinWalletContext.Provider>
  );
};

export { MerlinWalletProvider, MerlinWalletContext };
