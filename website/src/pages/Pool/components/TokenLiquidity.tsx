import BigNumber from 'bignumber.js';
import cx from 'classnames';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { TokenInfo, BN, IPool } from 'obric-merlin';
import { useCallback, useEffect } from 'react';

// import { Popover } from 'antd';
import Button from 'components/Button';
import CoinIcon from 'components/CoinIcon';
import PositiveFloatNumInput from 'components/PositiveFloatNumInput';
import useDebouncedCallback from 'hooks/useDebouncedCallback';
import usePools from 'hooks/usePools';
import useTokenAmountFormatter from 'hooks/useTokenAmountFormatter';
import useTokenBalance from 'hooks/useTokenBalance';
import { ISwapSettings } from 'pages/Swap/types';

interface TProps {
  xToken: TokenInfo;
  yToken: TokenInfo;
  type: 'xAmt' | 'yAmt';
  isDisableAmountInput?: boolean;
  liquidityPool: IPool;
}

const TokenLiquidity: React.FC<TProps> = ({ xToken, yToken, type, liquidityPool }) => {
  const { values, setFieldValue, validateField } = useFormikContext<ISwapSettings>();
  const [tokenAmountFormatter] = useTokenAmountFormatter();
  const { getTokenBalanceInUSD } = usePools();

  const [uiBalance] = useTokenBalance(type === 'xAmt' ? xToken : yToken);
  const token = type === 'xAmt' ? xToken : yToken;

  useEffect(() => {
    validateField('xAmt');
    validateField('yAmt');
  }, [values, validateField]);

  // The debounce delay should be bigger than the average of key input intervals
  const onAmountChange = useDebouncedCallback(
    useCallback(
      (a: number) => {
        let pairType = '';
        let pairValue = 0;
        if (liquidityPool.reserve0.eqn(0) && liquidityPool.reserve1.eqn(0)) {
          setFieldValue(type, a);
        } else {
          if (type === 'xAmt') {
            pairType = 'yAmt';
            const inputX = new BN(new BigNumber(a).times(10 ** xToken.decimals).toFixed(0));
            pairValue = new BigNumber(
              inputX.mul(liquidityPool.reserve1).div(liquidityPool.reserve0).toString()
            )
              .div(10 ** xToken.decimals)
              .toNumber();
          } else {
            pairType = 'xAmt';
            const inputY = new BN(new BigNumber(a).times(10 ** yToken.decimals).toFixed(0));
            pairValue =
              new BigNumber(
                inputY.mul(liquidityPool.reserve0).div(liquidityPool.reserve1).toString()
              )
                .div(10 ** xToken.decimals)
                .toNumber() * 0.9999999999;
            // todo remove * 0.999999999
          }
          setFieldValue(type, a);
          setFieldValue(pairType, pairValue);
        }
      },
      [liquidityPool, setFieldValue, type, xToken.decimals, yToken.decimals]
    ),
    200
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full items-center justify-between">
        <div className="flex gap-2">
          <div className="flex gap-2">
            <CoinIcon symbol={token.symbol} size={20} />
            <div className="">{token.symbol}</div>
          </div>
          <div className="flex gap-2 border-l border-bc-white-20 pl-2">
            <Button
              className="h-5 w-[31px] rounded-none bg-bc-white-20 p-1 text-xs text-bc-white-80"
              onClick={() => {
                onAmountChange(uiBalance * 0.5);
              }}>
              Half
            </Button>
            <Button
              className="h-5 w-[31px] rounded-none bg-bc-white-20 p-1 text-xs text-bc-white-80"
              onClick={() => {
                onAmountChange(uiBalance);
              }}>
              Max
            </Button>
          </div>
        </div>
        <PositiveFloatNumInput
          min={0}
          max={1e11}
          maxDecimals={token?.decimals || 9}
          // isDisabled={actionType === 'currencyTo' || isDisableAmountInput}
          placeholder="0.00"
          className="w-2/3 bg-transparent pr-0 pl-1 text-right text-3xl"
          inputAmount={values[type] || 0}
          onAmountChange={onAmountChange}
        />
      </div>
      <div
        className={cx(
          // styles.TokenLiquidity,
          'flex justify-between text-bc-white-80'
        )}>
        <small className="flex items-end text-sm">
          Balance:
          <span className={classNames('ml-1')}>{tokenAmountFormatter(uiBalance, token) || 0}</span>
        </small>
        <small className="flex items-end text-sm">
          ~$<span className={classNames('ml-1')}>{getTokenBalanceInUSD(uiBalance, token)}</span>
        </small>
      </div>
    </div>
  );
};

export default TokenLiquidity;
