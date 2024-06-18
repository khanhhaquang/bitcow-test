// import useMerlinWallet from 'hooks/useMerlinWallet';
// import { useMemo } from 'react';
import { useMemo } from 'react';
import { CONFIG } from 'sdk';

import useNetwork from 'hooks/useNetwork';

import MiningGala from './components/MiningGala';
import NoCampaign from './components/NoCampaign';

const Campaign = () => {
  const { currentNetwork } = useNetwork();
  // const { isLoggedIn } = useMerlinWallet();

  const isCampaignExist = useMemo(() => {
    const isBitLayerMiningGala = currentNetwork?.chainConfig?.chainId === CONFIG.bitlayer.chainId;
    return isBitLayerMiningGala;
  }, [currentNetwork]);

  // const content = useMemo(() => {
  //   return MiningGala();
  // }, [isLoggedIn]);

  return (
    <div className="relative flex flex-col items-center pt-20">
      {isCampaignExist ? <MiningGala /> : <NoCampaign />}
    </div>
  );
};
export default Campaign;
