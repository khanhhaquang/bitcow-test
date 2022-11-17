/* eslint-disable @typescript-eslint/no-unused-vars */

import { useCallback } from 'react';

import { ColumnsType, Table, TableProps } from 'components/Antd';
import { useBreakpoint } from 'hooks/useBreakpoint';
import { HintIcon, LessIcon, MoreIcon } from 'resources/icons';
import { IPool } from 'types/pool';

import PoolRowDetail from './PoolRowDetail';
import styles from './PoolTable.module.scss';
import TokenPair from './TokenPair';
import usePools from 'hooks/usePools';

interface TProps {
  activePools: IPool[];
  viewOwned: boolean;
}

const PoolTable = ({ activePools, viewOwned }: TProps) => {
  const { isTablet } = useBreakpoint('tablet');
  const { getPoolTVL } = usePools();

  const columns: () => ColumnsType<IPool> = useCallback(() => {
    let cols = [
      {
        title: 'Trading Pair',
        dataIndex: 'token0',
        render: (val, record, index) => {
          return <TokenPair token0={record.token0} token1={record.token1} />;
        }
      },
      {
        title: 'TVL',
        dataIndex: 'liquidity',
        render: (val, record: IPool) => {
          let tvl = getPoolTVL(record);
          return (
            <div className="flex tablet:flex-col">
              <span className="hidden text-xs tablet:block">TVL</span>
              <span className="tablet:text-white">${tvl.toFixed(3)}</span>
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
        dataIndex: 'volume7D',
        render: (val) => {
          return <div className="tablet:hidden">{val}</div>;
        },
        sorter: {
          compare: (a, b) => {
            if (typeof a.volume7D === 'number' && typeof b.volume7D === 'number') {
              return a.volume7D - b.volume7D;
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
        dataIndex: 'operation',
        key: 'operation',
        render: () => {
          return <div className="flex w-12"></div>;
        }
      },
      Table.EXPAND_COLUMN
    ];

    if (isTablet) {
      const tabletExludedCols = ['volume7D', 'fees7D', 'operation'];
      cols = cols.filter((col: any) => !tabletExludedCols.includes(col.dataIndex));
    }

    return cols;
  }, [getPoolTVL, isTablet]);

  const handleChange: TableProps<IPool>['onChange'] = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
  };

  return (
    <Table
      columns={columns()}
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
