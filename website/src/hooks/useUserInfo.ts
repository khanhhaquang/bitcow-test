import { useQuery } from '@tanstack/react-query';
import useMerlinWallet from './useMerlinWallet';
import { UserService } from 'services/user';

const useUserInfo = () => {
  const { isLoggedIn, walletAddress } = useMerlinWallet();

  return useQuery({
    queryKey: [UserService.getUserInfo.key, walletAddress],
    queryFn: () => UserService.getUserInfo.call(walletAddress),
    select: (data) => data?.data,
    enabled: !!walletAddress && isLoggedIn
  });
};

export default useUserInfo;
