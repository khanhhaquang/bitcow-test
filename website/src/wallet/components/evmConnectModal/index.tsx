import { chains } from '@particle-network/chains';
import { useCallback, useMemo } from 'react';

import styles from './evm.connect.module.scss';

import type { BaseConnector } from '../../connector';
import { EVM_CURRENT_CONNECTOR_ID } from '../../const';
import { useEvmConnectContext } from '../../context';
import close from '../../icons/close.svg';
import type { EvmConnector } from '../../types/types';
import Modal from '../modal';
import { BtcWalletButton, EvmWalletButton } from '../wallet';

export const EvmConnectModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { evmConnectors, btcConnectors, closeModal, btcConnect, evmConnect, currentChain } =
    useEvmConnectContext();
  const showBtcWallets = useMemo(() => {
    if (currentChain) {
      return (
        chains.getEVMChainInfoById(currentChain.chainId) !== undefined && btcConnectors.length > 0
      );
    } else {
      return false;
    }
  }, [currentChain]);
  const onBtcConnect = useCallback(
    async (connector: BaseConnector) => {
      if (connector.isReady()) {
        await btcConnect(connector);
        closeModal();
      }
    },
    [btcConnect, closeModal]
  );

  const onEvmConnect = useCallback(
    async (connector: EvmConnector) => {
      try {
        localStorage.setItem(EVM_CURRENT_CONNECTOR_ID, connector.metadata.id);
        evmConnect(connector);
        closeModal();
      } catch (e) {
        console.error('onConnect error', e);
      }
    },
    [closeModal, evmConnect]
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      isDismissable={false}
      contentClassName={styles.evmConnectModal}>
      <div className={styles.title}>{'Choose Wallet'}</div>
      <img className={styles.closeBtn} src={close} onClick={onClose}></img>
      {showBtcWallets && (
        <div className={styles.walletsAndTitle}>
          <div className={styles.walletTypeTitle}>{'BTC Wallets'}</div>
          <div className={styles.wallets}>
            {btcConnectors.map((connector) => {
              return (
                <BtcWalletButton
                  connector={connector}
                  key={connector.metadata.id}
                  btcConnect={onBtcConnect}></BtcWalletButton>
              );
            })}
          </div>
        </div>
      )}
      {showBtcWallets && <hr className={styles.separate} />}

      <div className={styles.walletsAndTitle}>
        {showBtcWallets && <div className={styles.walletTypeTitle}>{'EVM Wallets'}</div>}
        <div className={styles.wallets}>
          {evmConnectors.map((connector) => {
            return (
              <EvmWalletButton
                connector={connector}
                key={connector[0].metadata.id}
                evmConnect={onEvmConnect}></EvmWalletButton>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
export default EvmConnectModal;
