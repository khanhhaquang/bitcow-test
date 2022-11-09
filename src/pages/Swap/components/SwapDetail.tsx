import { Collapse } from 'components/Antd';
import useTokenAmountFormatter from 'hooks/useTokenAmountFormatter';
import { useMemo } from 'react';

const { Panel } = Collapse;

const SwapDetail = ({ fromToken, toToken, routeAndQuote = 1 }) => {
  const [tokenAmountFormatter] = useTokenAmountFormatter();
  const [swapRate] = useMemo(() => {
    let rate: string = '-';
    if (routeAndQuote) {
      // const avgPrice = routeAndQuote.quote.outputUiAmt / routeAndQuote.quote.inputUiAmt;
      const avgPrice = 1;
      rate =
        !avgPrice || avgPrice === Infinity
          ? 'n/a'
          : `1 ${fromToken.symbol} ≈ ${tokenAmountFormatter(avgPrice, toToken)} ${toToken.symbol}`;
    }
    return [rate];
  }, [fromToken.symbol, routeAndQuote, toToken, tokenAmountFormatter]);

  return (
    <div className="py-6 px-5">
      <Collapse
        bordered={false}
        // expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        className="site-collapse-custom-collapse">
        <Panel header={swapRate} key="1" className="site-collapse-custom-panel">
          <p>test</p>
        </Panel>
      </Collapse>
    </div>
  );
};

export default SwapDetail;
