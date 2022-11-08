/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Fragment, useCallback } from 'react';
import HippoModal from 'components/HippoModal';
import { useDispatch, useSelector } from 'react-redux';
import { getShowWalletConnector } from 'modules/common/reducer';
import commonActions from 'modules/common/actions';
import { CancelIcon } from 'resources/icons';
import styles from './WalletConnector.module.scss';
import WalletSelector from './components/WalletSelector';
import { walletAddressEllipsis } from 'components/utils/utility';
import useAptosWallet from 'hooks/useAptosWallet';
import AccountDetails from './components/AccountDetails';

const WalletConnector = () => {
  const { activeWallet, openModal, open, closeModal } = useAptosWallet();

  return (
    <Fragment>
      {activeWallet ? (
        <div
          className="flex justify-center items-center text-white text-lg font-Rany bg-gray_008 px-4 py-3"
          onClick={openModal}>
          {walletAddressEllipsis(activeWallet.toString() || '')}
        </div>
      ) : (
        <div
          className="font-Furore text-2xl w-full h-full flex justify-center items-center text-color_main"
          onClick={openModal}>
          {'Connect Wallet'}
        </div>
      )}
      <HippoModal
        onCancel={closeModal}
        className=""
        wrapClassName={activeWallet ? styles.walletDetail : styles.walletsModal}
        open={open}
        footer={null}
        closeIcon={<CancelIcon />}>
        {activeWallet ? <AccountDetails /> : <WalletSelector />}
      </HippoModal>
    </Fragment>
  );
};

export default WalletConnector;
