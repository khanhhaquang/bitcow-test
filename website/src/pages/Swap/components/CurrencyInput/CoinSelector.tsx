import { TokenInfo } from 'bitcow';
import { useFormikContext } from 'formik';
import VirtualList from 'rc-virtual-list';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Input, List } from 'components/Antd';
import useMerlinWallet from 'hooks/useMerlinWallet';
import usePools from 'hooks/usePools';
import { ISwapSettings } from 'pages/Swap/types';
import { SearchIcon } from 'resources/icons';
import { TokenBalance } from 'types/bitcow';

import CoinRow from './CoinRow';
import CommonCoinButton from './CommonCoinButton';

interface TProps {
  actionType: 'currencyTo' | 'currencyFrom';
  dismissiModal: () => void;
}

const CoinSelector: React.FC<TProps> = ({ dismissiModal, actionType }) => {
  const { values, setFieldValue } = useFormikContext<ISwapSettings>();
  const { tokenList, tokenBalances } = useMerlinWallet();
  const { coinPrices: coinInPools } = usePools();
  const commonCoins = tokenList.filter((token) => {
    return ['wBTC', 'bitusd'].includes(token.symbol);
  });
  const [filter, setFilter] = useState<string>('');
  const [tokenListBalance, setTokenListBalance] = useState<TokenBalance[]>();

  const onSelectToken = useCallback(
    (token: TokenInfo) => {
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
        .sort((a, b) => (a.symbol <= b.symbol ? -1 : 1))
        .map((t) => {
          const balance = tokenBalances ? tokenBalances[t.address] : -1;
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
    } else {
      setTokenListBalance([]);
    }
  }, [coinInPools, filter, tokenList, tokenBalances]);

  useEffect(() => {
    getFilteredTokenListWithBalance();
  }, [getFilteredTokenListWithBalance]);

  const renderHeaderSearch = useMemo(() => {
    return (
      <div className="flex flex-col gap-2  tablet:gap-0">
        <div className="text-lg tablet:px-5 tablet:py-[22px] tablet:leading-5">Select a token</div>
        <hr className="my-4 h-[1px] border-0 bg-bc-white-20 tablet:my-0" />
        <div className="relative tablet:mx-5 tablet:mt-6 tablet:mb-4">
          <Input
            className="h-15 w-full !bg-bc-input py-5 px-4 text-base leading-4 text-bc-white outline-none tablet:py-[18px] tablet:text-base tablet:leading-4"
            value={filter}
            bordered={false}
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            placeholder="Search name or paste address"
          />
          <SearchIcon className="absolute top-1/2 right-[14px] -translate-y-1/2 fill-bc-white-60" />
        </div>
        <div className="mt-2 mb-2 flex flex-wrap gap-2 tablet:px-5">
          {commonCoins.map((coin) => (
            <CommonCoinButton
              coin={coin}
              key={`common-coin-${coin.address}`}
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
        className="max-h-[354px] overflow-y-scroll border-2 border-bc-orange bg-bc-grey-transparent2 no-scrollbar tablet:mx-5 tablet:mb-6"
        rowKey={(item) => `list-row-${(item as TokenInfo).address}`}>
        <VirtualList
          data={tokenListBalance || []}
          itemKey={(item) => `list-item-${item.token.address}`}>
          {(item) => (
            <List.Item
              className="cursor-pointer !border-0 !px-0 !py-2 hover:bg-bc-white-10"
              onClick={() => onSelectToken(item.token)}>
              <CoinRow item={item} />
            </List.Item>
          )}
        </VirtualList>
      </List>
    );
  }, [tokenListBalance, onSelectToken]);

  return (
    <div className="flex flex-col gap-2 bg-bc-swap p-5 text-bc-white">
      {renderHeaderSearch}
      {renderTokenList}
    </div>
  );
};

export default CoinSelector;
