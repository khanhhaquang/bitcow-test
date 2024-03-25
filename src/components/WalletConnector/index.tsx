import { Fragment, useCallback, useState } from 'react';
import { useEvmConnectContext } from 'wallet';

import ObricModal from 'components/ObricModal';
import PixelButton from 'components/PixelButton';
import { walletAddressEllipsis } from 'components/utils/utility';
import useMerlinWallet from 'hooks/useMerlinWallet';
import { CancelIcon } from 'resources/icons';

import AccountDetails from './components/AccountDetails';
import styles from './WalletConnector.module.scss';

const WALLET_WIDTH = 246;
const WALLET_HEIGHT = 48;
const WALLET_BORDER_WIDTH = 4;

const WalletConnector = () => {
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const { openWalletModal, pendingTx, wallet } = useMerlinWallet();
  const { disconnect } = useEvmConnectContext();
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);

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
        className="group text-2xl uppercase">
        {walletAddressEllipsis(wallet?.accounts[0].evm || '')}
        {isDisconnectModalOpen && (
          <div className="absolute" style={{ top: WALLET_HEIGHT - WALLET_BORDER_WIDTH, left: 0 }}>
            <PixelButton
              width={WALLET_WIDTH}
              height={WALLET_HEIGHT}
              borderWidth={WALLET_BORDER_WIDTH}
              onClick={() => disconnect()}
              className="bg-bc-white-10 uppercase">
              Disconnect
            </PixelButton>
          </div>
        )}
      </PixelButton>
    );
  }, [pendingTx, wallet?.accounts, isDisconnectModalOpen, disconnect]);
  return (
    <Fragment>
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
      <ObricModal
        onCancel={() => setDetailModalOpen(false)}
        className=""
        wrapClassName={wallet ? styles.walletDetail : styles.walletsModal}
        open={detailModalOpen}
        closeIcon={<CancelIcon />}>
        {<AccountDetails onClose={() => setDetailModalOpen(false)} />}
      </ObricModal>
    </Fragment>
  );
};

export default WalletConnector;
