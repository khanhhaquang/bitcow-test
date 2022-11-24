/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import cx from 'classnames';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { getTokenList } from 'modules/swap/reducer';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import CoinIcon from 'components/CoinIcon';
import ObricModal from 'components/ObricModal';
import PositiveFloatNumInput from 'components/PositiveFloatNumInput';
import useAptosWallet from 'hooks/useAptosWallet';
import useDebouncedCallback from 'hooks/useDebouncedCallback';
import usePools from 'hooks/usePools';
import useTokenAmountFormatter from 'hooks/useTokenAmountFormatter';
import useTokenBalane from 'hooks/useTokenBalance';
import { ISwapSettings } from 'pages/Swap/types';
import { CancelIcon, CaretIcon } from 'resources/icons';

import CoinSelectButton from './CoinSelectButton';
import CoinSelector from './CoinSelector';
import styles from './CurrencyInput.module.scss';

// import { Popover } from 'antd';

interface TProps {
  actionType: 'currencyTo' | 'currencyFrom';
  isDisableAmountInput?: boolean;
}

const CurrencyInput: React.FC<TProps> = ({ actionType, isDisableAmountInput = false }) => {
  const { tokenList } = useAptosWallet();
  const { getTokenBalanceInUSD } = usePools();
  const { values, setFieldValue } = useFormikContext<ISwapSettings>();
  const [isCoinSelectorVisible, setIsCoinSelectorVisible] = useState(false);
  const [tokenAmountFormatter] = useTokenAmountFormatter();

  const selectedCurrency = values[actionType];
  const selectedToken = selectedCurrency?.token;
  const [uiBalance, isReady] = useTokenBalane(selectedToken);
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
          className="w-2/3 bg-transparent pr-0 pl-1 text-right text-3xl font-bold text-color_text_3"
          inputAmount={selectedCurrency?.amount || 0}
          onAmountChange={onAmountChange}
        />
      </div>
      <div
        className={cx(
          // styles.currencyInput,
          'flex justify-between font-Rany text-color_text_3'
        )}>
        <small className="flex items-end text-sm text-color_text_2">
          Balance:
          <span
            className={classNames('ml-1', {
              'pointer-events-auto cursor-pointer underline':
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
        <small className="text-sm text-color_text_2">
          ~${getTokenBalanceInUSD(uiBalance, selectedToken)}
        </small>
      </div>
      <ObricModal
        onCancel={() => setIsCoinSelectorVisible(false)}
        className=""
        wrapClassName={styles.modal}
        open={isCoinSelectorVisible}
        closeIcon={<CancelIcon />}>
        <CoinSelector
          actionType={actionType}
          dismissiModal={() => setIsCoinSelectorVisible(!isCoinSelectorVisible)}
        />
      </ObricModal>
    </div>
  );
};

export default CurrencyInput;
