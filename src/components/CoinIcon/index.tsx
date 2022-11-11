import { RawCoinInfo } from '@manahippo/coin-list';
import classNames from 'classnames';
import React, { useCallback, useState } from 'react';

import Skeleton from 'components/Skeleton';
import useAptosWallet from 'hooks/useAptosWallet';

interface TProps {
  logoSrc?: string;
  className?: string;
  symbol?: string;
  token?: RawCoinInfo;
  size?: number;
}

// Use size instead of className to set the size of images
const CoinIcon: React.FC<TProps> = ({ logoSrc, size = 24, className, symbol, token }) => {
  const { tokenInfo } = useAptosWallet();
  const [isLoaded, setIsLoaded] = useState(false);
  if (!logoSrc) {
    if (token) logoSrc = token?.logo_url;
    if (symbol) {
      token = tokenInfo && tokenInfo[symbol][0];
      logoSrc = token?.logo_url;
    }
  }
  const onImgError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = '';
    event.currentTarget.className = 'bg-black';
  };
  const onImgLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      className={classNames('relative', className)}
      style={{ width: `${size}px`, height: `${size}px` }}>
      {(!logoSrc || !isLoaded) && (
        <Skeleton className="absolute left-0 top-0 h-full w-full" circle={true} height={'100%'} />
      )}
      {logoSrc && (
        <img
          src={logoSrc}
          className={classNames('h-full w-full rounded-full', { invisible: !isLoaded })}
          alt="coin icon"
          onError={onImgError}
          onLoad={onImgLoad}
        />
      )}
    </div>
  );
};

export default CoinIcon;
