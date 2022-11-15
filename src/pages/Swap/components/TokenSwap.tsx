/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import SwapDetail from './SwapDetail';
// import useHippoClient from 'hooks/useHippoClient';
// import { DEX_TYPE_NAME, RouteAndQuote } from '@manahippo/hippo-sdk/dist/aggregator/types';
import { ApiError } from 'aptos';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

import { Tooltip } from 'components/Antd';
import Button from 'components/Button';
import Card from 'components/Card';
import HippoModal from 'components/HippoModal';
import useAptosWallet from 'hooks/useAptosWallet';
import { CancelIcon, SettingIcon, SwapIcon } from 'resources/icons';
import { openErrorNotification } from 'utils/notifications';

import CurrencyInput from './CurrencyInput';
import CoinSelector from './CurrencyInput/CoinSelector';
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
  const [isPeriodicRefreshPaused, setIsPeriodicRefreshPaused] = useState(false);
  const [priceImpact, setPriceImpact] = useState(0);

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
        const impact = ((rate1Percent * 100 - rate) / (rate1Percent * 100)) * 100;
        setPriceImpact(impact);
        setFieldValue('currencyTo.amount', rate);
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

  const renderCardHeader = () => (
    <Fragment>
      <Tooltip title="Setting">
        <button
          className="absolute top-0 right-0 z-10 cursor-pointer py-6 px-5"
          onClick={() => setIsSettingsOpen(true)}>
          <SettingIcon />
        </button>
      </Tooltip>
      <div className="relative flex w-full justify-start">
        <h5 className="text-base font-bold text-white">Swap</h5>
      </div>
    </Fragment>
  );

  return (
    <Card className="relative flex w-[512px] flex-col bg-color_bg_3 py-6 px-5 font-Rany text-white">
      {renderCardHeader()}
      <div className="mt-5 flex w-full flex-col">
        <div className="relative flex flex-col gap-[2px]">
          <div className="bg-color_bg_2 p-4">
            <div className="mb-2 text-xs uppercase text-gray_05">Pay</div>
            <CurrencyInput actionType="currencyFrom" />
          </div>
          <Button
            variant="icon"
            className="group absolute top-1/2 left-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-2 border-color_bg_3 bg-[#101010] p-0"
            onClick={onClickSwapToken}>
            <SwapIcon className="fill-white opacity-30 group-hover:opacity-100" />
          </Button>
          <div className="bg-color_bg_2 p-4">
            <div className="mb-2 text-xs uppercase text-gray_05">RECEIVE</div>
            <CurrencyInput actionType="currencyTo" />
          </div>
        </div>
        {swapRate > 0 && fromToken && toToken && (
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
          className="mt-5 w-full rounded-none bg-color_main font-Furore text-lg text-white hover:opacity-90 disabled:bg-[#505050]"
          disabled={activeWallet && (!isValid || !dirty)}
          onClick={!activeWallet ? openModal : submitForm}>
          {!activeWallet ? 'Connect to Wallet' : 'SWAP'}
        </Button>
      </div>
      <HippoModal
        onCancel={() => setIsSettingsOpen(false)}
        className=""
        // wrapClassName={styles.modal}
        open={isSettingsOpen}
        closeIcon={<CancelIcon />}
        width={424}
        // mobileHeight={556}
      >
        <SwapSetting onClose={() => setIsSettingsOpen(false)} />
      </HippoModal>
    </Card>
  );
};

export default TokenSwap;
