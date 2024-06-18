import { useQuery } from '@tanstack/react-query';
import useMerlinWallet from './useMerlinWallet';
import { CampaignService } from 'services/campaign';

const useCampaign = () => {
  const { isLoggedIn, walletAddress } = useMerlinWallet();
  return useQuery({
    queryKey: [CampaignService.getTasks.key, walletAddress],
    queryFn: () => CampaignService.getTasks.call(walletAddress, '20240523'),
    select: (data) => data?.data,
    enabled: !!walletAddress && isLoggedIn
  });
};

export default useCampaign;
