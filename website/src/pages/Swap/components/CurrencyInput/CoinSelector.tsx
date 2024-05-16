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

import { TokenInfo } from '../../../../sdk';
import { bigintTokenBalanceToNumber } from '../../../../utils/formatter';

interface TProps {
  actionType: 'currencyTo' | 'currencyFrom';
  onClose: () => void;
}

const CoinSelector: React.FC<TProps> = ({ onClose, actionType }) => {
  const { values, setFieldValue } = useFormikContext<ISwapSettings>();
  const { tokenList, tokenBalances, setNeedBalanceTokens } = useMerlinWallet();
  const { coinPrices } = usePools();
  const commonCoins = useMemo(() => {
    return tokenList
      ? tokenList.filter((token) => {
          return ['wBTC', 'bitusd'].includes(token.symbol);
        })
      : [];
  }, [tokenList]);
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
      if (tokenBalances[token.address] === undefined) {
        setNeedBalanceTokens([token.address]);
      }
      onClose();
    },
    [actionType, values, setFieldValue, onClose, setNeedBalanceTokens, tokenBalances]
  );

  const getFilteredTokenListWithBalance = useCallback(() => {
    if (coinPrices) {
      let currentTokenList = tokenList
        ? tokenList
            .sort((a, b) => (a.symbol <= b.symbol ? -1 : 1))
            .map((t) => {
              const balance = tokenBalances
                ? tokenBalances[t.address] !== undefined
                  ? bigintTokenBalanceToNumber(t, tokenBalances[t.address])
                  : -2
                : -1;
              return {
                token: t,
                balance
              };
            })
            .sort((a, b) => b.balance - a.balance)
        : []; // TODO: sort by values

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
  }, [coinPrices, filter, tokenList, tokenBalances]);

  useEffect(() => {
    getFilteredTokenListWithBalance();
  }, [getFilteredTokenListWithBalance]);

  const renderHeaderSearch = useMemo(() => {
    return (
      <div className="flex flex-col font-pg">
        <h2 className="border-b border-white/20 pb-3 font-micro text-2xl text-white">Token</h2>
        <div className="relative mt-6">
          <Input
            className="h-9 w-full !bg-black/10 p-2 text-lg text-bc-white outline-none"
            value={filter}
            bordered={false}
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            placeholder="Search name or paste address"
          />
          <SearchIcon className="absolute top-1/2 right-[14px] -translate-y-1/2 fill-bc-white-60" />
        </div>
        <div className="my-3 flex flex-wrap gap-2">
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
        className="max-h-[354px] overflow-y-scroll border border-white/40 bg-black/10 no-scrollbar"
        rowKey={(item) => `list-row-${(item as TokenInfo).address}`}>
        <VirtualList
          data={tokenListBalance || []}
          itemKey={(item) => `list-item-${item.token.address}`}>
          {(item) => (
            <List.Item
              className="cursor-pointer !border-0 !px-0 !py-2 font-pg hover:bg-white/10 active:bg-black/10"
              onClick={() => onSelectToken(item.token)}>
              <CoinRow item={item} />
            </List.Item>
          )}
        </VirtualList>
      </List>
    );
  }, [tokenListBalance, onSelectToken]);

  return (
    <div className="flex flex-col gap-2 bg-bc-swap px-4 pt-4 pb-6 text-white">
      {renderHeaderSearch}
      {renderTokenList}
    </div>
  );
};

export default CoinSelector;
