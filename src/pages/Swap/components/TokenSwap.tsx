/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Button from 'components/Button';
import { useFormikContext } from 'formik';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { ISwapSettings } from '../types';
import CurrencyInput from './CurrencyInput';
// import SwapDetail from './SwapDetail';
// import useHippoClient from 'hooks/useHippoClient';
import useAptosWallet from 'hooks/useAptosWallet';
// import { DEX_TYPE_NAME, RouteAndQuote } from '@manahippo/hippo-sdk/dist/aggregator/types';
import classNames from 'classnames';
import Card from 'components/Card';
import { CancelIcon, SettingIcon, SwapIcon } from 'resources/icons';
import HippoModal from 'components/HippoModal';
import CoinSelector from './CurrencyInput/CoinSelector';
import SwapSetting from './SwapSetting';
import { ApiError } from 'aptos';
import { openErrorNotification } from 'utils/notifications';
import { Tooltip } from 'components/Antd';
import SwapDetail from './SwapDetail';

const TokenSwap = () => {
  const { values, setFieldValue, submitForm, isSubmitting } = useFormikContext<ISwapSettings>();
  const { activeWallet, openModal, obricSDK } = useAptosWallet();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const fromToken = values.currencyFrom?.token;
  const toToken = values.currencyTo?.token;
  const fromUiAmt = values.currencyFrom?.amount;
  const [isPeriodicRefreshPaused, setIsPeriodicRefreshPaused] = useState(false);
  // const [allRoutes, setAllRoutes] = useState<RouteAndQuote[]>([]);
  // const [routeSelected, setRouteSelected] = useState<RouteAndQuote | null>(null);

  console.log('swap form values>>>', values);
  useEffect(() => {
    if (obricSDK) {
      if (!values.currencyFrom?.token) {
        setFieldValue('currencyFrom.token', obricSDK.coinList.getCoinInfoBySymbol('USDC')[0]);
      }
      if (!values.currencyTo?.token) {
        setFieldValue('currencyTo.token', obricSDK.coinList.getCoinInfoBySymbol('APT')[0]);
      }
    }
  }, [fromToken, obricSDK, setFieldValue, toToken, values.currencyFrom, values.currencyTo]);

  const lastFetchTs = useRef(0);

  const fetchSwapRoute = useCallback(async () => {
    try {
      const now = Date.now();
      lastFetchTs.current = now;

      if (obricSDK && fromToken && toToken && fromUiAmt) {
        console.log('swapRoute>>>', fromToken, toToken, fromUiAmt);
        const route = await obricSDK.getQuote(fromToken.symbol, toToken.symbol, Number(fromUiAmt));
        console.log('swapRoute22222>>>', route);
      }
    } catch (error) {
      console.log('Fetch swap routes:', error);
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
    fetchSwapRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromToken, toToken, fromUiAmt, obricSDK]);

  // const fetchSwapRoutes = useCallback(async () => {
  //   try {
  //     if (process.env.NODE_ENV !== 'production') {
  //       if (lastFetchTs.current !== 0) {
  //         console.log(`Swap fetch route interval: ${Date.now() - lastFetchTs.current}`);
  //       }
  //       lastFetchTs.current = Date.now();
  //     }
  //     if (hippoAgg && fromToken && toToken && fromUiAmt) {
  //       const [xToken] = hippoAgg.registryClient.getTokenInfoBySymbol(fromToken);
  //       const [yToken] = hippoAgg.registryClient.getTokenInfoBySymbol(toToken);

  //       const routes = await hippoAgg.getQuotes(fromUiAmt, xToken, yToken);
  //       if (routes.length === 0) {
  //         throw new Error(
  //           `No quotes from ${fromToken} to ${toToken} with input amount ${fromUiAmt}`
  //         );
  //       }

  //       if (!ifInputParametersDifferentWithLatest(fromToken, toToken, fromUiAmt)) {
  //         setAllRoutes(routes);
  //         setRouteSelected(routes[0]);
  //       }
  //     } else {
  //       setAllRoutes([]);
  //       setRouteSelected(null);
  //     }
  //   } catch (error) {
  //     console.log('Fetch swap routes:', error);
  //     if (error instanceof Error) {
  //       message.error(error?.message);
  //     }

  //     setFieldValue('currencyFrom', {
  //       ...values.currencyFrom,
  //       amount: 0
  //     });
  //   }
  // }, [
  //   hippoAgg,
  //   fromToken,
  //   toToken,
  //   fromUiAmt,
  //   ifInputParametersDifferentWithLatest,
  //   setFieldValue,
  //   values.currencyFrom
  // ]);

  // useEffect(() => {
  //   fetchSwapRoutes();
  // }, [fetchSwapRoutes]);

  // useEffect(() => {
  //   setFieldValue('currencyTo', {
  //     ...values.currencyTo,
  //     amount: routeSelected?.quote.outputUiAmt || ''
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [routeSelected, setFieldValue]);

  // useEffect(() => {
  //   setFieldValue('currencyTo', {
  //     ...values.currencyTo,
  //     amount: routeSelected?.quote.outputUiAmt || ''
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [routeSelected, setFieldValue]);

  const onClickSwapToken = useCallback(() => {
    const tokenFrom = values.currencyFrom;
    const tokenTo = values.currencyTo;
    setFieldValue('currencyFrom', tokenTo);
    setFieldValue('currencyTo', tokenFrom);
  }, [values, setFieldValue]);

  const renderCardHeader = () => (
    <Fragment>
      <Tooltip title="Setting">
        <button
          className="absolute py-6 px-5 top-0 right-0 cursor-pointer z-10"
          onClick={() => setIsSettingsOpen(true)}>
          <SettingIcon />
        </button>
      </Tooltip>
      <div className="w-full flex justify-start relative">
        <h5 className="font-bold text-white text-base">Swap</h5>
      </div>
    </Fragment>
  );

  return (
    <Card className="relative w-[432px] min-h-[442px] py-6 px-5 flex flex-col bg-color_bg_3 text-white font-Rany">
      {renderCardHeader()}
      <div className="w-full flex flex-col mt-5">
        <div className="flex flex-col gap-1 relative">
          <div className="bg-color_bg_2 p-4">
            <div className="text-xs mb-2 text-gray_05 uppercase">Pay</div>
            <CurrencyInput actionType="currencyFrom" />
          </div>
          <Button
            variant="icon"
            className="bg-color_bg_3 group rounded-full w-8 h-8 p-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            onClick={onClickSwapToken}>
            <SwapIcon className="fill-white opacity-30 group-hover:opacity-100" />
          </Button>
          <div className="bg-color_bg_2 p-4">
            <div className="text-xs mb-2 text-gray_05 uppercase">RECEIVE</div>
            <CurrencyInput actionType="currencyTo" />
          </div>
        </div>
        {fromToken && toToken && (
          <SwapDetail routeAndQuote={1} fromToken={fromToken} toToken={toToken} />
        )}
        <Button
          isLoading={isSubmitting}
          className="mt-5 w-full bg-button_gradient text-black font-Furore text-lg disabled:bg-color_bg_3 rounded-none"
          // disabled={activeWallet && (!isValid || !dirty)}
          onClick={!activeWallet ? openModal : submitForm}>
          {!activeWallet ? 'Connect to Wallet' : 'SWAP'}
        </Button>
      </div>
      <HippoModal
        onCancel={() => setIsSettingsOpen(false)}
        className=""
        // wrapClassName={styles.modal}
        open={isSettingsOpen}
        footer={null}
        closeIcon={<CancelIcon className="opacity-30 hover:opacity-100" />}
        width={424}>
        <SwapSetting onClose={() => setIsSettingsOpen(false)} />
      </HippoModal>
    </Card>
  );
};

export default TokenSwap;
