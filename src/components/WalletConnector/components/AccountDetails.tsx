import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { Tooltip } from 'components/Antd';
import Button from 'components/Button';
import { walletAddressEllipsis } from 'components/utils/utility';
import useAptosWallet from 'hooks/useAptosWallet';
import { useState } from 'react';
import { CopyIcon, ExportIcon, QuitIcon } from 'resources/icons';
import { copyToClipboard } from 'utils/copy';

let timer: NodeJS.Timeout;

const AccountDetails = () => {
  const { activeWallet, selectedWallet, closeModal } = useAptosWallet();
  const [copied, setCopied] = useState(false);
  const { disconnect } = useWallet();

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
            <div className="text-white text-lg">
              {walletAddressEllipsis(activeWallet?.toString() || '')}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => ''} className="w-full p-0">
                <Tooltip placement="top" title="View Tokenlist">
                  <ExportIcon />
                </Tooltip>
              </Button>
              <Button onClick={() => handleCopy(activeWallet?.toString())} className="w-full p-0">
                <Tooltip placement="top" title="Copy">
                  <CopyIcon />
                </Tooltip>
              </Button>
            </div>
          </div>
          <div className="uppercase text-xs">{selectedWallet.adapter.name}</div>
        </div>
      </div>
      <div className="px-5 w-full">
        <div className="w-full h-[134px] bg-accountBg bg-cover bg-no-repeat bg-center mt-6 mb-8"></div>
      </div>
      <div className="border-t-[1px] border-gray_008">
        <Button
          onClick={() => {
            closeModal();
            disconnect();
          }}
          className="w-full h-full py-4 p-0 text-gray_05 flex gap-2">
          <QuitIcon />
          <div className="text-base">Disconnect</div>
        </Button>
      </div>
    </div>
  );
};

export default AccountDetails;
