// import useMerlinWallet from 'hooks/useMerlinWallet';
// import { useMemo } from 'react';
import { useMemo } from 'react';
import { CONFIG } from 'sdk';

import useCampaign from 'hooks/useCampaign';
import useMerlinWallet from 'hooks/useMerlinWallet';
import useNetwork from 'hooks/useNetwork';

import MiningGala from './components/MiningGala';
import NoCampaign from './components/NoCampaign';

const Campaign = () => {
  const { currentNetwork } = useNetwork();
  const { isLoggedIn } = useMerlinWallet();
  const { data: campaignData, isLoading } = useCampaign();

  const isCampaignExist = useMemo(() => {
    const isBitLayerMiningGala = currentNetwork?.chainConfig?.chainId === CONFIG.bitlayer.chainId;
    const isBitLayerMiningOpen = campaignData?.code === 0;
    return isBitLayerMiningGala && isBitLayerMiningOpen;
  }, [currentNetwork, campaignData]);

  const campaignContent = useMemo(() => {
    if (!isLoggedIn) return <NoCampaign text="CONNECT TO WALLET" />;
    if (isLoading) return <NoCampaign text="LOADING..." />;
    if (!isCampaignExist) return <NoCampaign />;
    return <MiningGala />;
  }, [isLoggedIn, isCampaignExist, isLoading]);

  return <div className="relative flex flex-col items-center pt-20">{campaignContent}</div>;
};
export default Campaign;
