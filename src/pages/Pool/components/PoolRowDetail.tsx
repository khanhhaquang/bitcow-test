import { ColumnsType, Table } from 'components/Antd';
import Button from 'components/Button';
import { RemoveIcon } from 'resources/icons';

interface ExpandedDataType {
  liquidity: number;
  assetsPooled: number;
  share: number;
}

interface IProps {
  poolRecord: ExpandedDataType[];
}

const PoolRowDetail = ({ poolRecord }: IProps) => {
  const columns: ColumnsType<ExpandedDataType> = [
    {
      title: 'Your Liquidity',
      dataIndex: 'liquidity',
      key: 'liquidity',
      render: (val) => (
        <div className="text-base text-white">
          {/* <div className="text-sm text-gray_05">Your Liquidity</div> */}
          <div className="">$ {val}</div>
          <div className="">0 LP</div>
        </div>
      )
    },
    {
      title: 'Assets Pooled',
      dataIndex: 'assetsPooled',
      key: 'assetsPooled',
      render: (val) => (
        <div className="text-base text-white">
          {/* <div className="text-sm text-gray_05">Your Liquidity</div> */}
          <div className="">{val} ETH</div>
          <div className="">{val} USDC</div>
        </div>
      )
    },
    {
      title: 'Your Share',
      dataIndex: 'share',
      key: 'share',
      render: (val) => (
        <div className="text-base text-white">
          {/* <div className="text-sm text-gray_05">Your Liquidity</div> */}
          <div className="">{val} %</div>
        </div>
      )
    },
    {
      title: '',
      key: 'operation',
      render: () => {
        return (
          <div className="flex gap-4 justify-end">
            <Button className="rounded-none text-white border-[1px] border-[#272A2C] w-12 h-12 p-0">
              <RemoveIcon />
            </Button>
            <Button className="bg-button_gradient text-black text-base rounded-none">
              Add Liquidity
            </Button>
          </div>
        );
      }
    }
  ];

  return <Table columns={columns} dataSource={poolRecord} pagination={false} />;
};

export default PoolRowDetail;
