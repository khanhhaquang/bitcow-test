/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Button from 'components/Button';
import { useFormikContext } from 'formik';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
// import { ArrowRight, MoreArrowDown, SwapIcon } from 'resources/icons';
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
import Tooltip from 'components/Tooltip';

const TokenSwap = () => {
  const { values, setFieldValue, submitForm, isSubmitting } = useFormikContext<ISwapSettings>();
  const { activeWallet, openModal } = useAptosWallet();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // const { hippoAgg } = useHippoClient();
  const fromSymbol = values.currencyFrom?.token?.symbol || 'USDC';
  const toSymbol = values.currencyTo?.token?.symbol || 'BTC';
  const fromUiAmt = values.currencyFrom?.amount;
  // const [allRoutes, setAllRoutes] = useState<RouteAndQuote[]>([]);
  // const [routeSelected, setRouteSelected] = useState<RouteAndQuote | null>(null);

  // useEffect(() => {
  //   if (hippoAgg) {
  //     if (!values.currencyFrom?.token) {
  //       setFieldValue(
  //         'currencyFrom.token',
  //         hippoAgg.registryClient.getTokenInfoBySymbol(fromSymbol)[0]
  //       );
  //     }
  //     if (!values.currencyTo?.token) {
  //       setFieldValue(
  //         'currencyTo.token',
  //         hippoAgg.registryClient.getTokenInfoBySymbol(toSymbol)[0]
  //       );
  //     }
  //   }
  // }, [
  //   fromSymbol,
  //   hippoAgg,
  //   hippoAgg?.registryClient,
  //   setFieldValue,
  //   toSymbol,
  //   values.currencyFrom,
  //   values.currencyTo
  // ]);

  const latestInputParams = useRef({
    fromSymbol,
    toSymbol,
    fromUiAmt
  });
  latestInputParams.current = {
    fromSymbol,
    toSymbol,
    fromUiAmt
  };

  const ifInputParametersDifferentWithLatest = useCallback(
    (fromSymbolLocal: string, toSymbolLocal: string, fromUiAmtLocal: number) => {
      return !(
        fromSymbolLocal === latestInputParams.current.fromSymbol &&
        toSymbolLocal === latestInputParams.current.toSymbol &&
        fromUiAmtLocal === latestInputParams.current.fromUiAmt
      );
    },
    []
  );

  const lastFetchTs = useRef(0);

  // const fetchSwapRoutes = useCallback(async () => {
  //   try {
  //     if (process.env.NODE_ENV !== 'production') {
  //       if (lastFetchTs.current !== 0) {
  //         console.log(`Swap fetch route interval: ${Date.now() - lastFetchTs.current}`);
  //       }
  //       lastFetchTs.current = Date.now();
  //     }
  //     if (hippoAgg && fromSymbol && toSymbol && fromUiAmt) {
  //       const [xToken] = hippoAgg.registryClient.getTokenInfoBySymbol(fromSymbol);
  //       const [yToken] = hippoAgg.registryClient.getTokenInfoBySymbol(toSymbol);

  //       const routes = await hippoAgg.getQuotes(fromUiAmt, xToken, yToken);
  //       if (routes.length === 0) {
  //         throw new Error(
  //           `No quotes from ${fromSymbol} to ${toSymbol} with input amount ${fromUiAmt}`
  //         );
  //       }

  //       if (!ifInputParametersDifferentWithLatest(fromSymbol, toSymbol, fromUiAmt)) {
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
  //   fromSymbol,
  //   toSymbol,
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
        {/* {allRoutes.length > 0 && routeSelected && (
          <RoutesAvailable
            className="mt-4"
            routes={allRoutes}
            routeSelected={routeSelected}
            onRouteSelected={(ro) => setRouteSelected(ro)}
          />
        )} */}
        <Button
          isLoading={isSubmitting}
          className="mt-5 w-full bg-button_gradient text-black font-Furore text-lg disabled:bg-color_bg_3 rounded-none"
          // disabled={activeWallet && (!isValid || !dirty)}
          onClick={!activeWallet ? openModal : submitForm}>
          {!activeWallet ? 'Connect to Wallet' : 'SWAP'}
        </Button>
        {/* {routeSelected && fromSymbol && toSymbol && (
          <SwapDetail routeAndQuote={routeSelected} fromSymbol={fromSymbol} toSymbol={toSymbol} />
        )} */}
      </div>
      <HippoModal
        onCancel={() => setIsSettingsOpen(false)}
        className=""
        // wrapClassName={styles.modal}
        open={isSettingsOpen}
        footer={null}
        closeIcon={<CancelIcon />}
        width={424}>
        <SwapSetting onClose={() => setIsSettingsOpen(false)} />
      </HippoModal>
    </Card>
  );
};

export default TokenSwap;
