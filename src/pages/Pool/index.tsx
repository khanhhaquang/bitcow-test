/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tabs } from 'components/Antd';
import SelectInput from 'components/SelectInput';
import { useState } from 'react';
import PoolTable from './components/PoolTable';
import SearchInput from 'components/SearchInput';
import styles from './Pool.module.scss';
import { IPoolItem } from './types';

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

  const data: IPoolItem[] = [
    {
      id: '1',
      liquidity: 29925054,
      volumn7D: 20418784,
      token0: {
        id: '001',
        symbol: 'devUSDT',
        name: 'USDT'
      },
      token1: {
        id: '002',
        symbol: 'devBTC',
        name: 'BTC'
      },
      fees7D: 44921,
      apr7D: 7.83,
      invested: true
    },
    {
      id: '2',
      liquidity: 29925054,
      volumn7D: 20418784,
      token0: {
        id: '001',
        symbol: 'devUSDT',
        name: 'USDT'
      },
      token1: {
        id: '002',
        symbol: 'devBTC',
        name: 'BTC'
      },
      fees7D: 44921,
      apr7D: 7.83,
      invested: true
    },
    {
      id: '3',
      liquidity: 29925054,
      volumn7D: 20418784,
      token0: {
        id: '001',
        symbol: 'devUSDT',
        name: 'USDT'
      },
      token1: {
        id: '002',
        symbol: 'devBTC',
        name: 'BTC'
      },
      fees7D: 44921,
      apr7D: 7.83,
      invested: true
    }
  ];

  const renderHeader = () => (
    <div className="flex justify-between mb-8">
      <div className="font-Furore text-2xl text-white">Pools</div>
      <div className="flex gap-2 text-gray_05">
        <div className="flex gap-2 items-center">
          <div className="">TVL :</div>
          <div className="text-white">$197,995,519.01</div>
        </div>
        <div className="flex gap-2 items-center">
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
    <div className="flex flex-col mt-[100px]">
      {renderHeader()}
      <div className="py-11 px-8 bg-black border-[1px] border-[#272A2C] backdrop-blur-lg">
        <Tabs
          defaultActiveKey="1"
          className={styles.tabs}
          tabBarExtraContent={{
            right: (
              <div className="flex gap-4">
                <SelectInput
                  className={
                    "w-1/2 relative before:content-['TimeBasis'] before:absolute before:text-gray_05 before:top-2 before:left-3 before:z-10"
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
            return {
              label: tab.label,
              key: tab.id,
              children: <PoolTable data={data} />
            };
          })}
        />
      </div>
    </div>
  );
};

export default Pool;
