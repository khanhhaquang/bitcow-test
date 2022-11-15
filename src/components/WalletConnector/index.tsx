/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { motion } from 'framer-motion';
import commonActions from 'modules/common/actions';
import { getShowWalletConnector } from 'modules/common/reducer';
import { Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import HippoModal from 'components/HippoModal';
import { walletAddressEllipsis } from 'components/utils/utility';
import useAptosWallet from 'hooks/useAptosWallet';
import { CancelIcon, LoadingIcon } from 'resources/icons';

import AccountDetails from './components/AccountDetails';
import WalletSelector from './components/WalletSelector';
import styles from './WalletConnector.module.scss';

const WalletConnector = () => {
  const { activeWallet, openModal, open, closeModal, pendingTx } = useAptosWallet();

  const renderActiveBtn = useCallback(() => {
    if (pendingTx) {
      return (
        <div className="flex items-center justify-center bg-color_main px-4 py-3 font-Rany text-lg text-black tablet:h-full tablet:p-[10px]">
          Pending
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 2
            }}>
            <LoadingIcon />
          </motion.div>
        </div>
      );
    }
    return (
      <div
        className="flex items-center justify-center bg-gray_008 px-4 py-3 font-Rany text-lg text-white tablet:h-full tablet:p-[10px]"
        onClick={openModal}>
        {walletAddressEllipsis(activeWallet.toString() || '')}
      </div>
    );
  }, [activeWallet, openModal, pendingTx]);

  return (
    <Fragment>
      {activeWallet ? (
        renderActiveBtn()
      ) : (
        <div
          className="flex h-full w-full items-center justify-center font-Furore text-2xl text-color_main tablet:h-full tablet:p-[10px]"
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
