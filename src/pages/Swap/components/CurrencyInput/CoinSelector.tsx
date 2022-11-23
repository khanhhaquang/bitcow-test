import { RawCoinInfo } from '@manahippo/coin-list';
import { useFormikContext } from 'formik';
import VirtualList from 'rc-virtual-list';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Input, List } from 'components/Antd';
import useAptosWallet from 'hooks/useAptosWallet';
import useCoinStore, { CoinInfo } from 'hooks/useCoinStore';
import usePools from 'hooks/usePools';
import { ISwapSettings } from 'pages/Swap/types';
import { SearchIcon } from 'resources/icons';
import { TokenBalance } from 'types/obric';

import CoinRow from './CoinRow';
import CommonCoinButton from './CommonCoinButton';

interface TProps {
  actionType: 'currencyTo' | 'currencyFrom';
  dismissiModal: () => void;
}

const CoinSelector: React.FC<TProps> = ({ dismissiModal, actionType }) => {
  const { values, setFieldValue } = useFormikContext<ISwapSettings>();
  const { tokenList, activeWallet } = useAptosWallet();
  const { coinInPools } = usePools();
  const commonCoins = tokenList.filter((token) => {
    return ['APT', 'USDT', 'USDC'].includes(token.symbol);
  });
  const [filter, setFilter] = useState<string>('');
  const { coinStore } = useCoinStore();
  const [tokenListBalance, setTokenListBalance] = useState<TokenBalance[]>();

  const onSelectToken = useCallback(
    (token: RawCoinInfo) => {
      const otherActionType: TProps['actionType'] =
        actionType === 'currencyFrom' ? 'currencyTo' : 'currencyFrom';
      if (token.symbol === values[otherActionType]?.token?.symbol) {
        setFieldValue(otherActionType, {
          ...values[otherActionType],
          token: values[actionType]?.token
        });
      }
      setFieldValue(actionType, {
        ...values[actionType],
        token
      });
      dismissiModal();
    },
    [actionType, values, setFieldValue, dismissiModal]
  );

  const getFilteredTokenListWithBalance = useCallback(() => {
    if (coinInPools) {
      let currentTokenList = tokenList
        ?.filter((token) => coinInPools[token.symbol])
        .sort((a, b) => (a.symbol <= b.symbol ? -1 : 1))
        .map((t) => {
          const tokenStore = (coinStore || {})[t.token_type.type];
          const balance = !activeWallet
            ? -1
            : tokenStore
            ? (tokenStore.data as CoinInfo).coin.value / Math.pow(10, t.decimals)
            : 0;
          return {
            token: t,
            balance
          };
        })
        .sort((a, b) => b.balance - a.balance); // TODO: sort by values

      if (filter) {
        currentTokenList = currentTokenList?.filter((token) => {
          const keysForFilter = [token.token.name, token.token.symbol].join(',').toLowerCase();
          return keysForFilter.includes(filter);
        });
      }
      setTokenListBalance(currentTokenList);
    }
  }, [activeWallet, coinInPools, coinStore, filter, tokenList]);

  useEffect(() => {
    getFilteredTokenListWithBalance();
  }, [getFilteredTokenListWithBalance]);

  const renderHeaderSearch = useMemo(() => {
    return (
      <div className="flex flex-col gap-2 font-Rany text-item_black dark:text-white tablet:gap-0">
        <div className="text-lg tablet:px-5 tablet:py-[22px] tablet:leading-5">Select a token</div>
        <hr className="my-4 h-[1px] border-0 bg-white_color_list_hover dark:bg-color_list_hover tablet:my-0" />
        <div className="relative tablet:mx-5 tablet:mt-6 tablet:mb-4">
          <Input
            className="w-full !border-[1px] !border-white_table bg-white_table py-5 px-4 text-base text-item_black dark:!border-gray_008 dark:bg-color_bg_2 dark:text-color_text_2 tablet:py-[18px] tablet:text-base tablet:leading-4"
            value={filter}
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            placeholder="Search name or paste address"
          />
          <SearchIcon className="absolute top-1/2 right-[14px] -translate-y-1/2 fill-item_black dark:fill-[#D9D9D9]" />
        </div>
        <div className="mt-2 mb-2 flex flex-wrap gap-2 tablet:px-5">
          {commonCoins.map((coin) => (
            <CommonCoinButton
              coin={coin}
              key={`common-coin-${coin.symbol}`}
              onClickToken={() => onSelectToken(coin)}
            />
          ))}
        </div>
      </div>
    );
  }, [filter, onSelectToken, commonCoins]);

  const renderTokenList = useMemo(() => {
    return (
      <List
        className="h-[354px] overflow-y-scroll border-0 bg-white_table p-2 no-scrollbar dark:bg-color_bg_2 tablet:mx-5 tablet:mb-6"
        rowKey={(item) => `list-row-${(item as RawCoinInfo).symbol}`}>
        <VirtualList
          data={tokenListBalance || []}
          itemKey={(item) => `list-item-${item.token.symbol}`}>
          {(item) => (
            <List.Item
              className="cursor-pointer !border-0 !px-0 !py-2"
              onClick={() => onSelectToken(item.token)}>
              <CoinRow item={item} />
            </List.Item>
          )}
        </VirtualList>
      </List>
    );
  }, [tokenListBalance, onSelectToken]);

  return (
    <div className="flex flex-col gap-2">
      {renderHeaderSearch}
      {renderTokenList}
    </div>
  );
};

export default CoinSelector;
