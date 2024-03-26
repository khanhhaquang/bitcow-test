// import { TokenInfo } from '@manahippo/hippo-sdk/dist/generated/coin_registry/coin_registry';

import { Skeleton } from 'antd';

import CoinIcon from 'components/CoinIcon';
import useTokenAmountFormatter from 'hooks/useTokenAmountFormatter';
import { TokenBalance } from 'types/obric';

import useMerlinWallet from '../../../../hooks/useMerlinWallet';

interface TProps {
  item: TokenBalance;
}

const CoinRow: React.FC<TProps> = ({ item }) => {
  const { wallet } = useMerlinWallet();
  const [tokenAmountFormatter] = useTokenAmountFormatter();
  return (
    <div className="flex h-[48px] w-full items-center justify-between gap-2 px-4  text-bc-white">
      <div className="flex items-center gap-2">
        <CoinIcon size={32} token={item.token} />
        <div className="flex flex-col justify-start">
          <small className="text-xs text-bc-white-50">{item.token.name}</small>
          <div className="text-base leading-4">{item.token.symbol}</div>
        </div>
      </div>
      <small className="text-base font-bold">
        {wallet && item.balance < 0 && <Skeleton.Button className="!h-4 !w-10 !min-w-0" active />}
        {(!wallet || item.balance >= 0) && tokenAmountFormatter(item.balance, item.token)}
      </small>
    </div>
  );
};

export default CoinRow;
