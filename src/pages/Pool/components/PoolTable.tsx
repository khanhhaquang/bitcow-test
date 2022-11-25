/* eslint-disable @typescript-eslint/no-unused-vars */

import cx from 'classnames';
import { useCallback } from 'react';

import { ColumnsType, Table, TableProps } from 'components/Antd';
import { numberGroupFormat } from 'components/PositiveFloatNumInput/numberFormats';
import { useBreakpoint } from 'hooks/useBreakpoint';
import usePools from 'hooks/usePools';
import { LessIcon, MoreIcon } from 'resources/icons';
import { IPool } from 'types/pool';

import PoolRowDetail from './PoolRowDetail';
// import styles from './PoolTable.module.scss';
import TokenPair from './TokenPair';

interface TProps {
  activePools: IPool[];
  viewOwned: boolean;
}

const PoolTable = ({ activePools, viewOwned }: TProps) => {
  const { isTablet } = useBreakpoint('tablet');
  const { getPoolTVL, poolFilter, getPoolStatsByTimebasis, setPoolFilter } = usePools();

  // dirty handle mobile sort order as fields are hidden and not controlled by antd table
  const getSortOrder = useCallback(
    (field, activeSorter) => {
      if (field === 'liquidity') {
        let sortingFields = ['liquidity'];
        if (isTablet) {
          sortingFields.push('volume', 'fees', 'operation');
        }
        if (sortingFields.includes(activeSorter.field)) {
          return activeSorter.order;
        }
      }
      return null;
    },
    [isTablet]
  );

  // dirty handle mobile sort function as fields are hidden and not controlled by antd table
  const getSorter = useCallback(
    (field, activeSorter) => {
      if (field === 'liquidity') {
        let sortingLogics: Record<string, any> = {
          liquidity: (a, b) => getPoolTVL(a) - getPoolTVL(b)
        };
        if (isTablet) {
          sortingLogics = {
            ...sortingLogics,
            volume: (a, b) => getPoolTVL(a) - getPoolTVL(b),
            fees: (a, b) => getPoolStatsByTimebasis(a).fees - getPoolStatsByTimebasis(b).fees,
            operation: (a, b) => getPoolTVL(a) - getPoolTVL(b)
          };
        }
        return sortingLogics[activeSorter.field];
      }
      return null;
    },
    [getPoolStatsByTimebasis, getPoolTVL, isTablet]
  );

  const columns: () => ColumnsType<IPool> = useCallback(() => {
    const activeSorter = poolFilter.sortBy[poolFilter.sortBy.length - 1];
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
              <span className="whitespace-pre tablet:text-color_text_1">
                ${numberGroupFormat(tvl, 3) || 0}
              </span>
            </div>
          );
        },
        defaultSortOrder: 'descend',
        sortOrder: getSortOrder('liquidity', activeSorter),
        sorter: {
          compare: getSorter('liquidity', activeSorter),
          multiple: 2
        }
      },
      {
        title: `Volume ${poolFilter.timeBasis}`,
        dataIndex: 'volume',
        render: (val) => {
          return <div className="tablet:hidden">Coming Soon</div>;
        },
        sortOrder: activeSorter.field === 'volume' ? activeSorter.order : null,
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
        render: (val, record: IPool) => {
          const { fees } = getPoolStatsByTimebasis(record);
          return (
            <div className="tablet:hidden">
              {numberGroupFormat(fees, 3) ? `$${numberGroupFormat(fees, 3)}` : 'Coming soon'}
            </div>
          );
        },
        sortOrder: activeSorter.field === 'fees' ? activeSorter.order : null,
        sorter: {
          compare: (a, b) => getPoolStatsByTimebasis(a).fees - getPoolStatsByTimebasis(b).fees,
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
              <span className="tablet:text-color_text_1">Coming Soon</span>
            </div>
          );
        },
        sortOrder: activeSorter.field === 'apr' ? activeSorter.order : null,
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
  }, [getPoolStatsByTimebasis, getPoolTVL, getSortOrder, getSorter, isTablet, poolFilter]);

  const handleChange: TableProps<IPool>['onChange'] = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    if (Array.isArray(sorter)) {
      const sortBy = sorter.map((sort) => ({
        field: sort.field as string,
        order: sort.order
      }));
      setPoolFilter((prevState) => ({
        ...prevState,
        sortBy
      }));
    } else if (sorter.field) {
      setPoolFilter((prevState) => ({
        ...prevState,
        sortBy: [
          {
            field: sorter.field as string,
            order: sorter.order
          }
        ]
      }));
    }
  };

  return (
    <Table
      columns={columns()}
      dataSource={activePools}
      pagination={false}
      className={cx('ant-pool-table')}
      onChange={handleChange}
      tableLayout="fixed"
      sortDirections={['descend', 'ascend']}
      rowKey={(record) => record.id}
      showSorterTooltip={false}
      expandable={{
        expandedRowClassName: () => 'expanded-pool',
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
