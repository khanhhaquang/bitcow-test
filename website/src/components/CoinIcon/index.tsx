import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';

import Skeleton from 'components/Skeleton';
import useMerlinWallet from 'hooks/useMerlinWallet';

import { Token, TokenInfo } from '../../sdk';

interface TProps {
  className?: string;
  token?: Token | TokenInfo;
  size?: number;
}

// Use size instead of className to set the size of images
const CoinIcon: React.FC<TProps> = ({ size = 24, className, token }) => {
  const { symbolToToken } = useMerlinWallet();
  const [isLoaded, setIsLoaded] = useState(false);
  const logoSrc = useMemo(() => {
    let tokenInfo: TokenInfo;
    if ('logUrl' in token) {
      tokenInfo = token;
    } else {
      if (symbolToToken) {
        tokenInfo = symbolToToken[token.symbol];
      }
    }
    if (tokenInfo) {
      if (tokenInfo.logoUrl) {
        return tokenInfo.logoUrl;
      } else {
        return 'images/' + tokenInfo.symbol + '.svg';
      }
    }
  }, [token, symbolToToken]);
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
            invisible: !isLoaded
          })}
          alt=""
          onError={onImgError}
          onLoad={onImgLoad}
        />
      )}
    </div>
  );
};

export default CoinIcon;
