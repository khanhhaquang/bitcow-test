/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import cx from 'classnames';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { useCallback, useEffect, useRef, useState } from 'react';

import BitcowModal from 'components/BitcowModal';
import PositiveFloatNumInput from 'components/PositiveFloatNumInput';
import useDebouncedCallback from 'hooks/useDebouncedCallback';
import useMerlinWallet from 'hooks/useMerlinWallet';
import usePools from 'hooks/usePools';
import useTokenAmountFormatter from 'hooks/useTokenAmountFormatter';
import useTokenBalance from 'hooks/useTokenBalance';
import { ISwapSettings } from 'pages/Swap/types';
import { ReactComponent as PixelCloseIcon } from 'resources/icons/pixelClose.svg';

import CoinSelectButton from './CoinSelectButton';
import CoinSelector from './CoinSelector';
import styles from './CurrencyInput.module.scss';

// import { Popover } from 'antd';

interface TProps {
  actionType: 'currencyTo' | 'currencyFrom';
  isDisableAmountInput?: boolean;
}

const CurrencyInput: React.FC<TProps> = ({ actionType, isDisableAmountInput = false }) => {
  const { tokenList } = useMerlinWallet();
  const { getTokenBalanceInUSD } = usePools();
  const { values, setFieldValue } = useFormikContext<ISwapSettings>();
  const [isCoinSelectorVisible, setIsCoinSelectorVisible] = useState(false);
  const [tokenAmountFormatter] = useTokenAmountFormatter();

  const selectedCurrency = values[actionType];
  const selectedToken = selectedCurrency?.token;
  const [uiBalance, isReady] = useTokenBalance(selectedToken);
  const isCoinSelectorDisabled = !tokenList || tokenList.length === 0;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionType === 'currencyFrom' && isReady && uiBalance) {
      setFieldValue('currencyFrom.balance', uiBalance);
    }
  }, [actionType, isReady, setFieldValue, uiBalance]);

  // The debounce delay should be bigger than the average of key input intervals
  const onAmountChange = useDebouncedCallback(
    useCallback(
      (a: number) => {
        setFieldValue(actionType, {
          ...selectedCurrency,
          amount: a
        });
      },
      [actionType, selectedCurrency, setFieldValue]
    ),
    200
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full justify-between">
        <CoinSelectButton
          onClick={() => setIsCoinSelectorVisible(true)}
          token={selectedCurrency?.token}
          isDisabled={isCoinSelectorDisabled}
        />
        <PositiveFloatNumInput
          ref={inputRef}
          min={0}
          max={1e11}
          maxDecimals={values[actionType]?.token?.decimals || 9}
          isDisabled={actionType === 'currencyTo' || isDisableAmountInput}
          placeholder="0.00"
          className="w-2/3 bg-transparent pr-0 pl-1 text-right text-3xl font-bold text-bc-white placeholder:text-bc-white-60"
          inputAmount={selectedCurrency?.amount || 0}
          onAmountChange={onAmountChange}
        />
      </div>
      <div
        className={cx(
          // styles.currencyInput,
          'flex justify-between  text-color_text_3'
        )}>
        <small className="flex items-end text-sm text-bc-white-60">
          Balance:
          <span
            className={classNames('ml-1', {
              'pointer-events-auto cursor-pointer text-bc-white-60 underline':
                actionType === 'currencyFrom' && !isDisableAmountInput && isReady
            })}
            onClick={() => {
              if (actionType === 'currencyFrom' && !isDisableAmountInput && isReady) {
                setFieldValue(actionType, {
                  ...selectedCurrency,
                  amount: uiBalance
                });
              }
            }}>
            {isReady ? tokenAmountFormatter(uiBalance, selectedToken) : 0}
          </span>
        </small>
        <small className="text-sm text-bc-white-60">
          ~${getTokenBalanceInUSD(uiBalance, selectedToken)}
        </small>
      </div>
      <BitcowModal
        onCancel={() => setIsCoinSelectorVisible(false)}
        className=""
        wrapClassName={styles.modal}
        open={isCoinSelectorVisible}
        bodyStyle={{ padding: 0 }}
        closeIcon={<PixelCloseIcon className="relative top-[24px]" />}>
        <CoinSelector
          actionType={actionType}
          dismissiModal={() => setIsCoinSelectorVisible(!isCoinSelectorVisible)}
        />
      </BitcowModal>
    </div>
  );
};

export default CurrencyInput;
