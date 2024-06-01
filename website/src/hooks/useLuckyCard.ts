import { useQuery } from '@tanstack/react-query';
import useMerlinWallet from './useMerlinWallet';

const useLuckyCard = (id: number = 1) => {
  const { bitcowSDK } = useMerlinWallet();

  return useQuery({
    queryKey: ['bitcowSDK.lottery.getCardInfo', bitcowSDK, id],
    queryFn: () => bitcowSDK?.lottery?.getCardInfo(id),
    enabled: true
  });
};

export default useLuckyCard;
