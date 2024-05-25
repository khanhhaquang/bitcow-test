// import { TokenInfo } from '@manahippo/hippo-sdk/dist/generated/coin_registry/coin_registry';

import { Skeleton } from 'antd';
import { displayAddress } from 'wallet/utils/formatter';

import { Tooltip } from 'components/Antd';
import CoinIcon from 'components/CoinIcon';
import useTokenAmountFormatter from 'hooks/useTokenAmountFormatter';
import { FilteredToken } from 'types/bitcow';

import { numberGroupFormat } from '../../../../components/PositiveFloatNumInput/numberFormats';
import useMerlinWallet from '../../../../hooks/useMerlinWallet';

interface TProps {
  item: FilteredToken;
}

const CoinRow: React.FC<TProps> = ({ item }) => {
  const { wallet } = useMerlinWallet();
  const [tokenAmountFormatter] = useTokenAmountFormatter();
  return (
    <div className="flex h-[48px] w-full items-center justify-between gap-2 px-4  text-bc-white">
      <div className="flex items-center gap-2">
        <CoinIcon size={34} token={item.token} />
        <div className="flex flex-col justify-start">
          <span className="text-lg">{item.token.symbol.replace('bitusd', 'bitUSD')}</span>
          <Tooltip title={item.token.address}>
            <span className="text-xs text-white/50">
              {displayAddress(item.token.address, 4, 5)}
            </span>
          </Tooltip>
        </div>
      </div>
      <small className="text-base font-bold">
        {wallet && item.balance === -1 && (
          <Skeleton.Button className="!h-4 !w-10 !min-w-0" active />
        )}
        {wallet && item.balance != undefined && item.balance > 0 && (
          <div className="flex flex-col justify-start">
            <span className="text-xl">{tokenAmountFormatter(item.balance, item.token)}</span>
            {item.value > 0 && (
              <Tooltip title={numberGroupFormat(item.value)} className="ml-auto">
                <span className="text-xs text-white/50">
                  {numberGroupFormat(item.value) + ' $'}
                </span>
              </Tooltip>
            )}
            {item.value === 0 && (
              <Tooltip title={0} className="ml-auto">
                <span className="text-xs text-white/50"></span>
              </Tooltip>
            )}
          </div>
        )}
      </small>
    </div>
  );
};

export default CoinRow;
