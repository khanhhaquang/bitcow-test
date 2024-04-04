import { useFormikContext } from 'formik';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Tooltip } from 'components/Antd';
import Button from 'components/Button';
import Card from 'components/Card';
import ObricModal from 'components/ObricModal';
import PixelButton from 'components/PixelButton';
import PixelDivider from 'components/PixelDivider';
import { useBreakpoint } from 'hooks/useBreakpoint';
import useMerlinWallet from 'hooks/useMerlinWallet';
import useTokenBalance from 'hooks/useTokenBalance';
import { SettingsIcon } from 'resources/icons';
import { ReactComponent as CoinSwapIcon } from 'resources/icons/coinSwap.svg';
import { ReactComponent as PiexlCloseIcon } from 'resources/icons/pixelClose.svg';
import { openErrorNotification } from 'utils/notifications';

import CurrencyInput from './CurrencyInput';
import SwapDetail from './SwapDetail';
import SwapSetting from './SwapSetting';

import { ISwapSettings } from '../types';

const TokenSwap = () => {
  const { values, setFieldValue, submitForm, isSubmitting, isValid, dirty } =
    useFormikContext<ISwapSettings>();
  const { wallet, openWalletModal, obricSDK, symbolToToken } = useMerlinWallet();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const fromToken = values.currencyFrom?.token;
  const toToken = values.currencyTo?.token;
  const fromUiAmt = values.currencyFrom?.amount;
  const swapRate = values.currencyTo?.amount;
  const { isTablet } = useBreakpoint('tablet');
  const [priceImpact, setPriceImpact] = useState(0);
  const [uiBalance, isReady] = useTokenBalance(values.currencyFrom.token);
  const sufficientBalance = useMemo(() => {
    if (!wallet || (!uiBalance && isReady)) return false;
    return uiBalance >= fromUiAmt;
  }, [wallet, fromUiAmt, isReady, uiBalance]);

  useEffect(() => {
    if (symbolToToken) {
      setFieldValue('currencyFrom.token', symbolToToken.wBTC);
      setFieldValue('currencyTo.token', symbolToToken.bitusd);
    }
  }, [symbolToToken, setFieldValue]);

  const lastFetchTs = useRef(0);

  const fetchSwapRate = useCallback(() => {
    try {
      const now = Date.now();
      lastFetchTs.current = now;

      if (obricSDK && fromToken && toToken && fromUiAmt) {
        const rate = obricSDK.getQuote(fromToken, toToken, Number(fromUiAmt));
        if (rate) {
          setFieldValue('quote', rate);
          setFieldValue('currencyTo.amount', rate.outAmt);
          const rate1Percent = obricSDK.getQuote(fromToken, toToken, Number(fromUiAmt * 0.01));
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
      openErrorNotification({
        detail: error?.message || JSON.stringify(error),
        title: 'Fetch swap routes error'
      });

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
    if (!wallet) {
      return 'Connect Wallet';
    } else if ((!uiBalance && isReady) || !fromUiAmt) {
      return 'SWAP';
    } else if (!sufficientBalance) {
      return 'Insufficent Balance';
    } else {
      return 'SWAP';
    }
  }, [wallet, fromUiAmt, isReady, sufficientBalance, uiBalance]);

  const renderCardHeader = () => (
    <Fragment>
      <div className="relative flex w-full items-center text-bc-white">
        <div className="leading-0 mr-auto text-[36px]">Swap</div>
        <Tooltip title="Setting" zIndex={isTablet ? -1 : 10} openClassName="tablet:hidden">
          <button className="" onClick={() => setIsSettingsOpen(true)}>
            <SettingsIcon />
          </button>
        </Tooltip>
      </div>
    </Fragment>
  );

  return (
    <Card className="dark-stroke-white relative flex w-[512px] flex-col bg-bc-swap bg-cover bg-no-repeat fill-color_text_1 stroke-none py-6 px-5 text-color_text_1 shadow-bc-swap backdrop-blur-[15px] dark:bg-color_bg_input tablet:w-full tablet:p-4 tablet:pt-5">
      {renderCardHeader()}
      <div className="mt-5 flex w-full flex-col tablet:mt-4">
        <div className="relative flex flex-col">
          <div className="relative border-t-2 border-l-2 border-r-2 border-bc-orange bg-bc-grey-transparent p-4">
            <div className="mb-2 text-xs uppercase text-bc-white-60">Pay</div>
            <CurrencyInput actionType="currencyFrom" />
            <PixelDivider
              className="absolute left-[-1px] bottom-0 right-[-1px] translate-y-1/2"
              color="var(--bitcow-color-text-orange)"
            />
          </div>
          <Button
            variant="icon"
            className="group absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-transparent p-0"
            onClick={onClickSwapToken}>
            <CoinSwapIcon />
          </Button>
          <div className="border-b-2 border-l-2 border-r-2 border-bc-orange bg-bc-grey-transparent p-4">
            <div className="mb-2 text-xs uppercase text-bc-white-60">RECEIVE</div>
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
        <div className="flex justify-center">
          <PixelButton
            isLoading={isSubmitting}
            width={206}
            height={48}
            borderWidth={4}
            className="mt-5 bg-bc-white-10 uppercase"
            disabled={wallet && (!isValid || !dirty || !sufficientBalance)}
            onClick={!wallet ? openWalletModal : submitForm}>
            {buttonCaption}
          </PixelButton>
        </div>
      </div>
      <ObricModal
        onCancel={() => setIsSettingsOpen(false)}
        className=""
        // wrapClassName={styles.modal}
        open={isSettingsOpen}
        closeIcon={<PiexlCloseIcon className="top-[24px]" />}
        width={424}
        bodyStyle={{ padding: 0 }}
        // mobileHeight={556}
      >
        <SwapSetting onClose={() => setIsSettingsOpen(false)} />
      </ObricModal>
    </Card>
  );
};

export default TokenSwap;
