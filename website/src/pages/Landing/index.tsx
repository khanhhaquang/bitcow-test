import { useEffect, useMemo } from 'react';

import { numberGroupFormat } from 'components/PositiveFloatNumInput/numberFormats';
import usePools from 'hooks/usePools';

import styles from './Landing.module.scss';

import useMerlinWallet from '../../hooks/useMerlinWallet';
import { cn } from 'utils/cn';

export default function Landing() {
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
    <div className="relative flex w-full items-center justify-between px-20 laptop:flex-col laptop:pt-20">
      <p
        className={cn(
          styles.leftLabel,
          'laptop:self-start smallLaptop:!text-6xl tablet:text-5xl mobile:!ml-0 mobile:!w-[170px] mobile:text-3xl'
        )}>
        STABLE & CONCENTRATED
      </p>
      <div className="laptop:scale-70 smallLaptop:scale-60 absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center tablet:scale-90">
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
              src="/images/24h-vol.png"
              alt="24h Volume"
              width={425}
              height={20}
            />
            <div className="text-center text-[48px] mobile:text-[36px]">{vol24hr}</div>
          </div>
        </div>
      </div>
      <div
        className={cn(styles.rightLabel, 'flex flex-col items-end laptop:self-end mobile:!w-full')}>
        <p className={cn(styles.main, 'smallLaptop:!text-6xl tablet:!text-5xl mobile:!text-3xl')}>
          TO THE MOOOO!
        </p>
        <img width={252} height={43} src="/images/poweredBy.png" alt="powered by smiley" />
      </div>
    </div>
  );
}
