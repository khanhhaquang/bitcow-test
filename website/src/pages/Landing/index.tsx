import classNames from 'classnames';
import { useEffect, useMemo } from 'react';

import { numberGroupFormat } from 'components/PositiveFloatNumInput/numberFormats';
import usePools from 'hooks/usePools';

import styles from './Home2.module.scss';

import useMerlinWallet from '../../hooks/useMerlinWallet';
import { cn } from 'utils/cn';

export default function Home2() {
  const { getTotalPoolsTVL, getTotalPoolsVolume } = usePools();
  const { initProvider } = useMerlinWallet();

  useEffect(() => {
    initProvider('swap');
  }, [initProvider]);

  const tvl = useMemo(() => {
    const val = getTotalPoolsTVL();
    return val ? `$${numberGroupFormat(val)}` : '-';
  }, [getTotalPoolsTVL]);

  const vol24hr = useMemo(() => {
    const val = getTotalPoolsVolume();
    return val ? `$${numberGroupFormat(val)}` : '-';
  }, [getTotalPoolsVolume]);

  return (
    <div className="relative flex w-full items-center justify-between px-20 tablet:!px-[20px] mobile:!px-[10px] [@media(max-width:2199px)]:flex-col">
      <p
        className={classNames(
          styles.leftLabel,
          'tablet:text-[64px] mobile:!ml-0 mobile:!w-[170px] mobile:text-[32px] [@media(max-width:2199px)]:ml-[10%] [@media(max-width:2199px)]:self-start'
        )}>
        STABLE & CONCENTRATED
      </p>
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <img
          className={cn('h-[587px] w-[774px] max-w-[1757px] flex-1', 'tablet:w-full')}
          src="/images/homeCow.webp"
        />
        <div className="flex justify-center gap-x-12 tablet:flex-col tablet:justify-center tablet:gap-y-4">
          <div className="space-x-3">
            <img className="block" src="/images/tvl.png" alt="TVL" width={424} height={20} />
            <div className="text-center text-[48px] mobile:text-[36px]">{tvl}</div>
          </div>
          <div className="space-x-3">
            <img
              className="block"
              src="/images/24hvol.png"
              alt="24h Volume"
              width={425}
              height={20}
            />
            <div className="text-center text-[48px] mobile:text-[36px]">{vol24hr}</div>
          </div>
        </div>
      </div>
      <div
        className={classNames(
          styles.rightLabel,
          'flex flex-col items-end tablet:!mr-0 tablet:!self-center mobile:!w-full [@media(max-width:2199px)]:mt-12 [@media(max-width:2199px)]:mr-[10%] [@media(max-width:2199px)]:self-end'
        )}>
        <p className={classNames(styles.main, 'mobile:!text-[32px]')}>TO THE MOOOO!</p>
        <img width={252} height={43} src="/images/poweredBy.png" alt="powered by smiley" />
      </div>
    </div>
  );
}
