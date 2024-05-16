import React, { useCallback, useMemo, useState } from 'react';

import Skeleton from 'components/Skeleton';
import useMerlinWallet from 'hooks/useMerlinWallet';

import { Token, TokenInfo } from '../../sdk';
import { cn } from 'utils/cn';

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
      className={cn('relative overflow-hidden', className)}
      style={{ width: `${size}px`, height: `${size}px` }}>
      {(!logoSrc || !isLoaded) && <Skeleton className="absolute inset-0" circle />}
      {logoSrc && (
        <img
          src={logoSrc}
          className={cn('h-full w-full rounded-full ', {
            hidden: !isLoaded
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
