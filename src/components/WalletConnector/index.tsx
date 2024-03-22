/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEvmConnectContext } from '@particle-network/evm-connectkit';
import { motion } from 'framer-motion';
import { Fragment, useCallback, useEffect, useState } from 'react';

import ObricModal from 'components/ObricModal';
import { walletAddressEllipsis } from 'components/utils/utility';
import useMerlinWallet from 'hooks/useMerlinWallet';
import { CancelIcon, LoadingIcon } from 'resources/icons';

import AccountDetails from './components/AccountDetails';
import styles from './WalletConnector.module.scss';

const WalletConnector = () => {
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const { openWalletModal, closeWalletModal, pendingTx, wallet } = useMerlinWallet();

  const { disconnect } = useEvmConnectContext();

  const renderActiveBtn = useCallback(() => {
    if (pendingTx) {
      return (
        <div className="flex h-full items-center justify-center bg-color_main fill-white px-5 py-3 font-Rany text-base leading-4 text-white tablet:p-[10px]">
          1 Pending
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
        className="flex h-full items-center justify-center bg-white px-5 py-3 font-Rany text-base leading-4 text-color_text_1 dark:bg-gray_008 tablet:p-[10px]"
        onClick={() => setDetailModalOpen(true)}>
        {walletAddressEllipsis(wallet?.accounts[0].evm || '')}
      </div>
    );
  }, [wallet, pendingTx, disconnect]);
  return (
    <Fragment>
      {wallet ? (
        renderActiveBtn()
      ) : (
        <div
          className="flex h-full w-full items-center justify-center border-[1px] border-color_main bg-color_main px-5 py-3 font-Rany text-base font-medium leading-4 text-white dark:bg-transparent dark:bg-button_gradient tablet:h-full tablet:p-[10px] tablet:font-Furore tablet:text-base"
          onClick={openWalletModal}>
          {'Connect Wallet'}
        </div>
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
