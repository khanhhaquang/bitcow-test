import { useMemo, useState } from 'react';

import useMerlinWallet from 'hooks/useMerlinWallet';

import CardsPicker from './components/CardsPicker';
import Loader from './components/Loader';
import LuckyCodeModal from './components/LuckyCodeModal';
import { Buy, NotConnected, Redeem } from './components/LuckyShop';

export enum LuckyCowStatus {
  PRELOADING,
  REDEEM,
  BUY,
  LOADING_CARDS,
  CARDS_PICKING,
  CARDS_SCRATCHING
}

const LuckyCow = () => {
  const { wallet } = useMerlinWallet();
  const [status, setStatus] = useState<LuckyCowStatus>(LuckyCowStatus.BUY);
  const [isLuckyCodeOpen, setIsLuckyCodeOpen] = useState(false);

  const isLoadingAccess = false;

  const content = useMemo(() => {
    if (!wallet) return <NotConnected />;

    switch (status) {
      case LuckyCowStatus.REDEEM:
        return (
          <Redeem
            onClickRedeem={() => {
              setStatus(LuckyCowStatus.CARDS_PICKING);
            }}
          />
        );
      case LuckyCowStatus.BUY:
        return <Buy onClickRedeemCode={() => setIsLuckyCodeOpen(true)} />;
      case LuckyCowStatus.LOADING_CARDS:
        return <Loader>Preparing your cards...</Loader>;
      case LuckyCowStatus.CARDS_PICKING:
        return (
          <CardsPicker
            numsOfCard={10}
            numsOfSelectedCard={4}
            onStartScratching={() => {
              setStatus(LuckyCowStatus.CARDS_SCRATCHING);
            }}
          />
        );
      default:
        return <Loader />;
    }
  }, [wallet, status]);

  if (wallet && isLoadingAccess) return <Loader />;

  return (
    <div className="flex flex-col items-center pt-20">
      {content}
      <LuckyCodeModal
        open={isLuckyCodeOpen}
        onCancel={() => setIsLuckyCodeOpen(false)}
        onSubmit={() => {
          setStatus(LuckyCowStatus.REDEEM);
        }}
      />
    </div>
  );
};

export default LuckyCow;
