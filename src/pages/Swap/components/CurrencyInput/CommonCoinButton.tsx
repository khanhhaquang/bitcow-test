import { BaseToken } from 'obric-merlin';

import Button from 'components/Button';
import CoinIcon from 'components/CoinIcon';

interface TProps {
  coin: BaseToken;
  onClickToken: () => void;
}

const CommonCoinButton: React.FC<TProps> = ({ coin, onClickToken }) => {
  return (
    <Button
      onClick={onClickToken}
      className="flex gap-2 !rounded-none bg-bc-grey-transparent p-2 text-bc-white hover:bg-bc-grey-transparent2 tablet:text-sm tablet:leading-[14px]">
      <CoinIcon token={coin} size={20} />
      {coin.symbol}
    </Button>
  );
};

export default CommonCoinButton;
