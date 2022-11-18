/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { motion } from 'framer-motion';
import commonActions from 'modules/common/actions';
import { getShowWalletConnector } from 'modules/common/reducer';
import { Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ObricModal from 'components/ObricModal';
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
        <div className="flex items-center justify-center bg-color_main fill-white px-4 py-3 font-Rany text-lg text-white dark:fill-black dark:text-black tablet:h-full tablet:p-[10px]">
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
        className="flex items-center justify-center bg-white px-4 py-3 font-Rany text-lg text-item_black dark:bg-gray_008 dark:text-white tablet:h-full tablet:p-[10px]"
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
          className="flex h-full w-full items-center justify-center bg-color_main px-[22px] py-[13px] font-Furore text-sm text-white dark:bg-transparent dark:bg-button_gradient tablet:h-full tablet:p-[10px]"
          onClick={openModal}>
          {'Connect Wallet'}
        </div>
      )}
      <ObricModal
        onCancel={closeModal}
        className=""
        wrapClassName={activeWallet ? styles.walletDetail : styles.walletsModal}
        open={open}
        // mobileHeight={activeWallet ? 466 : 400}
        closeIcon={<CancelIcon />}>
        {activeWallet ? <AccountDetails /> : <WalletSelector />}
      </ObricModal>
    </Fragment>
  );
};

export default WalletConnector;
