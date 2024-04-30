import { chains } from '@particle-network/chains';
import { useCallback, useMemo } from 'react';

import styles from './evm.connect.module.scss';

import type { BaseConnector } from '../../connector';
import { EVM_CURRENT_CONNECTOR_ID } from '../../const';
import { useEvmConnectContext } from '../../context';
import type { EvmConnector } from '../../types/types';
import Modal from '../modal';
import { BtcWalletButton, EvmWalletButton } from '../wallet';
import { CloseIcon } from 'resources/icons';

export const EvmConnectModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { evmConnectors, btcConnectors, closeModal, btcConnect, evmConnect, currentChain } =
    useEvmConnectContext();

  const showBtcWallets = useMemo(() => {
    if (!currentChain) return false;

    return (
      chains.getEVMChainInfoById(currentChain.chainId) !== undefined && btcConnectors.length > 0
    );
  }, [currentChain, btcConnectors]);

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
    <Modal open={open} onClose={onClose} isDismissable={false} contentClassName="!min-w-[400px]">
      <div className="mb-9 flex w-full items-center justify-between border-b border-white/20 pb-3 font-micro text-white">
        <h2 className="text-2xl text-white">Choose Wallet</h2>
        <button onClick={onClose} className={styles.closeBtn}>
          <CloseIcon />
        </button>
      </div>

      <div className="w-full">
        {showBtcWallets && <div className="mb-2 font-micro text-lg">{'EVM Wallets'}</div>}
        <div className="flex w-full justify-center gap-x-16">
          {evmConnectors.map((connector) => (
            <EvmWalletButton
              connector={connector}
              key={connector[0].metadata.id}
              evmConnect={onEvmConnect}></EvmWalletButton>
          ))}
          {showBtcWallets &&
            btcConnectors.map((connector) => (
              <BtcWalletButton
                connector={connector}
                key={connector.metadata.id}
                btcConnect={onBtcConnect}
              />
            ))}
        </div>
      </div>
    </Modal>
  );
};
export default EvmConnectModal;
