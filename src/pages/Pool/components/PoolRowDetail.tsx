/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import poolAction from 'modules/pool/actions';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from 'components/Button';
import { numberGroupFormat } from 'components/PositiveFloatNumInput/numberFormats';
import useAptosWallet from 'hooks/useAptosWallet';
import usePools from 'hooks/usePools';
import { IPool } from 'types/pool';
import { MinusIcon, PlusIcon } from 'resources/icons';

interface ExpandedDataType {
  id: string;
  liquidity: number;
  assetsPooled: Record<string, number>;
  share: number;
}

interface IProps {
  pool: IPool;
}

const PoolRowDetail = ({ pool }: IProps) => {
  const dispatch = useDispatch();
  const { activeWallet, openModal } = useAptosWallet();
  const { getOwnedLiquidity, getPoolTVL, poolFilter, getPoolStatsByTimebasis } = usePools();
  const [poolRecord, setPoolRecord] = useState<ExpandedDataType>();

  const poolStats = useMemo(() => getPoolStatsByTimebasis(pool), [getPoolStatsByTimebasis, pool]);

  const fetchRecord = useCallback(async () => {
    const { lp, coins } = await getOwnedLiquidity(pool.id);
    const poolData = {
      id: pool.id,
      liquidity: lp,
      assetsPooled: coins,
      share: pool.liquidity ? (lp / pool.liquidity) * 100 : 0
    };
    setPoolRecord(poolData);
  }, [getOwnedLiquidity, pool.id, pool.liquidity]);

  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);

  const handleOnClick = useCallback(
    (type: 'add' | 'withdraw') => {
      if (!activeWallet) {
        openModal();
      } else {
        dispatch(poolAction.TOGGLE_LIQUIDITY_MODAL({ type, pool }));
      }
      return null;
    },
    [activeWallet, dispatch, openModal, pool]
  );

  return (
    <Fragment>
      <div className="flex-col tablet:flex">
        <div className="hidden gap-6 p-4 tablet:flex tablet:bg-white dark:tablet:bg-table_row_bg">
          <div className="flex flex-col">
            <span className="block text-xs">Volume {poolFilter.timeBasis}</span>
            <span className="text-item_black dark:text-white">
              Coming soon
              {/* {numberGroupFormat(poolStats.volume, 3) || 0} */}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="block text-xs">Fees {poolFilter.timeBasis}</span>
            <span className="text-item_black dark:text-white">
              Coming soon
              {/* {numberGroupFormat(poolStats.fees, 3) || 0} */}
            </span>
          </div>
        </div>
        <div className="flex gap-6 tablet:flex-col tablet:bg-white_table tablet:p-4 dark:tablet:bg-color_bg_gray">
          <div className="flex grow gap-6 tablet:w-full">
            <div className="flex w-[240px] grow flex-col gap-4 tablet:w-[82px]">
              <span className="block text-xs">Your Liquidity</span>
              <div className="flex flex-col">
                <span className="text-item_black dark:text-white">
                  ${numberGroupFormat(getPoolTVL(pool) * (poolRecord?.share / 100), 3) || 0}
                </span>
                <span className="text-item_black dark:text-white">
                  {numberGroupFormat(poolRecord?.liquidity, 6) || 0} LP
                </span>
              </div>
            </div>
            <div className="flex grow flex-col gap-4">
              <span className="block text-xs">Assets Pooled</span>
              <div className="flex flex-col">
                {poolRecord?.assetsPooled &&
                  Object.keys(poolRecord?.assetsPooled).map((key) => {
                    return (
                      <div className="text-item_black dark:text-white" key={`pool-asset-${key}`}>
                        {poolRecord?.assetsPooled[key]
                          ? numberGroupFormat(poolRecord?.assetsPooled[key], 6) || 0
                          : 0}{' '}
                        {key}
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="flex grow flex-col gap-4">
              <span className="block text-xs">Your Share</span>
              <span className="text-item_black dark:text-white">
                {numberGroupFormat(poolRecord?.share, 3) || 0} %
              </span>
            </div>
          </div>
          <div className="flex h-12 w-[292px] justify-end gap-4 tablet:w-full">
            <Button
              className="flex w-full max-w-[134px] items-center gap-2 rounded-none bg-color_main fill-white text-base text-white hover:opacity-90 tablet:max-w-full"
              onClick={() => handleOnClick('add')}>
              {activeWallet ? (
                <Fragment>
                  <PlusIcon />
                  Deposit
                </Fragment>
              ) : (
                'Connect Wallet'
              )}
            </Button>
            {activeWallet && poolRecord?.liquidity > 0 && (
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
