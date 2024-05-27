import poolAction from 'modules/pool/actions';
import { getLiquidityModal } from 'modules/pool/reducer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Radio, Tabs } from 'components/Antd';
import BitcowModal from 'components/BitcowModal';
import PixelButton from 'components/PixelButton';
import { numberCompactFormat } from 'components/PositiveFloatNumInput/numberFormats';
import SearchInput from 'components/SearchInput';
import SelectInput from 'components/SelectInput';
import { useBreakpoint } from 'hooks/useBreakpoint';
import usePools from 'hooks/usePools';
import { PlusIcon } from 'resources/icons';
import { ReactComponent as CloseIcon } from 'resources/icons/pixelClose.svg';

import AddLiquidity from './components/AddLiquidity';
import CreatePool from './components/CreatePool';
import PoolTable from './components/PoolTable';
import WithdrawLiquidity from './components/WithdrawLiquidity';
import styles from './index.module.scss';

import useMerlinWallet from '../../hooks/useMerlinWallet';
import useNetwork from '../../hooks/useNetwork';
import { IPool } from '../../sdk';

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
    coinPrices: coinInPools,
    setPoolFilter,
    poolFilter,
    getTotalPoolsTVL,
    getTotalPoolsVolume,
    isLoadingPool
  } = usePools();
  const { currentNetwork } = useNetwork();
  const [activeTab, setActiveTab] = useState('1');
  const [isCreatePoolOpen, setIsCreatePoolOpen] = useState(false);
  const dispatch = useDispatch();
  const [filteredPools, setFilteredPools] = useState(activePools);
  const liquidityModal = useSelector(getLiquidityModal);
  const { isTablet } = useBreakpoint('tablet');

  const { wallet, initProvider, bitcowSDK } = useMerlinWallet();

  useEffect(() => {
    initProvider('pool');
  }, [initProvider]);

  const sortPoolsByFilter = useCallback(
    (poolsToSort: IPool[]) => {
      let currentPools = poolsToSort;
      if (poolFilter.text) {
        currentPools = currentPools.filter((pool) =>
          [pool.token0.symbol, pool.token1.symbol]
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
    <div className="flex items-start text-2xl text-bc-white tablet:flex-col">
      <h2 className="flex items-center font-micro text-4xl text-white tablet:text-2xl">Pools</h2>

      <div className="ml-auto flex items-start gap-2 font-pgb text-lg text-bc-gold">
        <div className="flex items-center">
          <img src="/images/coin.gif" alt="coin" className="h-6 w-[22px]" />
          <p>TVL :</p>
          <div className="ml-1">
            ${' '}
            {isTablet
              ? numberCompactFormat(getTotalPoolsTVL())
              : numberCompactFormat(getTotalPoolsTVL(), 1)}
          </div>
        </div>

        <div className="flex items-center pl-6">
          <img src="/images/coin.gif" alt="coin" className="h-6 w-[22px]" />
          <p>Volume 24H :</p>
          <div className="ml-1">
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

  const tabs = useMemo(() => {
    if (currentNetwork && currentNetwork.fetchAllTokenBalance) {
      return [
        {
          id: '1',
          label: 'Liquidity Pools'
        },
        {
          id: '2',
          label: 'My Position'
        }
      ];
    } else {
      return [
        {
          id: '1',
          label: 'Liquidity Pools'
        }
      ];
    }
  }, [currentNetwork]);

  const renderTabContents = useCallback(() => {
    return tabs.map((tab) => {
      let currentPools = filteredPools;
      if (tab.id === '2') {
        currentPools = currentPools.filter((pool) => checkIfInvested(pool));
      }
      return {
        label: tab.label,
        key: tab.id,
        children: (
          <PoolTable
            activePools={currentPools}
            viewOwned={tab.id === '2'}
            isLoading={isLoadingPool}
          />
        )
      };
    });
  }, [filteredPools, checkIfInvested, tabs, isLoadingPool]);

  return (
    <div className="mt-11 flex h-fit max-w-[1134px] flex-col bg-bc-pool p-9 text-bc-white shadow-bc-swap backdrop-blur-lg tablet:mt-4">
      {renderHeader()}
      <div className="pt-6 tablet:border-0 tablet:p-0">
        <div className={'mt-6 hidden tablet:block'}>
          <Radio.Group onChange={(e) => setActiveTab(e.target.value)} value={activeTab}>
            {tabs.map((tab) => (
              <Radio.Button value={tab.id} key={tab.id} className="bg-transparent font-pg text-lg">
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
              <div className="flex tablet:flex-col-reverse">
                {/* Mobile */}
                <div className="hidden gap-2 tablet:flex">
                  <SelectInput
                    className={
                      "relative !w-1/2 font-pg text-lg before:absolute before:top-3 before:left-3 before:z-10 before:font-pg before:text-white before:content-['Sort_by']"
                    }
                    value={poolFilter.sortBy[poolFilter.sortBy.length - 1].field}
                    options={SortOptions()}
                    onChange={(val) => onUpdateSorter(val)}
                  />
                  <SelectInput
                    className={
                      "relative !w-1/2 font-pg text-lg before:absolute before:top-3 before:left-3 before:z-10 before:font-pg before:text-white before:content-['Time_Basis']"
                    }
                    value={poolFilter.timeBasis}
                    options={filterOptions}
                    onChange={(val) => onUpdateFilter(val, 'timeBasis')}
                  />
                </div>
                {/* Desktop */}
                {/*
                <SelectInput
                  className={
                    "relative !w-1/2 !bg-transparent before:absolute before:top-2 before:left-3 before:z-10 before:text-bc-white before:content-['Time_Basis'] tablet:hidden"
                  }
                  value={poolFilter.timeBasis}
                  networks={filterOptions}
                  onChange={(val) => onUpdateFilter(val, 'timeBasis')}
                />
                */}
                <div className="flex flex-wrap items-center justify-end tablet:my-4">
                  <SearchInput
                    placeholder="Name or address"
                    className={'w-[220px] font-pg'}
                    value={poolFilter.text}
                    onChange={(val) => onUpdateFilter(val, 'text')}
                    onSearch={() => {}}
                  />
                  {wallet && bitcowSDK && bitcowSDK.pairV1Manager && (
                    <PixelButton
                      width={126}
                      borderWidth={2}
                      height={34}
                      className="ml-3 font-pg text-lg text-blue1"
                      color="rgba(255, 255, 255, 0.8)"
                      isSolid
                      onClick={() => setIsCreatePoolOpen(true)}>
                      <PlusIcon className="mr-2" width={11} height={11} />
                      New Pool
                    </PixelButton>
                  )}
                </div>
              </div>
            )
          }}
          items={renderTabContents()}
        />
      </div>
      <BitcowModal
        onCancel={() => dispatch(poolAction.TOGGLE_LIQUIDITY_MODAL(null))}
        maskClosable={false}
        open={!!liquidityModal}
        closeIcon={<CloseIcon className="relative top-4" />}
        bodyStyle={{ padding: 0 }}
        width={512}
        destroyOnClose>
        {liquidityModal &&
          (liquidityModal.type === 'add' ? (
            <AddLiquidity liquidityPool={liquidityModal.pool} />
          ) : (
            <WithdrawLiquidity liquidityPool={liquidityModal.pool} />
          ))}
      </BitcowModal>
      <BitcowModal
        width={652}
        onCancel={() => setIsCreatePoolOpen(false)}
        open={isCreatePoolOpen}
        bodyStyle={{ padding: 0 }}
        closeIcon={<CloseIcon className="top-4" />}
        destroyOnClose>
        <CreatePool onClose={() => setIsCreatePoolOpen(false)}></CreatePool>
      </BitcowModal>
    </div>
  );
};

export default Pool;
