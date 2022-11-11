/* eslint-disable @typescript-eslint/no-unused-vars */
import { ColumnsType, Table, TableProps } from 'components/Antd';
import usePools from 'hooks/usePools';
import { HintIcon, LessIcon, MoreIcon } from 'resources/icons';
import { IPool } from 'types/pool';

import PoolRowDetail from './PoolRowDetail';
import styles from './PoolTable.module.scss';
import TokenPair from './TokenPair';

interface IProps {
  data: IPool[];
}

const PoolTable = ({ data }: IProps) => {
  const { getOwnedLiquidity } = usePools();

  const columns: ColumnsType<IPool> = [
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
        compare: (a, b) => {
          if (typeof a.volumn7D === 'number' && typeof b.volumn7D === 'number') {
            return a.volumn7D - b.volumn7D;
          }
        },
        multiple: 2
      }
    },
    {
      title: 'Fees 7D',
      dataIndex: 'fees7D',
      sorter: {
        compare: (a, b) => {
          if (typeof a.fees7D === 'number' && typeof b.fees7D === 'number') {
            return a.fees7D - b.fees7D;
          }
        },
        multiple: 2
      }
    },
    {
      title: () => (
        <div className="flex items-center gap-2">
          <div>APR 7D</div>
          <HintIcon className="h-3 w-3" />
        </div>
      ),
      dataIndex: 'apr7D',
      sorter: {
        compare: (a, b) => {
          if (typeof a.apr7D === 'number' && typeof b.apr7D === 'number') {
            return a.apr7D - b.apr7D;
          }
        },
        multiple: 2
      }
    },
    Table.EXPAND_COLUMN
  ];

  const handleChange: TableProps<IPool>['onChange'] = (pagination, filters, sorter) => {
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
          console.log('row expand>>', record.id, getOwnedLiquidity(record.id));
          const poolData = [
            {
              id: record.id,
              liquidity: getOwnedLiquidity(record.id),
              assetsPooled: 0,
              share: 0
            }
          ];
          return <PoolRowDetail pool={record} poolRecord={poolData} />;
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
