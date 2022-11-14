import poolAction from 'modules/pool/actions';
import { getLiquidityModal } from 'modules/pool/reducer';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Tabs } from 'components/Antd';
import HippoModal from 'components/HippoModal';
import SearchInput from 'components/SearchInput';
import SelectInput from 'components/SelectInput';
import { CancelIcon } from 'resources/icons';

import AddLiquidity from './components/AddLiquidity';
import PoolTable from './components/PoolTable';
import WithdrawLiquidity from './components/WithdrawLiquidity';
import styles from './Pool.module.scss';
import usePools from 'hooks/usePools';

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
    timeBasis: '7D'
  });
  const { activePools, checkIfInvested } = usePools();
  const dispatch = useDispatch();
  const liquidityModal = useSelector(getLiquidityModal);

  const renderHeader = () => (
    <div className="mb-8 flex justify-between">
      <div className="font-Furore text-2xl text-white">Pools</div>
      <div className="flex gap-2 text-gray_05">
        <div className="flex items-center gap-2">
          <div className="">TVL :</div>
          <div className="text-white">$197,995,519.01</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="">Volume24H :</div>
          <div className="text-white">$15,704,982.3</div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    {
      id: '1',
      label: 'Liquidity Pools'
    },
    {
      id: '2',
      label: 'My Position'
    }
  ];

  const onUpdateFilter = (val: string, field: string) => {
    setFilter((prevState) => ({
      ...prevState,
      [field]: val
    }));
  };

  return (
    <div className="mt-[100px] flex flex-col">
      {renderHeader()}
      <div className="border-[1px] border-[#272A2C] bg-black py-8 backdrop-blur-lg">
        <Tabs
          defaultActiveKey="1"
          className={styles.tabs}
          tabBarExtraContent={{
            right: (
              <div className="flex gap-4">
                <SelectInput
                  className={
                    "relative w-1/2 before:absolute before:top-2 before:left-3 before:z-10 before:text-gray_05 before:content-['TimeBasis']"
                  }
                  value={filter.timeBasis}
                  options={filterOptions}
                  onChange={(val) => onUpdateFilter(val, 'timeBasis')}
                />
                <SearchInput
                  className={'w-1/2'}
                  value={filter.text}
                  onChange={(val) => onUpdateFilter(val, 'text')}
                  onSearch={() => {}}
                />
              </div>
            )
          }}
          items={tabs.map((tab) => {
            let currentPools = activePools;
            if (tab.id === '2') {
              currentPools = currentPools.filter((pool) => checkIfInvested(pool.id));
            }
            return {
              label: tab.label,
              key: tab.id,
              children: <PoolTable activePools={currentPools} />
            };
          })}
        />
      </div>
      <HippoModal
        onCancel={() => dispatch(poolAction.TOGGLE_LIQUIDITY_MODAL(null))}
        className=""
        // wrapClassName={styles.modal}
        open={!!liquidityModal}
        footer={null}
        closeIcon={<CancelIcon className="opacity-30 hover:opacity-100" />}
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
