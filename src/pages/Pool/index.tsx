import cx from 'classnames';
import poolAction from 'modules/pool/actions';
import { getLiquidityModal } from 'modules/pool/reducer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Radio, Tabs } from 'components/Antd';
import ObricModal from 'components/ObricModal';
import { numberCompactFormat } from 'components/PositiveFloatNumInput/numberFormats';
import SearchInput from 'components/SearchInput';
import SelectInput from 'components/SelectInput';
import usePools from 'hooks/usePools';
import { CancelIcon } from 'resources/icons';
import { IPool } from 'types/pool';

import AddLiquidity from './components/AddLiquidity';
import PoolTable from './components/PoolTable';
import WithdrawLiquidity from './components/WithdrawLiquidity';
import { useBreakpoint } from 'hooks/useBreakpoint';
// import styles from './Pool.module.scss';

const filterOptions = [
  {
    label: '24H',
    value: '24H'
  } /*,
  {
    label: '7D',
    value: '7D'
  },
  {
    label: '30D',
    value: '30D'
  }*/
];

const Pool = () => {
  const {
    activePools,
    checkIfInvested,
    coinInPools,
    setPoolFilter,
    poolFilter,
    getPoolStatsByTimebasis
  } = usePools();
  const [activeTab, setActiveTab] = useState('1');
  const dispatch = useDispatch();
  const [filteredPools, setFilteredPools] = useState(activePools);
  const liquidityModal = useSelector(getLiquidityModal);
  const { isTablet } = useBreakpoint('tablet');

  const sortPoolsByFilter = useCallback(
    (poolsToSort: IPool[]) => {
      let currentPools = poolsToSort;
      if (poolFilter.text) {
        currentPools = currentPools.filter((pool) =>
          [pool.address, pool.token0.symbol, pool.token1.symbol]
            .join('+')
            .toLowerCase()
            .includes(poolFilter.text.toLowerCase())
        );
      }
      setFilteredPools(currentPools);
    },
    [poolFilter.text]
  );

  useEffect(() => {
    if (activePools && coinInPools) {
      sortPoolsByFilter(activePools);
    }
  }, [activePools, coinInPools, sortPoolsByFilter]);

  const getTotalPoolsTVL = useCallback(() => {
    const result = coinInPools
      ? activePools.reduce((total, pool) => {
          return (total +=
            pool.token0Reserve * coinInPools[pool.token0.symbol] +
            pool.token1Reserve * coinInPools[pool.token1.symbol]);
        }, 0)
      : 0;
    return result;
  }, [activePools, coinInPools]);

  const getTotalPoolsVolume = useCallback(() => {
    const result = coinInPools
      ? activePools.reduce((total, pool) => {
          const { volume } = getPoolStatsByTimebasis(pool);
          return (total += volume);
        }, 0)
      : 0;
    return result;
  }, [activePools, coinInPools]);

  const SortOptions = useCallback(() => {
    return [
      {
        label: 'Liquidity',
        value: 'liquidity'
      },
      {
        label: `Volume ${poolFilter.timeBasis}`,
        value: 'volume'
      },
      {
        label: `Fees ${poolFilter.timeBasis}`,
        value: 'fees'
      },
      {
        label: `Apr ${poolFilter.timeBasis}`,
        value: 'apr'
      }
    ];
  }, [poolFilter.timeBasis]);

  const renderHeader = () => (
    <div className="mb-8 flex justify-between tablet:flex-col">
      <div className="font-Furore text-2xl text-color_text_1 tablet:text-lg">Pools</div>
      <div className="flex gap-2 text-lg leading-4 text-color_text_2 tablet:mt-4">
        <div className="flex items-center gap-2 bg-color_bg_panel px-6 py-[18px] tablet:w-1/2 tablet:grow tablet:flex-col-reverse tablet:p-4 tablet:text-color_text_2">
          <div className="">
            TVL <span className="tablet:hidden">:</span>
          </div>
          <div className="text-color_text_1 tablet:text-2xl">
            ${' '}
            {isTablet
              ? numberCompactFormat(getTotalPoolsTVL())
              : numberCompactFormat(getTotalPoolsTVL(), 1)}
          </div>
        </div>
        <div className="flex items-center gap-2 bg-color_bg_panel py-[18px] px-6 tablet:w-1/2 tablet:grow tablet:flex-col-reverse tablet:p-4 tablet:text-color_text_2">
          <div className="">
            Volume 24H <span className="tablet:hidden">:</span>
          </div>
          <div className="text-color_text_1 tablet:text-2xl">
            ${' '}
            {isTablet
              ? numberCompactFormat(getTotalPoolsVolume())
              : numberCompactFormat(getTotalPoolsVolume(), 1)}
          </div>
        </div>
      </div>
    </div>
  );

  const onUpdateSorter = (val: string) => {
    setPoolFilter((prevState) => ({
      ...prevState,
      sortBy: [
        {
          field: val,
          order: 'descend'
        }
      ]
    }));
  };

  const onUpdateFilter = (val: string, field: string) => {
    setPoolFilter((prevState) => ({
      ...prevState,
      [field]: val
    }));
  };

  const tabs = useMemo(
    () => [
      {
        id: '1',
        label: 'Liquidity Pools'
      },
      {
        id: '2',
        label: 'My Position'
      }
    ],
    []
  );

  const renderTabContents = useCallback(() => {
    return tabs.map((tab) => {
      let currentPools = filteredPools;
      if (tab.id === '2') {
        currentPools = currentPools.filter((pool) => checkIfInvested(pool.id));
      }

      return {
        label: tab.label,
        key: tab.id,
        children: <PoolTable activePools={currentPools} viewOwned={tab.id === '2'} />
      };
    });
  }, [filteredPools, checkIfInvested, tabs]);

  return (
    <div className="mt-[100px] flex flex-col tablet:mt-4">
      {renderHeader()}
      <div className="border-[1px] border-white_table bg-color_bg_table py-8 backdrop-blur-[15px] dark:border-[#272A2C] dark:backdrop-blur-lg tablet:border-0 tablet:bg-color_bg_1 tablet:p-0">
        <div className={cx('hidden tablet:block')}>
          <Radio.Group onChange={(e) => setActiveTab(e.target.value)} value={activeTab}>
            {tabs.map((tab) => (
              <Radio.Button value={tab.id} key={tab.id}>
                {tab.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
        <Tabs
          activeKey={activeTab}
          // className={styles.tabs}
          onChange={(key) => setActiveTab(key)}
          tabBarExtraContent={{
            right: (
              <div className="flex gap-4 tablet:flex-col-reverse">
                {/* Mobile */}
                <div className="hidden gap-2 tablet:flex">
                  <SelectInput
                    className={
                      "relative !w-1/2 before:absolute before:top-2 before:left-3 before:z-10 before:text-color_text_2 before:content-['Sort_by'] tablet:before:top-[14px]"
                    }
                    value={poolFilter.sortBy[poolFilter.sortBy.length - 1].field}
                    options={SortOptions()}
                    onChange={(val) => onUpdateSorter(val)}
                  />
                  <SelectInput
                    className={
                      "relative !w-1/2 before:absolute before:top-2 before:left-3 before:z-10 before:text-color_text_2 before:content-['Time_Basis'] tablet:before:top-[14px]"
                    }
                    value={poolFilter.timeBasis}
                    options={filterOptions}
                    onChange={(val) => onUpdateFilter(val, 'timeBasis')}
                  />
                </div>
                {/* Desktop */}
                <SelectInput
                  className={
                    "relative !w-1/2 before:absolute before:top-2 before:left-3 before:z-10 before:text-color_text_2 before:content-['Time_Basis'] tablet:hidden"
                  }
                  value={poolFilter.timeBasis}
                  options={filterOptions}
                  onChange={(val) => onUpdateFilter(val, 'timeBasis')}
                />
                <SearchInput
                  className={'w-1/2 tablet:mt-4 tablet:w-full'}
                  value={poolFilter.text}
                  onChange={(val) => onUpdateFilter(val, 'text')}
                  onSearch={() => {}}
                />
              </div>
            )
          }}
          items={renderTabContents()}
        />
      </div>
      <ObricModal
        onCancel={() => dispatch(poolAction.TOGGLE_LIQUIDITY_MODAL(null))}
        className=""
        // wrapClassName={styles.modal}
        open={!!liquidityModal}
        closeIcon={<CancelIcon />}
        width={512}
        destroyOnClose>
        {liquidityModal &&
          (liquidityModal.type === 'add' ? (
            <AddLiquidity liquidityPool={liquidityModal.pool} />
          ) : (
            <WithdrawLiquidity liquidityPool={liquidityModal.pool} />
          ))}
      </ObricModal>
    </div>
  );
};

export default Pool;
