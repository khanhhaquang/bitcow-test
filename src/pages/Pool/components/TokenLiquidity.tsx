import { RawCoinInfo } from '@manahippo/coin-list';
import cx from 'classnames';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { useCallback } from 'react';

// import { Popover } from 'antd';
import Button from 'components/Button';
import CoinIcon from 'components/CoinIcon';
import PositiveFloatNumInput from 'components/PositiveFloatNumInput';
import useDebouncedCallback from 'hooks/useDebouncedCallback';
import useTokenAmountFormatter from 'hooks/useTokenAmountFormatter';
import useTokenBalane from 'hooks/useTokenBalance';
import { ISwapSettings } from 'pages/Swap/types';

interface TProps {
  token: RawCoinInfo;
  type: 'xAmt' | 'yAmt';
  isDisableAmountInput?: boolean;
}

const TokenLiquidity: React.FC<TProps> = ({ token, type }) => {
  const { values, setFieldValue } = useFormikContext<ISwapSettings>();
  const [tokenAmountFormatter] = useTokenAmountFormatter();

  const [uiBalance, isReady] = useTokenBalane(token);

  // The debounce delay should be bigger than the average of key input intervals
  const onAmountChange = useDebouncedCallback(
    useCallback(
      (a: number) => {
        setFieldValue(type, a);
      },
      [setFieldValue, type]
    ),
    200
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <div className="flex gap-2">
          <CoinIcon symbol={token.symbol} size={20} />
          <div className="">{token.symbol}</div>
        </div>
        <div className="flex gap-2 border-l-[1px] border-gray_03 pl-2">
          <Button
            className="h-5 w-[31px] rounded-none bg-[#272B30] p-1 text-xs text-gray_05 opacity-30 hover:opacity-100"
            onClick={() => {
              setFieldValue(type, uiBalance * 0.5);
            }}>
            Half
          </Button>
          <Button
            className="h-5 w-[31px] rounded-none bg-[#272B30] p-1 text-xs text-gray_05 opacity-30 hover:opacity-100"
            onClick={() => {
              setFieldValue(type, uiBalance);
            }}>
            Max
          </Button>
        </div>
      </div>
      <div
        className={cx(
          // styles.TokenLiquidity,
          'flex justify-between font-Rany text-gray_03'
        )}>
        <PositiveFloatNumInput
          min={0}
          max={1e11}
          maxDecimals={token?.decimals || 9}
          // isDisabled={actionType === 'currencyTo' || isDisableAmountInput}
          placeholder="0.00"
          className="w-2/3 bg-transparent pr-0 pl-1 text-3xl text-white"
          inputAmount={values[type] || 0}
          onAmountChange={onAmountChange}
        />
        {isReady && (
          <small className="flex items-end text-sm text-gray_05">
            Balance:
            <span className={classNames('ml-1')}>{tokenAmountFormatter(uiBalance, token)}</span>
          </small>
        )}
      </div>
    </div>
  );
};

export default TokenLiquidity;
