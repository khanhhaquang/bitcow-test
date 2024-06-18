import { useQuery } from '@tanstack/react-query';

import { CampaignService } from 'services/campaign';

import useMerlinWallet from './useMerlinWallet';

const useCampaign = () => {
  const { isLoggedIn, walletAddress } = useMerlinWallet();
  return useQuery({
    queryKey: [CampaignService.getTasks.key, walletAddress],
    queryFn: () => CampaignService.getTasks.call(walletAddress, '20240523'),
    select: (data) => data, // need to retrive API status
    enabled: !!walletAddress && isLoggedIn
  });
};

export default useCampaign;
