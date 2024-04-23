import { TokenInfo } from 'bitcow';

import CoinIcon from 'components/CoinIcon';
import { ReactComponent as CoinSelectIcon } from 'resources/icons/coinSelect.svg';
import { cn } from 'utils/cn';

const CoinSelectButton = ({
  className = '',
  token,
  isDisabled = false,
  onClick = () => {}
}: {
  className?: string;
  token: TokenInfo | undefined;
  isDisabled?: Boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      className={cn(
        'flex w-fit cursor-pointer items-center gap-2 p-3 font-pg text-4xl',
        'hover:bg-white/10',
        {
          'pointer-events-none cursor-not-allowed': isDisabled
        },
        className
      )}
      onClick={onClick}>
      {token?.symbol ? (
        <div className="flex items-center gap-x-2 text-4xl uppercase text-white">
          <CoinIcon token={token} size={26} />
          {token.symbol}
        </div>
      ) : (
        <p className="text-4xl text-white">--</p>
      )}
      <CoinSelectIcon width={24} height={24} />
    </div>
  );
};

export default CoinSelectButton;
