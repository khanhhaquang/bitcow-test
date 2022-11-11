import poolAction from 'modules/pool/actions';
import { useDispatch } from 'react-redux';

import { ColumnsType, Table } from 'components/Antd';
import Button from 'components/Button';
import { RemoveIcon } from 'resources/icons';
import { IPool } from 'types/pool';

interface ExpandedDataType {
  id: string;
  liquidity: number;
  assetsPooled: number;
  share: number;
}

interface IProps {
  pool: IPool;
  poolRecord: ExpandedDataType[];
}

const PoolRowDetail = ({ pool, poolRecord }: IProps) => {
  const dispatch = useDispatch();
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
      render: () => (
        <div className="text-base text-white">
          {/* <div className="text-sm text-gray_05">Your Liquidity</div> */}
          <div className="">-</div>
          <div className="">-</div>
        </div>
      )
    },
    {
      title: 'Your Share',
      dataIndex: 'share',
      key: 'share',
      render: () => (
        <div className="text-base text-white">
          {/* <div className="text-sm text-gray_05">Your Liquidity</div> */}
          <div className="">-</div>
        </div>
      )
    },
    {
      title: '',
      key: 'operation',
      render: (val, record) => {
        return (
          <div className="flex justify-end gap-4">
            {record.liquidity > 0 && (
              <Button
                className="h-12 w-12 rounded-none border-[1px] border-[#272A2C] p-0 text-white hover:bg-gray_01"
                onClick={() => {
                  dispatch(poolAction.TOGGLE_LIQUIDITY_MODAL({ type: 'withdraw', pool }));
                }}>
                <RemoveIcon />
              </Button>
            )}
            <Button
              className="rounded-none bg-button_gradient text-base text-black hover:opacity-90"
              onClick={() => {
                dispatch(poolAction.TOGGLE_LIQUIDITY_MODAL({ type: 'add', pool }));
              }}>
              Add Liquidity
            </Button>
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
