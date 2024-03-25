import classNames from 'classnames';
import { BaseToken } from 'obric-merlin';

import CoinIcon from 'components/CoinIcon';
import { ReactComponent as CoinSelectIcon } from 'resources/icons/coinSelect.svg';

const CoinSelectButton = ({
  className = '',
  token,
  isDisabled = false,
  onClick = () => {}
}: {
  className?: string;
  token: BaseToken | undefined;
  isDisabled?: Boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      className={classNames(
        'flex w-fit cursor-pointer items-center gap-2 border border-bc-white-60 bg-bc-white-10 fill-color_text_1 p-2 text-lg font-bold  leading-4',
        {
          'pointer-events-none cursor-not-allowed': isDisabled
        },
        className
      )}
      onClick={onClick}>
      {token?.symbol ? (
        <div className="flex items-center gap-2 text-bc-white">
          <CoinIcon token={token} size={20} />
          {token.symbol}
        </div>
      ) : (
        <div className="small">--</div>
      )}
      <CoinSelectIcon />
    </div>
  );
};

export default CoinSelectButton;
