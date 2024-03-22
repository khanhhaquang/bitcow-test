/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import poolAction from 'modules/pool/actions';
import { IUserLiquidity, IPool } from 'obric-merlin';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from 'components/Button';
import {
  numberCompactFormat,
  numberGroupFormat
} from 'components/PositiveFloatNumInput/numberFormats';
import { useBreakpoint } from 'hooks/useBreakpoint';
import useMerlinWallet from 'hooks/useMerlinWallet';
import usePools from 'hooks/usePools';
import { MinusIcon, PlusIcon } from 'resources/icons';

interface ExpandedDataType {
  typename: string;
  lpAmount: number;
  assetsPooled: Record<string, number>;
  liquidityShare: number;
}

interface IProps {
  pool: IPool;
}

const PoolRowDetail = ({ pool }: IProps) => {
  const dispatch = useDispatch();
  const { wallet, openWalletModal } = useMerlinWallet();
  const {
    getOwnedLiquidity,
    getOwnedLiquidityShare,
    getPoolTVL,
    poolFilter,
    getPoolStatsByTimebasis
  } = usePools();
  const [ownedLiquidity, setOwnedLiquidity] = useState<IUserLiquidity>();
  const { isTablet } = useBreakpoint('tablet');

  const poolStats = useMemo(() => getPoolStatsByTimebasis(pool), [getPoolStatsByTimebasis, pool]);

  const fetchRecord = useCallback(() => {
    const userLiq = getOwnedLiquidity(pool);
    setOwnedLiquidity(userLiq);
  }, [getOwnedLiquidity, pool]);

  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);

  const handleOnClick = useCallback(
    (type: 'add' | 'withdraw') => {
      if (!wallet) {
        openWalletModal();
      } else {
        dispatch(poolAction.TOGGLE_LIQUIDITY_MODAL({ type, pool }));
      }
      return null;
    },
    [wallet, dispatch, openWalletModal, pool]
  );

  const ownedLiquidityShare = useMemo(() => {
    return getOwnedLiquidityShare(pool);
  }, [getOwnedLiquidityShare, pool]);

  const owndedLiquidityUsdValue = useMemo(() => {
    const liquidity = getPoolTVL(pool) * ownedLiquidityShare;
    if (isTablet) {
      return numberCompactFormat(liquidity, 1);
    }
    return numberGroupFormat(liquidity, 3);
  }, [ownedLiquidityShare, getPoolTVL, isTablet, pool]);

  const assetsPooled = useMemo(() => {
    return (
      ownedLiquidity?.assetsPooled &&
      Object.keys(ownedLiquidity?.assetsPooled).map((key) => {
        const val = ownedLiquidity?.assetsPooled[key];
        return (
          <div className="text-color_text_1" key={`pool-asset-${key}`}>
            {val ? (isTablet ? numberCompactFormat(val) : numberGroupFormat(val, 6) || 0) : 0} {key}
          </div>
        );
      })
    );
  }, [isTablet, ownedLiquidity?.assetsPooled]);

  const isV1 = pool.poolType === 'v1';

  const userLiquidityLine1 = useMemo(() => {
    return `${numberGroupFormat(ownedLiquidity?.lpAmount, 6) || 0} LP`;
  }, [ownedLiquidity]);

  const userLiquidityLine2 = useMemo(() => {
    return '';
  }, []);

  return (
    <Fragment>
      <div className="flex-col tablet:flex">
        <div className="hidden gap-6 p-4 tablet:flex tablet:bg-color_bg_table dark:tablet:bg-color_bg_row">
          <div className="flex flex-col">
            <span className="block text-sm leading-3 tablet:text-xs">
              Volume {poolFilter.timeBasis}
            </span>
            <span className="text-color_text_1">{numberCompactFormat(poolStats.volume) || 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="block text-sm leading-3 tablet:text-xs">
              Fees {poolFilter.timeBasis}
            </span>
            <span className="text-color_text_1">
              {numberCompactFormat(poolStats.fees)
                ? `$${numberCompactFormat(poolStats.fees)}`
                : 'Coming soon'}
            </span>
          </div>
        </div>
        <div className="flex gap-6 tablet:flex-col tablet:bg-color_bg_panel tablet:p-4">
          <div className="flex grow gap-6 tablet:w-full">
            <div className="flex w-[210px] grow flex-col gap-4 tablet:w-[82px]">
              <span className="block text-sm leading-3 tablet:text-xs">Your Liquidity</span>
              <div className="flex flex-col gap-1">
                <span className="text-color_text_1">{userLiquidityLine1}</span>
                <span className="text-color_text_1">{userLiquidityLine2}</span>
              </div>
            </div>
            <div className="flex grow flex-col gap-4">
              <span className="block text-sm leading-3 tablet:text-xs">Assets Pooled</span>
              <div className="flex flex-col gap-1">{assetsPooled}</div>
            </div>
            <div className="flex grow flex-col gap-4">
              <span className="block text-sm leading-3 tablet:text-xs">Your Share</span>
              <span className="text-color_text_1">
                {numberGroupFormat(ownedLiquidityShare * 100, 3) || 0} %
              </span>
              <span className="text-color_text_1">${owndedLiquidityUsdValue}</span>
            </div>
          </div>
          <div className="flex h-12 w-[292px] justify-end gap-4 tablet:w-full">
            {
              <Button
                className="flex w-full max-w-[134px] items-center gap-2 rounded-none bg-color_main fill-white text-base text-white hover:opacity-90 tablet:max-w-full"
                onClick={() => handleOnClick('add')}>
                {wallet ? (
                  <Fragment>
                    <PlusIcon />
                    Deposit
                  </Fragment>
                ) : (
                  'Connect Wallet'
                )}
              </Button>
            }
            {isV1 && wallet && ownedLiquidity?.invested && (
              <Button
                className="flex w-full items-center gap-2"
                variant="outlined"
                onClick={() => handleOnClick('withdraw')}>
                <MinusIcon />
                Withdraw
              </Button>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PoolRowDetail;
