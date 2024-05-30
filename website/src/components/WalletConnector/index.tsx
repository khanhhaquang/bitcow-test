import { Fragment, useCallback, useEffect, useState } from 'react';
import { useEvmConnectContext } from 'wallet';

import BitcowModal from 'components/BitcowModal';
import PixelButton from 'components/PixelButton';
import { walletAddressEllipsis } from 'components/utils/utility';
import useMerlinWallet from 'hooks/useMerlinWallet';
import { CancelIcon } from 'resources/icons';

import AccountDetails from './components/AccountDetails';
import styles from './WalletConnector.module.scss';

export const WALLET_WIDTH = 246;
const WALLET_HEIGHT = 46;
const WALLET_BORDER_WIDTH = 4;

const WalletConnector = () => {
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const { openWalletModal, pendingTx, wallet } = useMerlinWallet();
  const { disconnect } = useEvmConnectContext();
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement) {
        if (!event.target.closest('.bc-wallet-connector-active')) {
          setIsDisconnectModalOpen(false);
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const renderActiveBtn = useCallback(() => {
    if (pendingTx) {
      return (
        <PixelButton
          height={WALLET_HEIGHT}
          width={WALLET_WIDTH}
          borderWidth={WALLET_BORDER_WIDTH}
          isLoading
          className="group text-2xl uppercase">
          1 Pending
        </PixelButton>
      );
    }

    return (
      <PixelButton
        height={WALLET_HEIGHT}
        width={WALLET_WIDTH}
        borderWidth={WALLET_BORDER_WIDTH}
        onClick={() => setIsDisconnectModalOpen(!isDisconnectModalOpen)}
        className="bc-wallet-connector-active group w-[246px] text-2xl uppercase">
        {walletAddressEllipsis(wallet?.accounts[0].evm || '')}
        {isDisconnectModalOpen && (
          <div className="absolute z-10" style={{ top: WALLET_HEIGHT + 4, left: 0 }}>
            <PixelButton
              width={WALLET_WIDTH}
              height={WALLET_HEIGHT}
              onClick={() => disconnect()}
              isSolid
              className="bg-white uppercase text-bc-blue hover:!bg-white active:!bg-white">
              Disconnect
            </PixelButton>
          </div>
        )}
      </PixelButton>
    );
  }, [pendingTx, wallet?.accounts, isDisconnectModalOpen, disconnect]);
  return (
    <>
      {wallet ? (
        renderActiveBtn()
      ) : (
        <PixelButton
          height={WALLET_HEIGHT}
          width={WALLET_WIDTH}
          borderWidth={WALLET_BORDER_WIDTH}
          className="text-2xl uppercase"
          onClick={() => openWalletModal()}>
          Connect Wallet
        </PixelButton>
      )}
      <BitcowModal
        onCancel={() => setDetailModalOpen(false)}
        className=""
        wrapClassName={wallet ? styles.walletDetail : styles.walletsModal}
        open={detailModalOpen}
        closeIcon={<CancelIcon />}>
        {<AccountDetails onClose={() => setDetailModalOpen(false)} />}
      </BitcowModal>
    </>
  );
};

export default WalletConnector;
