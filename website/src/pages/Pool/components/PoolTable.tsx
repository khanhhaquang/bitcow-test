/* eslint-disable @typescript-eslint/no-unused-vars */

import { IPool } from 'bitcow';
import cx from 'classnames';
import { useCallback } from 'react';

import { ColumnsType, Table, TableProps } from 'components/Antd';
import {
  numberCompactFormat
  //numberGroupFormat
} from 'components/PositiveFloatNumInput/numberFormats';
import { useBreakpoint } from 'hooks/useBreakpoint';
import usePools from 'hooks/usePools';
import { ReactComponent as PoolUnfoldIcon } from 'resources/icons/poolUnfold.svg';

import PoolRowDetail from './PoolRowDetail';
import TokenPair from './TokenPair';

interface TProps {
  activePools: IPool[];
  viewOwned: boolean;
}

const PoolTable = ({ activePools, viewOwned }: TProps) => {
  const { isTablet } = useBreakpoint('tablet');
  const { getPoolTVL, poolFilter, getPoolStatsByTimebasis, setPoolFilter } = usePools();

  const loading = !activePools.length;

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
            volume: (a, b) => getPoolStatsByTimebasis(a).volume - getPoolStatsByTimebasis(b).volume,
            fees: (a, b) => getPoolStatsByTimebasis(a).fees - getPoolStatsByTimebasis(b).fees,
            apr: (a, b) => getPoolStatsByTimebasis(a).apr - getPoolStatsByTimebasis(b).apr
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
        title: 'Type',
        dataIndex: 'poolType',
        render: (val, record) => {
          return (
            <div className="tablet:hidden">
              {record.poolType.startsWith('V3') ? 'V3' : record.poolType}
            </div>
          );
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
                ${numberCompactFormat(tvl, 1) || 0}
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
      // {
      //   title: `Volume ${poolFilter.timeBasis}`,
      //   dataIndex: 'volume',
      //   render: (val, record: IPool) => {
      //     const { volume } = getPoolStatsByTimebasis(record);
      //     return (
      //       <div className="tablet:hidden">
      //         {numberCompactFormat(volume, 1)
      //           ? `$${numberCompactFormat(volume, 1)}`
      //           : 'Coming soon'}
      //       </div>
      //     );
      //   },
      //   sortOrder: activeSorter.field === 'volume' ? activeSorter.order : null,
      //   sorter: {
      //     compare: (a, b) => getPoolStatsByTimebasis(a).volume - getPoolStatsByTimebasis(b).volume,
      //     multiple: 2
      //   }
      // },
      // {
      //   title: `Fees ${poolFilter.timeBasis}`,
      //   dataIndex: 'fees',
      //   render: (val, record: IPool) => {
      //     const { fees } = getPoolStatsByTimebasis(record);
      //     return (
      //       <div className="tablet:hidden">
      //         {numberCompactFormat(fees, 3) ? `$${numberCompactFormat(fees, 3)}` : 'Coming soon'}
      //       </div>
      //     );
      //   },
      //   sortOrder: activeSorter.field === 'fees' ? activeSorter.order : null,
      //   sorter: {
      //     compare: (a, b) => getPoolStatsByTimebasis(a).fees - getPoolStatsByTimebasis(b).fees,
      //     multiple: 2
      //   }
      // },
      /*
      {
        title: `APR ${poolFilter.timeBasis}`,
        dataIndex: 'apr',
        render: (val, record: IPool) => {
          const { apr } = getPoolStatsByTimebasis(record);
          return (
            <div className="flex tablet:flex-col">
              <span className="hidden text-xs tablet:block">APR {poolFilter.timeBasis}</span>
              <span className="tablet:text-color_text_1">
                {numberGroupFormat(apr * 100, 3)
                  ? `${numberGroupFormat(apr * 100, 1)}%`
                  : 'Coming soon'}
              </span>
            </div>
          );
        },
        sortOrder: activeSorter.field === 'apr' ? activeSorter.order : null,
        sorter: {
          compare: (a, b) => getPoolStatsByTimebasis(a).apr - getPoolStatsByTimebasis(b).apr,
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
      */
      Table.EXPAND_COLUMN
    ];

    if (isTablet) {
      const tabletExludedCols = ['volume', 'fees', 'operation'];
      cols = cols.filter((col: any) => !tabletExludedCols.includes(col.dataIndex));
    }

    return cols;
  }, [getPoolTVL, getSortOrder, getSorter, isTablet, poolFilter]);

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
      loading={{
        spinning: loading,
        indicator: (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-bc-grey-transparent">
            <img src="/images/noData.png" alt="No Data" width={151} height={130} />
            <div className="text-lg text-bc-white-80">No Data...</div>
          </div>
        )
      }}
      pagination={false}
      className={cx('ant-pool-table', { 'ant-table-loading': loading })}
      onChange={handleChange}
      tableLayout="fixed"
      sortDirections={['descend', 'ascend']}
      rowKey={(record) => record.poolAddress}
      showSorterTooltip={false}
      expandable={{
        expandedRowClassName: () => 'expanded-pool',
        expandRowByClick: true,
        defaultExpandAllRows: viewOwned,
        expandedRowRender: (record) => {
          return <PoolRowDetail pool={record} />;
        },
        expandIcon: ({ expanded, onExpand, record }) => {
          return <PoolUnfoldIcon className={cx({ 'rotate-180': expanded })} />;
          /*
          return expanded ? (
            <div onClick={(e) => onExpand(record, e)}>
              <PoolUnfoldIcon className={cx({ 'rotate-180': expanded })} />
            </div>
          ) : (
            <div onClick={(e) => onExpand(record, e)}>
              <PoolUnfoldIcon />
            </div>
          );
          */
        },
        rowExpandable: () => true
      }}
    />
  );
};

export default PoolTable;
