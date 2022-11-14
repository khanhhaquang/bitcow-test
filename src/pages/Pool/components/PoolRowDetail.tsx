import poolAction from 'modules/pool/actions';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ColumnsType, Table } from 'components/Antd';
import Button from 'components/Button';
import usePools from 'hooks/usePools';
import { IPool } from 'types/pool';

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
  const { getOwnedLiquidity } = usePools();
  const [poolRecord, setPoolRecord] = useState<ExpandedDataType[]>();

  const fetchRecord = useCallback(async () => {
    const { lp, coins } = await getOwnedLiquidity(pool.id);
    const poolData = [
      {
        id: pool.id,
        liquidity: lp,
        assetsPooled: coins,
        share: pool.liquidity ? (lp / pool.liquidity) * 100 : 0
      }
    ];
    setPoolRecord(poolData);
  }, [getOwnedLiquidity, pool.id, pool.liquidity]);

  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);

  const columns: ColumnsType<ExpandedDataType> = [
    {
      title: 'Your Liquidity',
      dataIndex: 'liquidity',
      key: 'liquidity',
      render: (val) => (
        <div className="text-base text-white">
          {/* <div className="text-sm text-gray_05">Your Liquidity</div> */}
          <div className="">{val} LP</div>
          {/* <div className="">0 LP</div> */}
        </div>
      )
    },
    {
      title: 'Assets Pooled',
      dataIndex: 'assetsPooled',
      key: 'assetsPooled',
      render: (val) => (
        <div className="text-base text-white">
          {Object.keys(val).map((key) => {
            return (
              <div className="" key={`${val}-${key}`}>
                {val[key]} {key}
              </div>
            );
          })}
        </div>
      )
    },
    {
      title: 'Your Share',
      dataIndex: 'share',
      key: 'share',
      render: (val) => (
        <div className="text-base text-white">
          <div className="">{val}%</div>
        </div>
      )
    },
    {
      title: '',
      key: 'operation',
      render: (val, record) => {
        return (
          <div className="flex justify-end gap-4">
            <Button
              className="rounded-none bg-color_main text-base text-white hover:opacity-90"
              onClick={() => {
                dispatch(poolAction.TOGGLE_LIQUIDITY_MODAL({ type: 'add', pool }));
              }}>
              Deposit
            </Button>
            {record.liquidity > 0 && (
              <Button
                className="rounded-none border-[1px] border-color_main px-6 py-4 text-color_main hover:bg-gray_01"
                variant="outlined"
                onClick={() => {
                  dispatch(poolAction.TOGGLE_LIQUIDITY_MODAL({ type: 'withdraw', pool }));
                }}>
                Withdraw
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <Table
      rowKey={(record) => record.id}
      columns={columns}
      dataSource={poolRecord}
      pagination={false}
    />
  );
};

export default PoolRowDetail;
