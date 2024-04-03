import classNames from 'classnames';
import { TokenInfo } from 'obric-merlin';
import React, { useCallback, useMemo, useState } from 'react';

import Skeleton from 'components/Skeleton';
import useMerlinWallet from 'hooks/useMerlinWallet';

interface TProps {
  className?: string;
  symbol?: string;
  token?: TokenInfo;
  size?: number;
}

// Use size instead of className to set the size of images
const CoinIcon: React.FC<TProps> = ({ size = 24, className, symbol, token }) => {
  const { symbolToToken } = useMerlinWallet();
  const [isLoaded, setIsLoaded] = useState(false);
  const logoSrc = useMemo(() => {
    if (token) return 'images/' + token.symbol + '.svg';
    if (symbol) {
      const tok = symbolToToken[symbol];
      return 'images/' + tok.symbol + '.svg';
    }
  }, [symbol, token, symbolToToken]);
  const isAPT = token?.symbol === 'APT' || symbol === 'APT';
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
          className={classNames('h-full w-full rounded-full', {
            invisible: !isLoaded,
            'bg-white': isAPT
          })}
          alt="coin icon"
          onError={onImgError}
          onLoad={onImgLoad}
        />
      )}
    </div>
  );
};

export default CoinIcon;
