import cx from 'classnames';
import poolAction from 'modules/pool/actions';
import { getLiquidityModal } from 'modules/pool/reducer';
import { useCallback, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Radio, Tabs } from 'components/Antd';
import HippoModal from 'components/HippoModal';
import SearchInput from 'components/SearchInput';
import SelectInput from 'components/SelectInput';
import usePools from 'hooks/usePools';
import { CancelIcon } from 'resources/icons';

import AddLiquidity from './components/AddLiquidity';
import PoolTable from './components/PoolTable';
import WithdrawLiquidity from './components/WithdrawLiquidity';
import styles from './Pool.module.scss';

const SortOptions = [
  {
    label: 'Liquidity',
    value: 'liquidity'
  },
  {
    label: 'Volume 7D',
    value: 'volumn7D'
  },
  {
    label: 'Fees 7D',
    value: 'fees7D'
  },
  {
    label: 'Apr 7D',
    value: 'apr7D'
  }
];

const filterOptions = [
  {
    label: '24H',
    value: '24H'
  },
  {
    label: '7D',
    value: '7D'
  },
  {
    label: '30D',
    value: '30D'
  }
];

const Pool = () => {
  const [filter, setFilter] = useState({
    text: '',
    timeBasis: '7D',
    sortBy: 'liquidity'
  });
  const { activePools, checkIfInvested } = usePools();
  const [activeTab, setActiveTab] = useState('1');
  const dispatch = useDispatch();
  const liquidityModal = useSelector(getLiquidityModal);

  const renderHeader = () => (
    <div className="mb-8 flex justify-between tablet:flex-col">
      <div className="font-Furore text-2xl text-white tablet:text-lg">Pools</div>
      <div className="flex gap-2 text-gray_05 tablet:mt-4">
        <div className="flex items-center gap-2 bg-gray_bg px-6 py-[18px] tablet:w-1/2 tablet:grow tablet:flex-col-reverse tablet:p-4 tablet:text-gray_05">
          <div className="">
            TVL <span className="tablet:hidden">:</span>
          </div>
          <div className="text-white tablet:text-[32px]">-</div>
        </div>
        <div className="flex items-center gap-2 bg-gray_bg py-[18px] px-6 tablet:w-1/2 tablet:grow tablet:flex-col-reverse tablet:p-4 tablet:text-gray_05">
          <div className="">
            Volume24H <span className="tablet:hidden">:</span>
          </div>
          <div className="text-white tablet:text-[32px]">-</div>
        </div>
      </div>
    </div>
  );

  const onUpdateFilter = (val: string, field: string) => {
    setFilter((prevState) => ({
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
      let currentPools = activePools;
      if (tab.id === '2') {
        currentPools = currentPools.filter((pool) => checkIfInvested(pool.id));
      }
      return {
        label: tab.label,
        key: tab.id,
        children: <PoolTable activePools={currentPools} viewOwned={tab.id === '2'} />
      };
    });
  }, [activePools, checkIfInvested, tabs]);

  return (
    <div className="mt-[100px] flex flex-col tablet:mt-4">
      {renderHeader()}
      <div className="border-[1px] border-[#272A2C] bg-black py-8 backdrop-blur-lg tablet:border-0 tablet:p-0">
        <div className={cx('hidden tablet:block', styles.radioGroup)}>
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
          className={styles.tabs}
          onChange={(key) => setActiveTab(key)}
          tabBarExtraContent={{
            right: (
              <div className="flex gap-4 tablet:flex-col-reverse">
                {/* Mobile */}
                <div className="hidden gap-2 tablet:flex">
                  <SelectInput
                    className={
                      "relative w-1/2 before:absolute before:top-2 before:left-3 before:z-10 before:text-gray_05 before:content-['Sort_by'] tablet:before:top-[14px]"
                    }
                    value={filter.sortBy}
                    options={SortOptions}
                    onChange={(val) => onUpdateFilter(val, 'sortBy')}
                  />
                  <SelectInput
                    className={
                      "relative w-1/2 before:absolute before:top-2 before:left-3 before:z-10 before:text-gray_05 before:content-['Time_Basis'] tablet:before:top-[14px]"
                    }
                    value={filter.timeBasis}
                    options={filterOptions}
                    onChange={(val) => onUpdateFilter(val, 'timeBasis')}
                  />
                </div>
                {/* Desktop */}
                <SelectInput
                  className={
                    "relative w-1/2 before:absolute before:top-2 before:left-3 before:z-10 before:text-gray_05 before:content-['Time_Basis'] tablet:hidden"
                  }
                  value={filter.timeBasis}
                  options={filterOptions}
                  onChange={(val) => onUpdateFilter(val, 'timeBasis')}
                />
                <SearchInput
                  className={'w-1/2 tablet:mt-4 tablet:w-full'}
                  value={filter.text}
                  onChange={(val) => onUpdateFilter(val, 'text')}
                  onSearch={() => {}}
                />
              </div>
            )
          }}
          items={renderTabContents()}
        />
      </div>
      <HippoModal
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
      </HippoModal>
    </div>
  );
};

export default Pool;
