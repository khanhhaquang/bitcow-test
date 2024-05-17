import { useEffect, useMemo } from 'react';

import { numberGroupFormat } from 'components/PositiveFloatNumInput/numberFormats';
import usePools from 'hooks/usePools';
import { cn } from 'utils/cn';

import styles from './Landing.module.scss';

import useMerlinWallet from '../../hooks/useMerlinWallet';

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
    <div className="relative flex w-full items-center justify-between px-20 laptop:flex-col laptop:pt-20 mobile:pt-8">
      <p
        className={cn(
          styles.leftLabel,
          'laptop:self-start smallLaptop:!text-6xl tablet:text-5xl mobile:!ml-0 mobile:!w-[170px] mobile:!text-3xl'
        )}>
        STABLE & CONCENTRATED
      </p>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex flex-col items-center">
          <img
            className={cn(
              'h-[587px] w-[774px] max-w-[1757px]',
              'laptop:h-[415px] laptop:w-[540px]'
            )}
            src="/images/homeCow.webp"
          />
          <div className="flex justify-center gap-x-12 tablet:flex-col tablet:justify-center tablet:gap-y-8">
            <div className="space-x-3">
              <img className="block" src="/images/tvl.png" alt="TVL" width={424} height={20} />
              <p className="text-center text-5xl mobile:text-4xl">{tvl}</p>
            </div>
            <div className="space-x-3">
              <img
                className="block"
                src="/images/24h-vol.png"
                alt="24h Volume"
                width={425}
                height={20}
              />
              <p className="text-center text-5xl mobile:text-4xl">{vol24hr}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={cn(styles.rightLabel, 'flex flex-col items-end laptop:self-end')}>
        <p className={cn(styles.main, 'smallLaptop:!text-6xl tablet:!text-5xl mobile:!text-3xl')}>
          TO THE MOOOO!
        </p>
        <img width={252} height={43} src="/images/poweredBy.png" alt="powered by smiley" />
      </div>
    </div>
  );
}
