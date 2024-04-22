import { TokenInfo } from 'bitcow';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { useCallback, useMemo, useState } from 'react';

import { Collapse } from 'components/Antd';
import useTokenAmountFormatter from 'hooks/useTokenAmountFormatter';

import styles from './SwapDetail.module.scss';

import { ISwapSettings } from '../types';
import { DropDownArrowIcon } from 'resources/icons';
import { cn } from 'utils/cn';

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
  let [openPanel, setOpenPanel] = useState('');
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
        value: priceImpact
      }
    ];
    return (
      <div className={classNames('mt-2.5 flex flex-col gap-y-2.5')}>
        {details.map((detail) => (
          <div className="flex justify-between text-xs text-bc-white" key={detail.label}>
            <span>{detail.label}</span>
            <span>{detail.value}</span>
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
      <div className={classNames('mt-2.5 flex flex-col gap-y-2.5')}>
        {details.map((detail) => (
          <div className="flex justify-between text-xs text-white" key={detail.label}>
            <span>{detail.label}</span>
            <span>{detail.value}</span>
          </div>
        ))}
      </div>
    );
  }, [fromToken.symbol, minimumOutput, toToken.symbol, values.slipTolerance]);

  return (
    <div className={classNames('mt-9', styles.collapse)}>
      <Collapse
        ghost
        accordion={false}
        onChange={(v) => setOpenPanel(v as string)}
        defaultActiveKey={openPanel}
        expandIconPosition="end"
        expandIcon={({ isActive }) => (
          <div>
            <DropDownArrowIcon className={cn('text-white', isActive ? '-rotate-180' : '0')} />
          </div>
        )}>
        <Panel
          header={<div className="text-bc-white">{swapRate}</div>}
          key="1"
          className="text-bc-white">
          {renderOutput()}
          {renderDetails()}
        </Panel>
      </Collapse>
    </div>
  );
};

export default SwapDetail;
