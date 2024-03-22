import { BaseToken } from 'obric-merlin';

import CoinIcon from 'components/CoinIcon';

interface TProps {
  token0: BaseToken;
  token1: BaseToken;
}

const TokenPair: React.FC<TProps> = ({ token0, token1 }) => {
  return (
    <div className="flex w-[240px] max-w-[240px] items-center gap-4 tablet:w-[82px] tablet:flex-col tablet:items-start tablet:gap-2">
      <div className="flex items-center">
        <CoinIcon className="h-6 w-6 rounded-full" token={token0} />
        <CoinIcon className="-ml-[6px] h-6 w-6 rounded-full" token={token1} />
      </div>
      <div className="text-base text-color_text_1 tablet:whitespace-pre">
        {token0.symbol}-{token1.symbol}
      </div>
    </div>
  );
};

export default TokenPair;
