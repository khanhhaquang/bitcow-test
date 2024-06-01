import { useQuery } from '@tanstack/react-query';
import useMerlinWallet from './useMerlinWallet';
import { UserService } from 'services/user';

const useUserInfo = () => {
  const { isLoggedIn, walletAddress } = useMerlinWallet();

  return useQuery({
    queryKey: [UserService.getUserInfo.key, walletAddress],
    queryFn: () => (walletAddress ? UserService.getUserInfo.call(walletAddress) : undefined),
    select: (data) => data?.data,
    enabled: isLoggedIn
  });
};

export default useUserInfo;
