import { RawCoinInfo } from '@manahippo/coin-list';
import classNames from 'classnames';

import CoinIcon from 'components/CoinIcon';
import { CaretIcon } from 'resources/icons';

const CoinSelectButton = ({
  className = '',
  token,
  isDisabled = false,
  onClick = () => {}
}: {
  className?: string;
  token: RawCoinInfo | undefined;
  isDisabled?: Boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      className={classNames(
        'flex w-fit cursor-pointer items-center gap-2 bg-gray_004 p-2 font-bold',
        {
          'pointer-events-none cursor-not-allowed': isDisabled
        },
        className
      )}
      onClick={onClick}>
      {token?.symbol ? (
        <>
          <div className="flex items-center gap-2">
            <CoinIcon token={token} />
            {token.symbol}
          </div>
          <CaretIcon className="font-icon text-grey-300" />
        </>
      ) : (
        <>
          <div className="small">--</div>
          <CaretIcon className="font-icon text-grey-300" />
        </>
      )}
    </div>
  );
};

export default CoinSelectButton;
