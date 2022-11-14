import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { useMemo, useState } from 'react';

import { Tooltip } from 'components/Antd';
import Button from 'components/Button';
import CoinIcon from 'components/CoinIcon';
import { walletAddressEllipsis } from 'components/utils/utility';
import useAptosWallet from 'hooks/useAptosWallet';
import useCoinStore, { CoinInfo } from 'hooks/useCoinStore';
import { CopyIcon, ExportIcon, QuitIcon } from 'resources/icons';
import { copyToClipboard } from 'utils/copy';

let timer: NodeJS.Timeout;

const AccountDetails = () => {
  const { activeWallet, selectedWallet, closeModal, obricSDK } = useAptosWallet();
  const [copied, setCopied] = useState(false);
  const { disconnect } = useWallet();
  const { coinStore } = useCoinStore();
  const [AptToken, availableApt] = useMemo(() => {
    let aptToken;
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
      <div className="flex px-5">
        <div className="flex flex-col text-gray_05">
          <div className="flex gap-4">
            <div className="text-lg text-white">
              {walletAddressEllipsis(activeWallet?.toString() || '')}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => ''} className="w-full p-0 opacity-30 hover:opacity-100">
                <Tooltip placement="top" title="View Tokenlist">
                  <ExportIcon />
                </Tooltip>
              </Button>
              <Button
                onClick={() => handleCopy(activeWallet?.toString())}
                className="w-full p-0 opacity-30 hover:opacity-100">
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
        <div className="mt-6 mb-8 flex h-[134px] w-full justify-between bg-accountBg bg-cover bg-center bg-no-repeat p-6">
          <div className="flex h-[24px] w-full items-center justify-between">
            <div className="flex items-center gap-2 text-[20px]">
              <CoinIcon size={24} logoSrc={AptToken?.logo_url} />
              <div className="">{AptToken?.name}</div>
            </div>
            <div className="text-[20px]">{availableApt}</div>
          </div>
        </div>
      </div>
      <div className="border-t-[1px] border-gray_008">
        <Button
          onClick={() => {
            closeModal();
            disconnect();
          }}
          className="flex h-full w-full gap-2 p-0 py-4 text-white opacity-30 hover:opacity-100">
          <QuitIcon />
          <div className="text-base">Disconnect</div>
        </Button>
      </div>
    </div>
  );
};

export default AccountDetails;
