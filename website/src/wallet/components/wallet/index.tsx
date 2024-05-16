import type { Web3ReactHooks } from '@web3-react/core';

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
    <button
      className="group flex flex-col items-center gap-y-1.5"
      onClick={() => btcConnect(connector)}>
      <img
        width={60}
        height={60}
        src={connector.metadata.icon}
        className="group-hover:shadow-wallet-hover"
      />
      <span className="font-pg text-lg">{connector.metadata.name}</span>
    </button>
  );
};
export const EvmWalletButton = ({
  connector,
  evmConnect
}: {
  connector: [EvmConnector, Web3ReactHooks];
  evmConnect: (connector: EvmConnector) => void;
}) => {
  console.log(connector);
  return (
    <button
      className="group flex flex-col items-center gap-y-1.5"
      onClick={() => evmConnect(connector[0])}>
      <img
        src={connector[0].metadata.icon}
        width={60}
        height={60}
        className="group-hover:shadow-wallet-hover"
      />
      <span className="font-pg text-lg">{connector[0].metadata.name}</span>
    </button>
  );
};
