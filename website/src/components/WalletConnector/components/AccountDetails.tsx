import cx from 'classnames';
import { BTC } from 'obric-merlin/dist/configs';
import { useState } from 'react';

import { Tooltip } from 'components/Antd';
import Button from 'components/Button';
import CoinIcon from 'components/CoinIcon';
import { walletAddressEllipsis } from 'components/utils/utility';
import useMerlinWallet from 'hooks/useMerlinWallet';
import usePools from 'hooks/usePools';
import useTokenBalance from 'hooks/useTokenBalance';
import { CopyIcon, QuitIcon } from 'resources/icons';
import { copyToClipboard } from 'utils/copy';

import styles from './AccountDetails.module.scss';

import { useEvmConnectContext } from '../../../wallet';

let timer: NodeJS.Timeout;

const AccountDetails = ({ onClose }: { onClose: () => void }) => {
  const { wallet } = useMerlinWallet();
  const { disconnect } = useEvmConnectContext();
  const { getTokenBalanceInUSD } = usePools();
  const [copied, setCopied] = useState(false);
  const btcToken = BTC;
  const [uiBalance] = useTokenBalance(btcToken);

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
        <div className="flex flex-col text-color_text_2">
          <div className="flex gap-4">
            <div className="text-lg text-color_text_1">
              {walletAddressEllipsis(wallet?.accounts[0].evm)}
            </div>
            <div className="flex gap-2">
              {/* <Button
                onClick={() => ''}
                className="w-full fill-color_text_2 p-0 dark:opacity-30 dark:hover:opacity-100">
                <Tooltip placement="top" title="View Tokenlist">
                  <ExportIcon />
                </Tooltip>
              </Button> */}
              <Button
                onClick={() => handleCopy(wallet?.accounts[0].evm)}
                className="w-full fill-color_text_2 p-0 dark:opacity-30 dark:hover:opacity-100">
                <Tooltip placement="top" title="Copy">
                  <CopyIcon />
                </Tooltip>
              </Button>
            </div>
          </div>
          <div className="text-xs uppercase">{wallet?.metadata.name}</div>
        </div>
      </div>
      <div className="w-full px-5">
        <div className="relative mt-6 mb-8 flex h-[134px] w-full justify-between bg-accountGradientBg">
          <div className="h-full w-full bg-accountBg bg-contain bg-center p-6">
            <div className="flex w-full flex-col items-end">
              <div className="flex h-[24px] w-full items-center justify-between text-white">
                <div className="flex items-center gap-2 text-[20px]">
                  <CoinIcon size={24} token={btcToken} />
                  <div className="">{btcToken.name}</div>
                </div>
                <div className="text-[20px]">{uiBalance}</div>
              </div>
              <small className="text-base text-color_text_4">
                ${getTokenBalanceInUSD(uiBalance, btcToken)}
              </small>
            </div>
            <div className="absolute -top-[15px] -left-[15px] h-[30px] w-[30px] -rotate-45 bg-color_bg_panel"></div>
            <div className="absolute -top-[15px] -right-[15px] h-[30px] w-[30px] rotate-45 bg-color_bg_panel"></div>
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
            onClose();
            disconnect();
          }}
          className="flex h-full w-full gap-2 fill-color_text_2 p-0 py-4 text-color_text_2 dark:opacity-30 dark:hover:opacity-100">
          <QuitIcon />
          <div className="text-base">Disconnect</div>
        </Button>
      </div>
    </div>
  );
};

export default AccountDetails;
