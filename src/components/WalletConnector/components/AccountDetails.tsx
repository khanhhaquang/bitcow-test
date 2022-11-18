import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { RawCoinInfo } from '@manahippo/coin-list';
import cx from 'classnames';
import { useMemo, useState } from 'react';

import { Tooltip } from 'components/Antd';
import Button from 'components/Button';
import CoinIcon from 'components/CoinIcon';
import { walletAddressEllipsis } from 'components/utils/utility';
import useAptosWallet from 'hooks/useAptosWallet';
import useCoinStore, { CoinInfo } from 'hooks/useCoinStore';
import usePools from 'hooks/usePools';
import useTokenBalane from 'hooks/useTokenBalance';
import { CopyIcon, QuitIcon } from 'resources/icons';
import { copyToClipboard } from 'utils/copy';

import styles from './AccountDetails.module.scss';

let timer: NodeJS.Timeout;

const AccountDetails = () => {
  const { activeWallet, selectedWallet, closeModal, obricSDK } = useAptosWallet();
  const { getTokenBalanceInUSD } = usePools();
  const [copied, setCopied] = useState(false);
  const { disconnect } = useWallet();
  const { coinStore } = useCoinStore();
  const [AptToken, availableApt] = useMemo(() => {
    let aptToken: RawCoinInfo;
    let balance = 0;
    if (obricSDK && coinStore) {
      aptToken = obricSDK.coinList.getCoinInfoBySymbol('APT')[0];
      const aptCoin = coinStore[aptToken.token_type.type] || 0;
      if (aptCoin) {
        balance = (aptCoin.data as CoinInfo).coin.value / Math.pow(10, aptToken.decimals);
      }
    }
    return [aptToken, balance];
  }, [coinStore, obricSDK]);
  const [uiBalance] = useTokenBalane(AptToken);

  const handleCopy = (text) => {
    copyToClipboard(text, () => {
      if (copied) {
        clearTimeout(timer);
      } else {
        setCopied(true);
      }

      timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex px-5 tablet:pt-5">
        <div className="flex flex-col text-item_black dark:text-gray_05">
          <div className="flex gap-4">
            <div className="text-lg text-item_black dark:text-white">
              {walletAddressEllipsis(activeWallet?.toString() || '')}
            </div>
            <div className="flex gap-2">
              {/* <Button
                onClick={() => ''}
                className="w-full fill-gray_05 p-0 opacity-30 hover:opacity-100">
                <Tooltip placement="top" title="View Tokenlist">
                  <ExportIcon />
                </Tooltip>
              </Button> */}
              <Button
                onClick={() => handleCopy(activeWallet?.toString())}
                className="w-full fill-white_gray_05 p-0 opacity-30 hover:opacity-100 dark:fill-gray_05">
                <Tooltip placement="top" title="Copy">
                  <CopyIcon />
                </Tooltip>
              </Button>
            </div>
          </div>
          <div className="text-xs uppercase">{selectedWallet.adapter.name}</div>
        </div>
      </div>
      <div className="w-full px-5">
        <div className="relative mt-6 mb-8 flex h-[134px] w-full justify-between bg-accountGradientBg">
          <div className="h-full w-full bg-accountBg bg-contain bg-center p-6">
            <div className="flex w-full flex-col items-end">
              <div className="flex h-[24px] w-full items-center justify-between text-white">
                <div className="flex items-center gap-2 text-[20px]">
                  <CoinIcon size={24} token={AptToken} />
                  <div className="">{AptToken?.name}</div>
                </div>
                <div className="text-[20px]">{availableApt}</div>
              </div>
              <small className="text-base text-gray_05">
                ${getTokenBalanceInUSD(uiBalance, AptToken)}
              </small>
            </div>
            <div className="absolute -top-[15px] -left-[15px] h-[30px] w-[30px] -rotate-45 bg-white dark:bg-gray_bg"></div>
            <div className="absolute -top-[15px] -right-[15px] h-[30px] w-[30px] rotate-45 bg-white dark:bg-gray_bg"></div>
            <div
              className={cx(
                'absolute left-0 bottom-0 h-[54px] w-full backdrop-blur-[15px]',
                styles.bottomBg
              )}></div>
          </div>
        </div>
      </div>
      <div className="border-t-[1px] border-white_color_list_hover dark:border-gray_008">
        <Button
          onClick={() => {
            closeModal();
            disconnect();
          }}
          className="flex h-full w-full gap-2 fill-white_gray_05 p-0 py-4 text-white_gray_05 opacity-30 hover:opacity-100 dark:fill-white dark:text-white">
          <QuitIcon />
          <div className="text-base">Disconnect</div>
        </Button>
      </div>
    </div>
  );
};

export default AccountDetails;
