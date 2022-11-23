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
      onClick={onClickToken}
      className="flex gap-2 !rounded-none !border-[1px] !border-white_color_list_hover p-2 text-item_black hover:bg-white_gray_bg dark:!border-gray_008 dark:text-white dark:hover:bg-gray_008 tablet:text-sm tablet:leading-[14px]">
      <CoinIcon token={coin} className="tablet:max-w-5 tablet:max-h-5" />
      {coin.symbol}
    </Button>
  );
};

export default CommonCoinButton;
