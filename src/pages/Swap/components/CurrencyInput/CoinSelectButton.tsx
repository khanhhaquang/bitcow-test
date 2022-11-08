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
        'flex items-center gap-2 font-bold cursor-pointer bg-gray_004 p-2 w-fit',
        {
          'cursor-not-allowed pointer-events-none': isDisabled
        },
        className
      )}
      onClick={onClick}>
      {token?.symbol ? (
        <>
          <div className="flex gap-2 uppercase items-center">
            <CoinIcon logoSrc={token.logo_url} />
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
