import Button from 'components/Button';
import CoinIcon from 'components/CoinIcon';

import { TokenInfo } from '../../../../sdk';

interface TProps {
  coin: TokenInfo;
  onClickToken: () => void;
}

const CommonCoinButton: React.FC<TProps> = ({ coin, onClickToken }) => {
  return (
    <Button
      onClick={onClickToken}
      className="flex gap-x-2 !rounded-none bg-white/10 px-3 py-2 text-lg text-bc-white hover:bg-bc-grey-transparent2">
      <CoinIcon token={coin} size={20} />
      {coin.symbol.replace('bitusd', 'bitUSD')}
    </Button>
  );
};

export default CommonCoinButton;
