// import useMerlinWallet from 'hooks/useMerlinWallet';
// import { useMemo } from 'react';
import { useMemo } from 'react';
import { CONFIG } from 'sdk';

import useNetwork from 'hooks/useNetwork';

import MiningGala from './components/MiningGala';
import NoCampaign from './components/NoCampaign';
import useMerlinWallet from 'hooks/useMerlinWallet';

const Campaign = () => {
  const { currentNetwork } = useNetwork();
  const { isLoggedIn } = useMerlinWallet();

  const isCampaignExist = useMemo(() => {
    const isBitLayerMiningGala = currentNetwork?.chainConfig?.chainId === CONFIG.bitlayer.chainId;
    return isBitLayerMiningGala;
  }, [currentNetwork]);

  return (
    <div className="relative flex flex-col items-center pt-20">
      {isLoggedIn ? (
        isCampaignExist ? (
          <MiningGala />
        ) : (
          <NoCampaign />
        )
      ) : (
        <NoCampaign text="CONNECT TO WALLET" />
      )}
    </div>
  );
};
export default Campaign;
