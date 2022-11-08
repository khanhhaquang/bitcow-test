/* eslint-disable @typescript-eslint/no-unused-vars */
import { ColumnsType, Table, TableProps } from 'components/Antd';
import { HintIcon, LessIcon, MoreIcon } from 'resources/icons';
import { IPoolItem } from '../types';
import PoolRowDetail from './PoolRowDetail';
import TokenPair from './TokenPair';
import styles from './PoolTable.module.scss';

interface IProps {
  data: IPoolItem[];
}

const PoolTable = ({ data }: IProps) => {
  const columns: ColumnsType<IPoolItem> = [
    {
      title: 'Trading Pair',
      dataIndex: 'token0',
      render: (val, record, index) => {
        return <TokenPair token0={record.token0} token1={record.token1} />;
      }
    },
    {
      title: 'Liquidity',
      dataIndex: 'liquidity',
      sorter: {
        compare: (a, b) => a.liquidity - b.liquidity,
        multiple: 2
      }
    },
    {
      title: 'Volume 7D',
      dataIndex: 'volumn7D',
      sorter: {
        compare: (a, b) => a.volumn7D - b.volumn7D,
        multiple: 2
      }
    },
    {
      title: 'Fees 7D',
      dataIndex: 'fees7D',
      sorter: {
        compare: (a, b) => a.fees7D - b.fees7D,
        multiple: 2
      }
    },
    {
      title: () => (
        <div className="flex gap-2 items-center">
          <div>APR 7D</div>
          <HintIcon className="w-3 h-3" />
        </div>
      ),
      dataIndex: 'apr7D',
      sorter: {
        compare: (a, b) => a.apr7D - b.apr7D,
        multiple: 2
      }
    },
    Table.EXPAND_COLUMN
  ];

  const handleChange: TableProps<IPoolItem>['onChange'] = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      className={styles.poolTable}
      onChange={handleChange}
      rowKey={(record) => record.id}
      expandable={{
        expandedRowRender: (record) => {
          const poolData = [
            {
              liquidity: 0,
              assetsPooled: 0,
              share: 0
            }
          ];
          return <PoolRowDetail poolRecord={poolData} />;
        },
        expandIcon: ({ expanded, onExpand, record }) => {
          return expanded ? (
            <div onClick={(e) => onExpand(record, e)}>
              <LessIcon />
            </div>
          ) : (
            <div onClick={(e) => onExpand(record, e)}>
              <MoreIcon />
            </div>
          );
        },
        rowExpandable: (record) => record.invested
      }}
    />
  );
};

export default PoolTable;
