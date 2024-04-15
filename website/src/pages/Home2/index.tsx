import classNames from 'classnames';
import { useEffect, useMemo } from 'react';

import { numberGroupFormat } from 'components/PositiveFloatNumInput/numberFormats';
import usePools from 'hooks/usePools';

import styles from './Home2.module.scss';

import useMerlinWallet from '../../hooks/useMerlinWallet';

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
    <div className="flex w-full items-center justify-center tablet:!px-[20px] mobile:!px-[10px] [@media(max-width:2199px)]:flex-col [@media(max-width:2199px)]:px-[40px] [@media(max-width:2199px)]:pt-[40px]">
      <div
        className={classNames(
          styles.leftLabel,
          'tablet:text-[64px] mobile:!ml-0 mobile:!w-[170px] mobile:text-[32px] [@media(max-width:2199px)]:ml-[10%] [@media(max-width:2199px)]:self-start'
        )}>
        STABLE & CONCENTRATED
      </div>
      <div className="flex flex-col items-center">
        <img className={classNames(styles.center, 'tablet:w-full')} src="/images/homeCow.webp" />
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
        <div className={classNames(styles.main, 'mobile:!text-[32px]')}>TO THE MOO!</div>
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
