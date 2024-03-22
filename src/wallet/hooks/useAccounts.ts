import { useConnectProvider } from '../btcContext';

export const useAccounts = () => {
  const { accounts } = useConnectProvider();
  return { accounts };
};
