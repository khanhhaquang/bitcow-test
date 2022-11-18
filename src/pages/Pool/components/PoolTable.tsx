/* eslint-disable @typescript-eslint/no-unused-vars */

import { useCallback } from 'react';

import { ColumnsType, Table, TableProps } from 'components/Antd';
import { useBreakpoint } from 'hooks/useBreakpoint';
import usePools from 'hooks/usePools';
import { LessIcon, MoreIcon } from 'resources/icons';
import { IPool } from 'types/pool';

import PoolRowDetail from './PoolRowDetail';
import styles from './PoolTable.module.scss';
import TokenPair from './TokenPair';
import { numberGroupFormat } from 'components/PositiveFloatNumInput/numberFormats';

interface TProps {
  activePools: IPool[];
  viewOwned: boolean;
}

const PoolTable = ({ activePools, viewOwned }: TProps) => {
  const { isTablet } = useBreakpoint('tablet');
  const { getPoolTVL, poolFilter } = usePools();

  const columns: () => ColumnsType<IPool> = useCallback(() => {
    let cols = [
      {
        title: 'Trading Pair',
        // width: 240,
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
              <span className="tablet:text-white">${numberGroupFormat(tvl, 3) || 0}</span>
            </div>
          );
        },
        defaultSortOrder: 'descend',
        sorter: {
          compare: (a, b) => a.liquidity - b.liquidity,
          multiple: 2
        }
      },
      {
        title: `Volume ${poolFilter.timeBasis}`,
        dataIndex: 'volume',
        render: (val) => {
          return <div className="tablet:hidden">{val}</div>;
        },
        sorter: {
          compare: (a, b) => {
            if (typeof a.volume === 'number' && typeof b.volume === 'number') {
              return a.volume - b.volume;
            }
          },
          multiple: 2
        }
      },
      {
        title: `Fees ${poolFilter.timeBasis}`,
        dataIndex: 'fees',
        render: (val) => {
          return <div className="tablet:hidden">{val}</div>;
        },
        sorter: {
          compare: (a, b) => {
            if (typeof a.fees === 'number' && typeof b.fees === 'number') {
              return a.fees - b.fees;
            }
          },
          multiple: 2
        }
      },
      {
        title: `APR ${poolFilter.timeBasis}`,
        dataIndex: 'apr',
        render: (val) => {
          return (
            <div className="flex tablet:flex-col">
              <span className="hidden text-xs tablet:block">APR {poolFilter.timeBasis}</span>
              <span className="tablet:text-white">{val}</span>
            </div>
          );
        },
        sorter: {
          compare: (a, b) => {
            if (typeof a.apr === 'number' && typeof b.apr === 'number') {
              return a.apr - b.apr;
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
      const tabletExludedCols = ['volume', 'fees', 'operation'];
      cols = cols.filter((col: any) => !tabletExludedCols.includes(col.dataIndex));
    }

    return cols;
  }, [getPoolTVL, isTablet, poolFilter.timeBasis]);

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
      // tableLayout="fixed"
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
