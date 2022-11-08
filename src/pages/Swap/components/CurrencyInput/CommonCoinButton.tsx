// import { TokenInfo } from '@manahippo/hippo-sdk/dist/generated/coin_registry/coin_registry';
import { RawCoinInfo } from '@manahippo/coin-list';
import Button from 'components/Button';
import CoinIcon from 'components/CoinIcon';

interface TProps {
  coin: RawCoinInfo;
  onClickToken: () => void;
}

const CommonCoinButton: React.FC<TProps> = ({ coin, onClickToken }) => {
  return (
    <Button
      variant="outlined"
      onClick={onClickToken}
      className="p-2 flex gap-2 !rounded-none !border-[1px] !border-gray_008 text-white hover:bg-gray_008 uppercase">
      <CoinIcon logoSrc={coin.logo_url} />
      {coin.symbol}
    </Button>
  );
};

export default CommonCoinButton;
