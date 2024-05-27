import { useFormikContext } from 'formik';
import VirtualList from 'rc-virtual-list';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Input, List } from 'components/Antd';
import useMerlinWallet from 'hooks/useMerlinWallet';
import usePools from 'hooks/usePools';
import { ISwapSettings } from 'pages/Swap/types';
import { SearchIcon } from 'resources/icons';
import { FilteredToken } from 'types/bitcow';

import CoinRow from './CoinRow';
import CommonCoinButton from './CommonCoinButton';

import { SearchPairMessage, TokenInfo } from '../../../../sdk';
import { bigintTokenBalanceToNumber } from '../../../../utils/formatter';
import { saveLocalPairMessages } from '../../../../utils/localPools';

interface TProps {
  actionType: 'currencyTo' | 'currencyFrom';
  onClose: () => void;
}

const CoinSelector: React.FC<TProps> = ({ onClose, actionType }) => {
  const { values, setFieldValue } = useFormikContext<ISwapSettings>();
  const { bitcowSDK, tokenList, tokenBalances, setNeedBalanceTokens, createBitcowSDK } =
    useMerlinWallet();
  const { coinPrices } = usePools();
  const commonCoins = useMemo(() => {
    return tokenList
      ? tokenList.filter((token) => {
          return ['wBTC', 'WBTC', 'BTC', 'bitusd', 'USDT'].includes(token.symbol);
        })
      : [];
  }, [tokenList]);
  const [filter, setFilter] = useState<string>('');
  const [tokenListBalance, setTokenListBalance] = useState<FilteredToken[]>();
  const [searchedPairMessages, setSearchedPairMessages] = useState<SearchPairMessage[]>();

  const onSelectToken = useCallback(
    (token: TokenInfo, searched = false) => {
      if (searched) {
        if (saveLocalPairMessages(bitcowSDK.config.chainId, searchedPairMessages)) {
          createBitcowSDK();
        }
        setFilter('');
      }
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
    [
      actionType,
      values,
      setFieldValue,
      onClose,
      setNeedBalanceTokens,
      tokenBalances,
      searchedPairMessages,
      bitcowSDK,
      createBitcowSDK
    ]
  );

  const filterTokenList = useCallback(() => {
    if (filter.length === 42) {
      return;
    }
    if (coinPrices) {
      let currentTokenList = tokenList
        ? tokenList
            .sort((a, b) => (a.symbol <= b.symbol ? -1 : 1))
            .map((t) => {
              const balance = tokenBalances
                ? tokenBalances[t.address] !== undefined
                  ? bigintTokenBalanceToNumber(t, tokenBalances[t.address])
                  : 0
                : -1;

              const value = coinPrices[t.symbol] * balance;
              return {
                token: t,
                balance,
                value,
                searched: false
              };
            })
            .sort((a, b) => {
              if (a.value > 0 && b.value > 0) {
                return b.value - a.value;
              } else if (a.value > 0 && b.value === 0) {
                return -a.value;
              } else if (a.value === 0 && b.value > 0) {
                return b.value;
              } else if (a.value === 0 && b.value === 0) {
                return b.balance - a.balance;
              }
            })
        : [];
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
    filterTokenList();
  }, [filterTokenList]);

  const filterTokenListWithTokenAddress = useCallback(async () => {
    if (filter.length != 42) {
      return;
    }
    setTokenListBalance([]);
    if (bitcowSDK && bitcowSDK.pairV1Manager) {
      const searchPairMessages = await bitcowSDK.pairV1Manager.searchPairsAll(filter, 100);
      if (searchPairMessages.length > 0) {
        const pairMessage = searchPairMessages[0];
        let tokenInfo: TokenInfo;
        if (pairMessage.xTokenInfo.address.toLowerCase() === filter.toLowerCase()) {
          tokenInfo = pairMessage.xTokenInfo;
        } else {
          tokenInfo = pairMessage.yTokenInfo;
        }
        // value=-1 means search token info
        setTokenListBalance([{ token: tokenInfo, balance: -2, value: 0, searched: true }]);
        setSearchedPairMessages(searchPairMessages);
      }
    }
  }, [bitcowSDK, filter]);

  useEffect(() => {
    filterTokenListWithTokenAddress();
  }, [filterTokenListWithTokenAddress]);

  const renderHeaderSearch = useMemo(() => {
    return (
      <div className="flex flex-col font-pg">
        <h2 className="border-b border-white/20 pb-3 font-micro text-2xl text-white">Token</h2>
        <div className="searchInput relative mt-6">
          <Input
            suffix={<SearchIcon className="fill-bc-white-60 tablet:w-6" />}
            className="h-9 w-full p-2 text-lg"
            value={filter}
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            placeholder="Search name or paste address"
          />
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
        className="max-h-[408px] overflow-y-scroll border border-white/40 bg-black/10 no-scrollbar"
        rowKey={(item) => `list-row-${(item as TokenInfo).address}`}>
        <VirtualList
          data={tokenListBalance || []}
          itemKey={(item) => `list-item-${item.token.address}`}>
          {(item) => (
            <List.Item
              className="cursor-pointer !border-0 !px-0 !py-2 font-pg hover:bg-white/10 active:bg-black/10"
              onClick={() => onSelectToken(item.token, item.searched)}>
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
