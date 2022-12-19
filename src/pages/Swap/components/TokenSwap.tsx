/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import SwapDetail from './SwapDetail';
// import { DEX_TYPE_NAME, RouteAndQuote } from '@manahippo/hippo-sdk/dist/aggregator/types';
import { ApiError } from 'aptos';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Tooltip } from 'components/Antd';
import Button from 'components/Button';
import Card from 'components/Card';
import ObricModal from 'components/ObricModal';
import useAptosWallet from 'hooks/useAptosWallet';
import { useBreakpoint } from 'hooks/useBreakpoint';
import useTokenBalane from 'hooks/useTokenBalance';
import { CancelIcon, SettingBlackIcon, SettingWhiteIcon, SwapIcon } from 'resources/icons';
import { openErrorNotification } from 'utils/notifications';

import CurrencyInput from './CurrencyInput';
import SwapDetail from './SwapDetail';
import SwapSetting from './SwapSetting';

import { ISwapSettings } from '../types';

const TokenSwap = () => {
  const { values, setFieldValue, submitForm, isSubmitting, isValid, dirty } =
    useFormikContext<ISwapSettings>();
  const { activeWallet, openModal, obricSDK } = useAptosWallet();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const fromToken = values.currencyFrom?.token;
  const toToken = values.currencyTo?.token;
  const fromUiAmt = values.currencyFrom?.amount;
  const swapRate = values.currencyTo?.amount;
  const { isTablet } = useBreakpoint('tablet');
  const [isPeriodicRefreshPaused, setIsPeriodicRefreshPaused] = useState(false);
  const [priceImpact, setPriceImpact] = useState(0);
  const [uiBalance, isReady] = useTokenBalane(values.currencyFrom.token);
  const sufficientBalance = useMemo(() => {
    if (!activeWallet || (!uiBalance && isReady)) return false;
    return uiBalance >= fromUiAmt;
  }, [activeWallet, fromUiAmt, isReady, uiBalance]);

  useEffect(() => {
    if (obricSDK) {
      if (!values.currencyFrom?.token) {
        setFieldValue('currencyFrom.token', obricSDK.coinList.getCoinInfoBySymbol('USDC')[0]);
      }
      if (!values.currencyTo?.token) {
        setFieldValue('currencyTo.token', obricSDK.coinList.getCoinInfoBySymbol('zUSDC')[0]);
      }
    }
  }, [fromToken, obricSDK, setFieldValue, toToken, values.currencyFrom, values.currencyTo]);

  const lastFetchTs = useRef(0);

  const fetchSwapRate = useCallback(async () => {
    try {
      const now = Date.now();
      lastFetchTs.current = now;

      if (obricSDK && fromToken && toToken && fromUiAmt) {
        const [rate1Percent, rate] = await Promise.all([
          obricSDK.getQuote(fromToken.symbol, toToken.symbol, Number(fromUiAmt * 0.01)),
          obricSDK.getQuote(fromToken.symbol, toToken.symbol, Number(fromUiAmt))
        ]);
        const impact =
          ((rate1Percent.outAmt * 100 - rate.outAmt) / (rate1Percent.outAmt * 100)) * 100;
        setPriceImpact(impact);
        setFieldValue('currencyTo.amount', rate.outAmt);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        // let detail = `${error.status} : ${error.errorCode} : ${error.vmErrorCode} : ${error.message}`;
        let detail = error.message;
        const msg = JSON.parse(error.message);
        if (msg.message === 'Generic Error') {
          detail = 'Too many requests. You need to wait 60s and try again';
          setIsPeriodicRefreshPaused(true);
        }
        if (fromUiAmt) openErrorNotification({ detail, title: 'Fetch API error' });
      } else {
        openErrorNotification({
          detail: error?.message || JSON.stringify(error),
          title: 'Fetch swap routes error'
        });
      }

      setFieldValue('currencyFrom', {
        ...values.currencyFrom,
        amount: 0
      });
    }
  }, [fromToken, fromUiAmt, obricSDK, setFieldValue, toToken, values.currencyFrom]);

  useEffect(() => {
    fetchSwapRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromToken, toToken, fromUiAmt, obricSDK]);

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
    if (!activeWallet) {
      return 'Connect to Wallet';
    } else if ((!uiBalance && isReady) || !fromUiAmt) {
      return 'SWAP';
    } else if (!sufficientBalance) {
      return 'Insufficent Balance';
    } else {
      return 'SWAP';
    }
  }, [activeWallet, fromUiAmt, isReady, sufficientBalance, uiBalance]);

  const renderCardHeader = () => (
    <Fragment>
      <Tooltip title="Setting" zIndex={isTablet ? -1 : 10} openClassName="tablet:hidden">
        <button
          className="absolute top-0  right-0 z-10 cursor-pointer fill-none stroke-none py-6 px-5 tablet:py-4"
          onClick={() => setIsSettingsOpen(true)}>
          <span className="block dark:hidden">
            <SettingBlackIcon />
          </span>
          <span className="hidden dark:block">
            <SettingWhiteIcon />
          </span>
        </button>
      </Tooltip>
      <div className="relative flex w-full justify-start">
        <h5 className="text-lg font-bold leading-4 text-inherit">Swap</h5>
      </div>
    </Fragment>
  );

  return (
    <Card className="dark-stroke-white relative flex w-[512px] flex-col border-[1px] border-color_border_2 bg-color_bg_panel fill-color_text_1 stroke-none py-6 px-5 font-Rany text-color_text_1 backdrop-blur-[15px] dark:bg-color_bg_input tablet:w-full tablet:p-4 tablet:pt-5">
      {renderCardHeader()}
      <div className="mt-5 flex w-full flex-col tablet:mt-4">
        <div className="relative flex flex-col gap-[2px]">
          <div className="bg-white_gray_bg p-4 dark:bg-color_bg_row">
            <div className="mb-2 text-xs uppercase text-color_text_2">Pay</div>
            <CurrencyInput actionType="currencyFrom" />
          </div>
          <Button
            variant="icon"
            className="group absolute top-1/2 left-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-2 border-color_bg_panel bg-white_gray_bg p-0 dark:border-color_bg_table dark:bg-color_bg_row"
            onClick={onClickSwapToken}>
            <SwapIcon className="fill-color_text_2 group-hover:fill-color_text_1 tablet:fill-color_text_1" />
          </Button>
          <div className="bg-white_gray_bg p-4 dark:bg-color_bg_row">
            <div className="mb-2 text-xs uppercase text-color_text_2">RECEIVE</div>
            <CurrencyInput actionType="currencyTo" />
          </div>
        </div>
        {swapRate > 0 && fromUiAmt > 0 && fromToken && toToken && (
          <SwapDetail
            swapRateQuote={swapRate}
            impact={priceImpact}
            fromToken={fromToken}
            toToken={toToken}
            fromUiAmt={fromUiAmt}
          />
        )}
        <Button
          isLoading={isSubmitting}
          className="mt-5"
          variant="primary"
          disabled={activeWallet && (!isValid || !dirty || !sufficientBalance)}
          onClick={!activeWallet ? openModal : submitForm}>
          {buttonCaption}
        </Button>
      </div>
      <ObricModal
        onCancel={() => setIsSettingsOpen(false)}
        className=""
        // wrapClassName={styles.modal}
        open={isSettingsOpen}
        closeIcon={<CancelIcon />}
        width={424}
        // mobileHeight={556}
      >
        <SwapSetting onClose={() => setIsSettingsOpen(false)} />
      </ObricModal>
    </Card>
  );
};

export default TokenSwap;
