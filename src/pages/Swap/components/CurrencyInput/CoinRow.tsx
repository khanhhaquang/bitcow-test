// import { TokenInfo } from '@manahippo/hippo-sdk/dist/generated/coin_registry/coin_registry';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { Skeleton } from 'antd';
import CoinIcon from 'components/CoinIcon';
import useTokenAmountFormatter from 'hooks/useTokenAmountFormatter';
import { TokenBalance } from 'types/hippo';

interface TProps {
  item: TokenBalance;
}

const CoinRow: React.FC<TProps> = ({ item }) => {
  const { connected } = useWallet();
  const [tokenAmountFormatter] = useTokenAmountFormatter();
  return (
    <div className="flex items-center justify-between gap-2 w-full px-2 hover:bg-gray_008 text-gray_05 font-Rany">
      <div className="flex items-center gap-2">
        <CoinIcon size={32} logoSrc={item.token.logo_url} />
        <div className="">
          <small className="text-xs">{item.token.name}</small>
          <div className="text-white text-base uppercase">{item.token.symbol}</div>
        </div>
      </div>
      <small className="text-base">
        {connected && item.balance < 0 && (
          <Skeleton.Button className="!w-10 !h-4 !min-w-0" active />
        )}
        {(!connected || item.balance >= 0) && tokenAmountFormatter(item.balance, item.token)}
      </small>
    </div>
  );
};

export default CoinRow;
