/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useFormikContext } from 'formik';
import { ISwapSettings } from 'pages/Swap/types';
import { CancelIcon, CaretIcon } from 'resources/icons';
import cx from 'classnames';
import styles from './CurrencyInput.module.scss';
import CoinSelector from './CoinSelector';
import { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import CoinIcon from 'components/CoinIcon';
// import { Popover } from 'antd';
import useTokenBalane from 'hooks/useTokenBalance';
import { useSelector } from 'react-redux';
import { getTokenList } from 'modules/swap/reducer';
import classNames from 'classnames';
import PositiveFloatNumInput from 'components/PositiveFloatNumInput';
import useDebouncedCallback from 'hooks/useDebouncedCallback';
import HippoModal from 'components/HippoModal';
import CoinSelectButton from './CoinSelectButton';
import useAptosWallet from 'hooks/useAptosWallet';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import useTokenAmountFormatter from 'hooks/useTokenAmountFormatter';

interface TProps {
  actionType: 'currencyTo' | 'currencyFrom';
  isDisableAmountInput?: boolean;
}

const CurrencyInput: React.FC<TProps> = ({ actionType, isDisableAmountInput = false }) => {
  const { tokenList } = useAptosWallet();
  const { values, setFieldValue } = useFormikContext<ISwapSettings>();
  const [isCoinSelectorVisible, setIsCoinSelectorVisible] = useState(false);
  const [tokenAmountFormatter] = useTokenAmountFormatter();

  const selectedCurrency = values[actionType];
  const selectedToken = selectedCurrency?.token;
  const [uiBalance, isReady] = useTokenBalane(selectedToken);
  const isCoinSelectorDisabled = !tokenList || tokenList.length === 0;

  const inputRef = useRef<HTMLInputElement>(null);

  console.log('>>>>>>check', isReady, uiBalance);
  // The debounce delay should be bigger than the average of key input intervals
  const onAmountChange = useDebouncedCallback(
    useCallback(
      (a: number) => {
        console.log(`Currency input num: ${a}`);
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
      <CoinSelectButton
        onClick={() => setIsCoinSelectorVisible(true)}
        token={selectedCurrency?.token}
        isDisabled={isCoinSelectorDisabled}
      />
      <div
        className={cx(
          // styles.currencyInput,
          'flex justify-between font-Rany text-gray_03'
        )}>
        <PositiveFloatNumInput
          ref={inputRef}
          min={0}
          max={1e11}
          maxDecimals={values[actionType]?.token?.decimals || 9}
          isDisabled={actionType === 'currencyTo' || isDisableAmountInput}
          placeholder="0.00"
          className="bg-transparent text-3xl pr-0 pl-1 w-2/3 text-white"
          inputAmount={selectedCurrency?.amount || 0}
          onAmountChange={onAmountChange}
        />
        {isReady && (
          <small className="text-sm text-gray_05 flex items-end">
            Balance:
            <span
              className={classNames('ml-1', {
                'cursor-pointer pointer-events-auto underline':
                  actionType === 'currencyFrom' && !isDisableAmountInput
              })}
              onClick={() => {
                if (actionType === 'currencyFrom' && !isDisableAmountInput) {
                  setFieldValue(actionType, {
                    ...selectedCurrency,
                    amount: uiBalance
                  });
                }
              }}>
              {tokenAmountFormatter(uiBalance, selectedToken)}
            </span>
          </small>
        )}
      </div>
      <HippoModal
        onCancel={() => setIsCoinSelectorVisible(false)}
        className=""
        wrapClassName={styles.modal}
        open={isCoinSelectorVisible}
        footer={null}
        closeIcon={<CancelIcon className="opacity-30 hover:opacity-100" />}>
        <CoinSelector
          actionType={actionType}
          dismissiModal={() => setIsCoinSelectorVisible(!isCoinSelectorVisible)}
        />
      </HippoModal>
    </div>
  );
};

export default CurrencyInput;
