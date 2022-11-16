/* eslint-disable @typescript-eslint/no-unused-vars */

import { ColumnsType, Table, TableProps } from 'components/Antd';
import { HintIcon, LessIcon, MoreIcon } from 'resources/icons';
import { IPool } from 'types/pool';

import PoolRowDetail from './PoolRowDetail';
import styles from './PoolTable.module.scss';
import TokenPair from './TokenPair';

interface TProps {
  activePools: IPool[];
  viewOwned: boolean;
}

const PoolTable = ({ activePools, viewOwned }: TProps) => {
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
      render: (val) => {
        return (
          <div className="flex tablet:flex-col">
            <span className="hidden text-xs tablet:block">Liquidity</span>
            <span className="tablet:text-white">{val.toFixed(6)}</span>
          </div>
        );
      },
      sorter: {
        compare: (a, b) => a.liquidity - b.liquidity,
        multiple: 2
      }
    },
    {
      title: 'Volume 7D',
      dataIndex: 'volumn7D',
      render: (val) => {
        return <div className="tablet:hidden">{val}</div>;
      },
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
      render: (val) => {
        return <div className="tablet:hidden">{val}</div>;
      },
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
      render: (val) => {
        return (
          <div className="flex tablet:flex-col">
            <span className="hidden text-xs tablet:block">APR 7D</span>
            <span className="tablet:text-white">{val}</span>
          </div>
        );
      },
      sorter: {
        compare: (a, b) => {
          if (typeof a.apr7D === 'number' && typeof b.apr7D === 'number') {
            return a.apr7D - b.apr7D;
          }
        },
        multiple: 2
      }
    },
    {
      title: '',
      key: 'operation',
      render: () => {
        return <div className="flex w-12"></div>;
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
      dataSource={activePools}
      pagination={false}
      className={styles.poolTable}
      onChange={handleChange}
      rowKey={(record) => record.id}
      expandable={{
        expandRowByClick: true,
        defaultExpandAllRows: viewOwned,
        expandedRowRender: (record) => {
          return <PoolRowDetail pool={record} />;
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
        rowExpandable: () => true
      }}
    />
  );
};

export default PoolTable;
