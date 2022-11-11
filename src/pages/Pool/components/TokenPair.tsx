import { RawCoinInfo } from '@manahippo/coin-list';

import CoinIcon from 'components/CoinIcon';

interface TProps {
  token0: RawCoinInfo;
  token1: RawCoinInfo;
}

const TokenPair: React.FC<TProps> = ({ token0, token1 }) => {
  const [token0URI, token1URI] = [token0.logo_url, token1.logo_url];

  return (
    <div className="flex w-[240px] max-w-[240px] items-center gap-4">
      <div className="flex items-center">
        <CoinIcon className="h-6 w-6 rounded-full" logoSrc={token0URI || ''} />
        <CoinIcon className="-ml-[6px] h-6 w-6 rounded-full" logoSrc={token1URI || ''} />
      </div>
      <div className="text-base text-white">
        {token0.symbol}-{token1.symbol}
      </div>
    </div>
  );
};

export default TokenPair;
