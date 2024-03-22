import classNames from 'classnames';
import { BaseToken } from 'obric-merlin';

import CoinIcon from 'components/CoinIcon';
import { CaretIcon } from 'resources/icons';

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
        'flex w-fit cursor-pointer items-center gap-2 bg-color_bg_token fill-color_text_1 p-2 text-lg font-bold  leading-4',
        {
          'pointer-events-none cursor-not-allowed': isDisabled
        },
        className
      )}
      onClick={onClick}>
      {token?.symbol ? (
        <div className="flex items-center gap-2">
          <CoinIcon token={token} size={20} />
          {token.symbol}
        </div>
      ) : (
        <div className="small">--</div>
      )}
      <CaretIcon className="font-icon text-grey-300 fill-inherit" />
    </div>
  );
};

export default CoinSelectButton;
