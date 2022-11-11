/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RawCoinInfo } from '@manahippo/coin-list';
import { useFormikContext } from 'formik';
import { getTokenList } from 'modules/swap/reducer';
import VirtualList from 'rc-virtual-list';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { Input, List } from 'components/Antd';
import useAptosWallet from 'hooks/useAptosWallet';
import useCoinStore, { CoinInfo } from 'hooks/useCoinStore';
import { ISwapSettings } from 'pages/Swap/types';
import { TokenBalance } from 'types/hippo';

import CoinRow from './CoinRow';
import CommonCoinButton from './CommonCoinButton';
// import useHippoClient from 'hooks/useHippoClient';
// import { TokenInfo } from '@manahippo/hippo-sdk/dist/generated/coin_registry/coin_registry';

interface TProps {
  actionType: 'currencyTo' | 'currencyFrom';
  // isVisible: boolean;
  dismissiModal: () => void;
}

// interface TokenWithBalance extends ITokenInfo {
//   balance: string;
// }

const CoinSelector: React.FC<TProps> = ({ dismissiModal, actionType }) => {
  const { values, setFieldValue } = useFormikContext<ISwapSettings>();
  const { tokenList, activeWallet } = useAptosWallet();
  const commonCoins = tokenList.filter((token) => {
    return ['APT', 'WBTC', 'WETH', 'USDT', 'USDC'].includes(token.symbol);
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

  // const filteredTokenList = useMemo(() => {
  //   if (!filter) return tokenList;
  //   return tokenList.filter((token) => {
  //     const keysForFilter = [token.name, token.symbol, token.address].join(',').toLowerCase();
  //     return keysForFilter.includes(filter);
  //   });
  // }, [tokenList, filter]);

  const getFilteredTokenListWithBalance = useCallback(() => {
    let currentTokenList = tokenList
      ?.sort((a, b) => (a.symbol <= b.symbol ? -1 : 1))
      .map((t) => {
        const tokenStore = coinStore[t.token_type.type];
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
  }, [activeWallet, coinStore, filter, tokenList]);

  useEffect(() => {
    getFilteredTokenListWithBalance();
  }, [getFilteredTokenListWithBalance]);

  const renderHeaderSearch = useMemo(() => {
    return (
      <div className="flex flex-col gap-2 font-Rany text-white">
        <div className="text-lg">Select a token</div>
        <hr className="my-4 h-[1px] border-0 bg-color_list_hover" />
        <Input
          className="!border-[1px] !border-gray_008 bg-color_bg_2 py-5 px-4 text-base text-gray_05"
          value={filter}
          onChange={(e) => setFilter(e.target.value.toLowerCase())}
          placeholder="Search name or paste address"
        />
        <div className="mt-2 mb-2 flex gap-2">
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
        className="h-[354px] overflow-y-scroll border-0 bg-color_bg_2 p-2 no-scrollbar"
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
