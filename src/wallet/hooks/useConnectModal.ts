import { useConnectProvider } from '../btcContext';

export const useConnectModal = () => {
  const { openConnectModal, disconnect } = useConnectProvider();
  return { openConnectModal, disconnect };
};
