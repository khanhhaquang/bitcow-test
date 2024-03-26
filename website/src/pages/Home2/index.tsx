import classNames from 'classnames';
import { useMemo } from 'react';

import { numberGroupFormat } from 'components/PositiveFloatNumInput/numberFormats';
import usePools from 'hooks/usePools';

import styles from './Home2.module.scss';

export default function Home2() {
  const { getTotalPoolsTVL, getTotalPoolsVolume } = usePools();

  const tvl = useMemo(() => {
    const val = getTotalPoolsTVL();
    return val ? `$${numberGroupFormat(val)}` : '-';
  }, [getTotalPoolsTVL]);

  const vol24hr = useMemo(() => {
    const val = getTotalPoolsVolume();
    return val ? `$${numberGroupFormat(val)}` : '-';
  }, [getTotalPoolsVolume]);

  return (
    <div className="flex w-full items-center justify-center laptop:flex-col tablet:px-[10px]">
      <div
        className={classNames(
          styles.leftLabel,
          'tablet:w-full tablet:self-start tablet:text-[48px]'
        )}>
        smart liquidity matters
      </div>
      <div className="flex flex-col items-center tablet:w-full">
        <img className={styles.center} src="/images/homeCow.webp" />
        <div className="mx-auto flex gap-x-12 tablet:flex-col tablet:gap-y-4">
          <div className="space-x-3">
            <img className="block" src="/images/tvl.png" alt="TVL" width={424} height={20} />
            <div className="text-center text-[48px]">{tvl}</div>
          </div>
          <div className="space-x-3">
            <img
              className="block"
              src="/images/24hvol.png"
              alt="24h Volume"
              width={425}
              height={20}
            />
            <div className="text-center text-[48px]">{vol24hr}</div>
          </div>
        </div>
      </div>
      <div
        className={classNames(
          styles.rightLabel,
          'flex flex-col items-end laptop:mt-12 tablet:w-full'
        )}>
        <div className={classNames(styles.main)}>Proactive AMMS with your Single-token liquity</div>
        <img
          width={142}
          height={24}
          src="/images/poweredBy.png"
          alt="powered by smiley"
          className={styles.poweredBy}
        />
      </div>
    </div>
  );
}
