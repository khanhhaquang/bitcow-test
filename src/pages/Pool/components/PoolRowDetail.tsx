import poolAction from 'modules/pool/actions';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from 'components/Button';
import useAptosWallet from 'hooks/useAptosWallet';
import usePools from 'hooks/usePools';
import { IPool } from 'types/pool';

interface ExpandedDataType {
  id: string;
  liquidity: number;
  assetsPooled: Record<string, number>;
  share: string;
}

interface IProps {
  pool: IPool;
}

const PoolRowDetail = ({ pool }: IProps) => {
  const dispatch = useDispatch();
  const { activeWallet, openModal } = useAptosWallet();
  const { getOwnedLiquidity } = usePools();
  const [poolRecord, setPoolRecord] = useState<ExpandedDataType[]>([]);

  const fetchRecord = useCallback(async () => {
    const { lp, coins } = await getOwnedLiquidity(pool.id);
    const poolData = [
      {
        id: pool.id,
        liquidity: lp,
        assetsPooled: coins,
        share: pool.liquidity ? ((lp / pool.liquidity) * 100).toFixed(3) : '0'
      }
    ];
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
        <div className="hidden gap-6 p-4 tablet:flex">
          <div className="flex flex-col">
            <span className="block text-xs">Volume 7D</span>
            <span className="text-white">{pool.volumn7D}</span>
          </div>
          <div className="flex flex-col">
            <span className="block text-xs">Fees 7D</span>
            <span className="text-white">{pool.fees7D}</span>
          </div>
        </div>
        <div className="flex gap-6 tablet:flex-col tablet:bg-gray_bg tablet:p-4">
          <div className="flex grow gap-6 tablet:w-full">
            <div className="flex w-[240px] grow flex-col gap-4 tablet:w-[82px]">
              <span className="block text-xs">Your Liquidity</span>
              <span className="text-white">{poolRecord[0]?.liquidity.toFixed(6)} LP</span>
            </div>
            <div className="flex grow flex-col gap-4">
              <span className="block text-xs">Assets Pooled</span>
              <div className="flex flex-col">
                {poolRecord[0]?.assetsPooled &&
                  Object.keys(poolRecord[0]?.assetsPooled).map((key) => {
                    return (
                      <div className="text-white" key={`pool-asset-${key}`}>
                        {poolRecord[0]?.assetsPooled[key]
                          ? poolRecord[0]?.assetsPooled[key].toFixed(6)
                          : 0}{' '}
                        {key}
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="flex grow flex-col gap-4">
              <span className="block text-xs">Your Share</span>
              <span className="text-white">{poolRecord[0]?.share} %</span>
            </div>
          </div>
          <div className="flex h-12 w-[240px] justify-end gap-4 tablet:w-full">
            <Button
              className="w-full max-w-[108px] rounded-none bg-color_main text-base text-white hover:opacity-90 tablet:max-w-full"
              onClick={() => handleOnClick('add')}>
              {activeWallet ? 'Deposit' : 'Connect Wallet'}
            </Button>
            {activeWallet && poolRecord[0]?.liquidity > 0 && (
              <Button
                className="w-full rounded-none border-[1px] border-color_main px-6 py-4 text-color_main hover:bg-gray_01"
                variant="outlined"
                onClick={() => handleOnClick('withdraw')}>
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
