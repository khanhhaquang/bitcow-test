import { useFormikContext } from 'formik';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Tooltip } from 'components/Antd';
import BitcowModal from 'components/BitcowModal';
import Button from 'components/Button';
import Card from 'components/Card';
import PixelButton from 'components/PixelButton';
import { useBreakpoint } from 'hooks/useBreakpoint';
import useMerlinWallet from 'hooks/useMerlinWallet';
import useTokenBalance from 'hooks/useTokenBalance';
import { SettingsIcon } from 'resources/icons';
import { ReactComponent as CoinSwapIcon } from 'resources/icons/coinSwap.svg';
import { ReactComponent as CloseIcon } from 'resources/icons/pixelClose.svg';
import { openErrorNotification } from 'utils/notifications';

import CurrencyInput from './CurrencyInput';
import SwapDetail from './SwapDetail';
import SwapSetting from './SwapSetting';

import useNetwork from 'hooks/useNetwork';
import { ISwapSettings } from '../types';

const TokenSwap = () => {
  const { values, setFieldValue, submitForm, isSubmitting, isValid, dirty } =
    useFormikContext<ISwapSettings>();
  const {
    wallet,
    openWalletModal,
    bitcowSDK,
    setNeedBalanceTokens,
    symbolToToken,
    liquidityPools
  } = useMerlinWallet();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const fromToken = values.currencyFrom?.token;
  const toToken = values.currencyTo?.token;
  const fromUiAmt = values.currencyFrom?.amount;
  const swapRate = values.currencyTo?.amount;
  const { isTablet } = useBreakpoint('tablet');
  const [priceImpact, setPriceImpact] = useState(0);
  const [uiBalance, isReady] = useTokenBalance(values.currencyFrom.token);
  const { currentNetwork } = useNetwork();

  const sufficientBalance = useMemo(() => {
    if (!wallet || (!uiBalance && isReady)) return false;
    return uiBalance >= fromUiAmt;
  }, [wallet, fromUiAmt, isReady, uiBalance]);

  useEffect(() => {
    if (symbolToToken) {
      const needFetchTokens: string[] = [];
      if (
        fromToken === undefined ||
        bitcowSDK.coinList.getTokenByAddress(fromToken.address) === undefined
      ) {
        setFieldValue('currencyFrom.token', symbolToToken.wBTC);
        if (symbolToToken.wBTC) {
          needFetchTokens.push(symbolToToken.wBTC.address);
        }
      }
      if (
        toToken === undefined ||
        bitcowSDK.coinList.getTokenByAddress(toToken.address) === undefined
      ) {
        setFieldValue('currencyTo.token', symbolToToken.bitusd);
        if (symbolToToken.bitusd) {
          needFetchTokens.push(symbolToToken.bitusd.address);
        }
      }
      if (!currentNetwork.fetchAllTokenBalance && needFetchTokens.length > 0) {
        setNeedBalanceTokens(needFetchTokens);
      }
    }
  }, [
    currentNetwork,
    symbolToToken,
    setFieldValue,
    bitcowSDK,
    fromToken,
    toToken,
    setNeedBalanceTokens
  ]);

  const lastFetchTs = useRef(0);

  const fetchSwapRate = useCallback(() => {
    try {
      const now = Date.now();
      lastFetchTs.current = now;

      if (bitcowSDK && fromToken && toToken && fromUiAmt && liquidityPools.length > 0) {
        const rate = bitcowSDK.getQuote(fromToken, toToken, Number(fromUiAmt));
        if (rate) {
          setFieldValue('quote', rate);
          setFieldValue('currencyTo.amount', rate.outAmt);
          const rate1Percent = bitcowSDK.getQuote(fromToken, toToken, Number(fromUiAmt * 0.01));
          if (rate1Percent) {
            const impact =
              ((rate1Percent.outAmt * 100 - rate.outAmt) / (rate1Percent.outAmt * 100)) * 100;
            setPriceImpact(impact);
          } else {
            setPriceImpact(undefined);
          }
        }
      } else {
        setPriceImpact(undefined);
        setFieldValue('quote', undefined);
        setFieldValue('currencyTo.amount', undefined);
      }
    } catch (error) {
      console.log(error);
      openErrorNotification({
        detail: error?.message || JSON.stringify(error),
        title: 'Fetch swap routes error'
      });

      setFieldValue('currencyFrom', {
        ...values.currencyFrom,
        amount: 0
      });
    }
  }, [
    fromToken,
    fromUiAmt,
    bitcowSDK,
    setFieldValue,
    toToken,
    values.currencyFrom,
    liquidityPools
  ]);

  useEffect(() => {
    fetchSwapRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromToken, toToken, fromUiAmt, bitcowSDK, liquidityPools]);

  const onClickSwapToken = useCallback(() => {
    const tokenFrom = values.currencyFrom;
    const tokenTo = values.currencyTo;
    setFieldValue('currencyFrom', {
      ...tokenTo,
      amount: 0
    });
    setFieldValue('currencyTo', {
      ...tokenFrom,
      amount: 0
    });
  }, [values, setFieldValue]);

  const buttonCaption = useMemo(() => {
    if (!wallet) {
      return 'Connect Wallet';
    } else if ((!uiBalance && isReady) || !fromUiAmt) {
      return 'SWAP';
    } else if (!sufficientBalance) {
      return 'Insufficient Balance';
    } else {
      return 'SWAP';
    }
  }, [wallet, fromUiAmt, isReady, sufficientBalance, uiBalance]);

  const renderCardHeader = () => (
    <Fragment>
      <div className="relative flex w-full items-center">
        <h2 className="mr-auto font-micro text-4xl text-white">Swap</h2>
        <Tooltip title="Setting" zIndex={isTablet ? -1 : 10} openClassName="tablet:hidden">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="h-9 w-9 bg-transparent p-0.5 text-white hover:bg-white/10 active:bg-white/10 active:text-black/20">
            <SettingsIcon width={34} height={34} />
          </button>
        </Tooltip>
      </div>
    </Fragment>
  );

  return (
    <Card className="dark-stroke-white table:w-full relative flex w-[500px] flex-col gap-y-9 bg-bc-swap bg-cover bg-no-repeat fill-color_text_1 stroke-none p-9 text-color_text_1 shadow-bc-swap backdrop-blur-[15px] dark:bg-color_bg_input tablet:w-full tablet:p-4 tablet:pt-5">
      {renderCardHeader()}
      <div className="flex w-full flex-col font-pg">
        <div className="relative flex flex-col">
          <div className="relative">
            <div className="mb-2 font-pg text-lg text-white/60">Pay</div>
            <CurrencyInput actionType="currencyFrom" />
          </div>
          <div className="relative my-1.5 flex w-full items-center justify-between">
            <span className="h-[1.5px] flex-1 bg-white/20" />
            <div className="px-3">
              <Button
                variant="icon"
                className="bg-transparent hover:opacity-90 active:opacity-50"
                onClick={onClickSwapToken}>
                <CoinSwapIcon />
              </Button>
            </div>
            <span className="h-[1.5px] flex-1 bg-white/20" />
          </div>
          <div className="relative">
            <div className="mb-2 font-pg text-lg text-white/60">Receive</div>
            <CurrencyInput actionType="currencyTo" />
          </div>
        </div>
        {fromToken && toToken && (
          <SwapDetail
            swapRateQuote={swapRate}
            impact={priceImpact}
            fromToken={fromToken}
            toToken={toToken}
            fromUiAmt={fromUiAmt}
          />
        )}
      </div>
      <div className="flex justify-center">
        <PixelButton
          isLoading={isSubmitting}
          width={280}
          height={46}
          className="text-2xl uppercase"
          disabled={wallet && (!isValid || !dirty || !sufficientBalance)}
          onClick={!wallet ? openWalletModal : submitForm}>
          {buttonCaption}
        </PixelButton>
      </div>
      <BitcowModal
        onCancel={() => setIsSettingsOpen(false)}
        open={isSettingsOpen}
        closeIcon={<CloseIcon className="top-4" />}
        width={352}
        bodyStyle={{ padding: 0 }}>
        <SwapSetting onClose={() => setIsSettingsOpen(false)} />
      </BitcowModal>
    </Card>
  );
};

export default TokenSwap;
