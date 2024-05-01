import BigNumber from 'bignumber.js';
import { useFormikContext } from 'formik';
import { useCallback, useEffect, useRef } from 'react';

// import { Popover } from 'antd';
import Button from 'components/Button';
import CoinIcon from 'components/CoinIcon';
import PositiveFloatNumInput from 'components/PositiveFloatNumInput';
import useDebouncedCallback from 'hooks/useDebouncedCallback';
import usePools from 'hooks/usePools';
import useTokenAmountFormatter from 'hooks/useTokenAmountFormatter';
import useTokenBalance from 'hooks/useTokenBalance';
import { ISwapSettings } from 'pages/Swap/types';

import { BN, IPool, Token } from '../../../sdk';

interface TProps {
  xToken: Token;
  yToken: Token;
  type: 'xAmt' | 'yAmt';
  isDisableAmountInput?: boolean;
  liquidityPool: IPool;
}

const TokenLiquidity: React.FC<TProps> = ({ xToken, yToken, type, liquidityPool }) => {
  const { values, setFieldValue, validateField } = useFormikContext<ISwapSettings>();
  const [tokenAmountFormatter] = useTokenAmountFormatter();
  const { getTokenBalanceInUSD } = usePools();
  const tokenInputDecimals = useRef(9);

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
            pairValue = parseFloat(
              new BigNumber(
                inputX.mul(liquidityPool.reserve1).div(liquidityPool.reserve0).toString()
              )
                .div(10 ** yToken.decimals)
                .toFixed(tokenInputDecimals.current)
            );
          } else {
            pairType = 'xAmt';
            const inputY = new BN(new BigNumber(a).times(10 ** yToken.decimals).toFixed(0));
            pairValue = parseFloat(
              new BigNumber(
                inputY.mul(liquidityPool.reserve0).div(liquidityPool.reserve1).toString()
              )
                .div(10 ** xToken.decimals)
                .times(0.9999999999)
                .toNumber()
                .toFixed(tokenInputDecimals.current)
            );
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
    <div className="flex flex-col gap-3">
      <div className="flex w-full items-center justify-between">
        <div className="flex">
          <div className="flex items-center gap-2">
            <CoinIcon token={token} size={26} />
            <span className="text-lg uppercase">{token.symbol}</span>
          </div>
          <div className="ml-2 flex items-center gap-2">
            <Button
              className="h-5 w-8 rounded-none bg-bc-white-20 p-1 text-xs text-bc-white-80"
              onClick={() => {
                onAmountChange(uiBalance * 0.5);
              }}>
              Half
            </Button>
            <Button
              className="h-5 w-8 rounded-none bg-bc-white-20 p-1 text-xs text-bc-white-80"
              onClick={() => {
                onAmountChange(uiBalance);
              }}>
              Max
            </Button>
          </div>
        </div>
        <PositiveFloatNumInput
          min={0}
          max={uiBalance}
          maxDecimals={tokenInputDecimals.current}
          // isDisabled={actionType === 'currencyTo' || isDisableAmountInput}
          placeholder="0.00"
          className="w-2/3 bg-transparent pr-0 pl-1 text-right text-4xl"
          inputAmount={values[type] || 0}
          onInputChange={onAmountChange}
          onAmountChange={onAmountChange}
        />
      </div>
      <div className={'flex justify-between text-bc-white-80'}>
        <small className="flex items-end text-sm">
          Balance:
          <span className="ml-1">{tokenAmountFormatter(uiBalance, token) || 0}</span>
        </small>
        <small className="flex items-end text-sm">
          ~$<span className="ml-1">{getTokenBalanceInUSD(values[type], token)}</span>
        </small>
      </div>
    </div>
  );
};

export default TokenLiquidity;
