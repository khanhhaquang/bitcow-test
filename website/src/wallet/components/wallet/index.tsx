import type { Web3ReactHooks } from '@web3-react/core';

import styles from './wallet.module.scss';

import type { BaseConnector } from '../../connector';
import type { EvmConnector } from '../../types/types';

export const BtcWalletButton = ({
  connector,
  btcConnect
}: {
  connector: BaseConnector;
  btcConnect: (connector: BaseConnector) => void;
}) => {
  return (
    <div className={styles.wallet} onClick={() => btcConnect(connector)}>
      <img className={styles.walletIcon} src={connector.metadata.icon}></img>
      <div className={styles.walletName}>{connector.metadata.name}</div>
    </div>
  );
};
export const EvmWalletButton = ({
  connector,
  evmConnect
}: {
  connector: [EvmConnector, Web3ReactHooks];
  evmConnect: (connector: EvmConnector) => void;
}) => {
  return (
    <div
      className={styles.wallet}
      key={connector[0].metadata.id}
      onClick={() => evmConnect(connector[0])}>
      <img className={styles.walletIcon} src={connector[0].metadata.icon}></img>
      <div className={styles.walletName}>{connector[0].metadata.name}</div>
    </div>
  );
};
