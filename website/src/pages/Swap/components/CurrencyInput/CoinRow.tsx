// import { TokenInfo } from '@manahippo/hippo-sdk/dist/generated/coin_registry/coin_registry';

import { Skeleton } from 'antd';
import { displayAddress } from 'wallet/utils/formatter';

import { Tooltip } from 'components/Antd';
import CoinIcon from 'components/CoinIcon';
import useTokenAmountFormatter from 'hooks/useTokenAmountFormatter';
import { TokenBalance } from 'types/bitcow';

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
        <CoinIcon size={34} token={item.token} />
        <div className="flex flex-col justify-start">
          <span className="text-lg">{item.token.symbol}</span>
          <Tooltip title={item.token.address}>
            <span className="text-xs text-white/50">
              {displayAddress(item.token.address, 4, 5)}
            </span>
          </Tooltip>
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
            <span className="text-2xl">{tokenAmountFormatter(item.balance, item.token)}</span>
          </div>
        )}
      </small>
    </div>
  );
};

export default CoinRow;
