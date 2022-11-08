/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useFormikContext } from 'formik';
import { ISwapSettings } from 'pages/Swap/types';
import { CancelIcon, CaretIcon } from 'resources/icons';
import cx from 'classnames';
import styles from './CurrencyInput.module.scss';
import CoinSelector from './CoinSelector';
import { Fragment, useCallback, useMemo, useState } from 'react';
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

interface TProps {
  actionType: 'currencyTo' | 'currencyFrom';
}

const CurrencyInput: React.FC<TProps> = ({ actionType }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { tokenList } = useAptosWallet();
  const { values, setFieldValue } = useFormikContext<ISwapSettings>();
  const [isCoinSelectorVisible, setIsCoinSelectorVisible] = useState(false);

  const selectedCurrency = values[actionType];
  const selectedSymbol = selectedCurrency?.token;
  const [uiBalance] = useTokenBalane(selectedSymbol);
  // const tokenList = useSelector(getTokenList);
  const isCoinSelectorDisabled = !tokenList || tokenList.length === 0;

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
        onClick={() => setIsVisible(true)}
        token={selectedCurrency?.token}
        isDisabled={isCoinSelectorDisabled}
      />
      <div
        className={cx(
          // styles.currencyInput,
          'flex justify-between font-Rany text-gray_03'
        )}>
        <PositiveFloatNumInput
          min={0}
          max={1e11}
          maxDecimals={values[actionType]?.token?.decimals || 9}
          isDisabled={actionType === 'currencyTo'}
          placeholder="0.00"
          className="bg-transparent text-3xl pr-0 pl-1 w-2/3 text-white"
          inputAmount={selectedCurrency?.amount || 0}
          onAmountChange={onAmountChange}
        />
        {typeof uiBalance === 'number' && (
          <small className="text-sm text-gray_05 flex items-end">Balance : {uiBalance}</small>
        )}
      </div>
      <HippoModal
        onCancel={() => setIsVisible(false)}
        className=""
        wrapClassName={styles.modal}
        open={isVisible}
        footer={null}
        closeIcon={<CancelIcon />}>
        <CoinSelector actionType={actionType} dismissiModal={() => setIsVisible(!isVisible)} />
      </HippoModal>
    </div>
  );
};

export default CurrencyInput;
