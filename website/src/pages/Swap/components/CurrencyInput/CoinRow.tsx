// import { TokenInfo } from '@manahippo/hippo-sdk/dist/generated/coin_registry/coin_registry';

import { Skeleton } from 'antd';

import CoinIcon from 'components/CoinIcon';
import useTokenAmountFormatter from 'hooks/useTokenAmountFormatter';
import { TokenBalance } from 'types/bitcow';

import { walletAddressEllipsis } from '../../../../components/utils/utility';
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
          <small className="text-xs text-bc-white-50">
            <span>{item.token.name}</span>
          </small>
          <div className="text-base leading-4">
            <small>{walletAddressEllipsis(item.token.address)}</small>
          </div>
        </div>
      </div>
      <small className="text-base font-bold">
        {!wallet && <small className="ml-2">{item.token.symbol}</small>}
        {wallet && item.balance === -2 && <small className="ml-2">{item.token.symbol}</small>}
        {wallet && item.balance === -1 && (
          <Skeleton.Button className="!h-4 !w-10 !min-w-0" active />
        )}
        {wallet && item.balance != undefined && item.balance >= 0 && (
          <div>
            <span>{tokenAmountFormatter(item.balance, item.token)}</span>
            <small className="ml-2">{item.token.symbol}</small>
          </div>
        )}
      </small>
    </div>
  );
};

export default CoinRow;
