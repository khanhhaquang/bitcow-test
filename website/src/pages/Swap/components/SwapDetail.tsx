import classNames from 'classnames';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { TokenInfo } from 'obric-merlin';
import { useCallback, useMemo } from 'react';

import { Collapse } from 'components/Antd';
import useTokenAmountFormatter from 'hooks/useTokenAmountFormatter';
import { ReactComponent as MoreIcon } from 'resources/icons/unfoldDetails.svg';

import styles from './SwapDetail.module.scss';

import { ISwapSettings } from '../types';

const { Panel } = Collapse;

const SwapDetail = ({
  fromToken,
  toToken,
  swapRateQuote,
  fromUiAmt,
  impact
}: {
  swapRateQuote: number;
  fromToken: TokenInfo;
  toToken: TokenInfo;
  fromUiAmt: number;
  impact: number;
}) => {
  const [tokenAmountFormatter] = useTokenAmountFormatter();
  const { values } = useFormikContext<ISwapSettings>();
  const [swapRate, outputUiAmt, priceImpact, minimumOutput] = useMemo(() => {
    let rate: string = '-';
    let output: string = '-';
    let minimum: string = '-';
    let impactPercent: string = '-';
    if (swapRateQuote) {
      output = `${tokenAmountFormatter(swapRateQuote, toToken)} ${toToken.symbol}`;
      impactPercent = (impact || 0) >= 0.0001 ? `${impact.toFixed(2)}%` : '<0.01%';
      minimum = `${tokenAmountFormatter(
        swapRateQuote * (1 - values.slipTolerance / 100),
        toToken
      )} ${toToken.symbol}`;
      const avgPrice = swapRateQuote / fromUiAmt;
      rate =
        !avgPrice || avgPrice === Infinity
          ? 'n/a'
          : `1 ${fromToken.symbol} ≈ ${tokenAmountFormatter(avgPrice, toToken)} ${toToken.symbol}`;
    }
    return [rate, output, impactPercent, minimum];
  }, [
    fromToken.symbol,
    fromUiAmt,
    impact,
    swapRateQuote,
    toToken,
    tokenAmountFormatter,
    values.slipTolerance
  ]);

  const renderOutput = useCallback(() => {
    const details = [
      {
        label: 'Expected Output',
        value: outputUiAmt
      },
      {
        label: 'Price Impact',
        value: priceImpact,
        className: styles.priceImpact
      }
    ];
    return (
      <div className={classNames('flex flex-col gap-1')}>
        {details.map((detail) => (
          <div className="flex justify-between text-xs text-bc-white" key={detail.label}>
            <div className="">{detail.label}</div>
            <div className={detail.className}>{detail.value}</div>
          </div>
        ))}
      </div>
    );
  }, [outputUiAmt, priceImpact]);

  const renderDetails = useCallback(() => {
    const details = [
      {
        label: `Minimum received after slippage (${values.slipTolerance}%)`,
        value: minimumOutput
      },
      {
        label: 'Route',
        value: `${fromToken.symbol} > ${toToken.symbol}`
      }
    ];
    return (
      <div className={classNames('flex flex-col gap-1')}>
        {details.map((detail) => (
          <div className="flex justify-between text-xs text-bc-white-60" key={detail.label}>
            <div className="">{detail.label}</div>
            <div className="">{detail.value}</div>
          </div>
        ))}
      </div>
    );
  }, [fromToken.symbol, minimumOutput, toToken.symbol, values.slipTolerance]);

  return (
    <div className={classNames('mt-2 bg-bc-grey-transparent2', styles.collapse)}>
      <Collapse
        ghost
        defaultActiveKey={['1']}
        expandIconPosition="end"
        expandIcon={({ isActive }) => (
          <div>
            <MoreIcon className={cx(isActive ? '-rotate-180' : '0')} />
          </div>
        )}>
        <Panel
          header={<div className="text-bc-white">{swapRate}</div>}
          key="1"
          className="text-bc-white">
          {renderOutput()}
          <hr className="my-4 h-[1px] w-full border-0 bg-bc-white-10" />
          {renderDetails()}
        </Panel>
      </Collapse>
    </div>
  );
};

export default SwapDetail;
