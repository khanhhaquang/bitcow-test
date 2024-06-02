import { useEffect, useMemo, useState } from 'react';

import useMerlinWallet from 'hooks/useMerlinWallet';

import Loader from './components/Loader';
import LuckyCardsPicker from './components/LuckyCardsPicker';
import LuckyCodeModal from './components/LuckyCodeModal';
import { Buy, NotConnected, Redeem } from './components/LuckyShop';
import useUserInfo from 'hooks/useUserInfo';
import { useFreeLuckyGame } from 'hooks/useFreeLuckyGame';

import LuckyCardSlider from './components/LuckyCardSlider';
import { useLocation } from 'react-router-dom';
import { GameProgress } from 'services/user';

export enum LuckyCowStatus {
  PRELOADING,
  REDEEM,
  BUY,
  LOADING_CARDS,
  CARDS_PICKING,
  CARDS_SCRATCHING
}

const LuckyCow = () => {
  const { state } = useLocation();
  const { isFromLuckyChance } = (state || {}) as { isFromLuckyChance?: boolean };

  const { wallet } = useMerlinWallet();
  const { data: userInfo, isLoading: isLoadingUserInfo } = useUserInfo();
  const [status, setStatus] = useState<LuckyCowStatus>(
    isFromLuckyChance ? LuckyCowStatus.REDEEM : LuckyCowStatus.PRELOADING
  );
  const [isLuckyCodeOpen, setIsLuckyCodeOpen] = useState(false);

  const { freePlayGame } = useFreeLuckyGame();

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
          <LuckyCardsPicker
            numsOfCard={10}
            numsOfSelectedCard={4}
            onStartScratching={() => {
              setStatus(LuckyCowStatus.CARDS_SCRATCHING);
            }}
          />
        );
      case LuckyCowStatus.CARDS_SCRATCHING:
        return <LuckyCardSlider />;
      default:
        return <Loader />;
    }
  }, [wallet, status]);

  useEffect(() => {
    if (userInfo?.freePlayGame) {
      setStatus(LuckyCowStatus.REDEEM);
      return;
    }
    if (userInfo?.isGameActive) {
      if (userInfo?.gameProgress === GameProgress.PAID) {
        setStatus(LuckyCowStatus.CARDS_PICKING);
      }

      if (userInfo?.gameProgress === GameProgress.CARD_SELECTED) {
        setStatus(LuckyCowStatus.CARDS_SCRATCHING);
      }
    } else {
      setStatus(LuckyCowStatus.BUY);
    }
  }, [userInfo?.isGameActive, userInfo?.freePlayGame]);

  if (wallet && isLoadingUserInfo) return <Loader />;

  return (
    <div className="flex flex-col items-center pt-20">
      {content}
      <LuckyCodeModal
        open={isLuckyCodeOpen}
        onCancel={() => setIsLuckyCodeOpen(false)}
        onSubmit={async () => {
          setStatus(LuckyCowStatus.LOADING_CARDS);
          const result = await freePlayGame();
          if (result.code !== 0) {
            setStatus(LuckyCowStatus.CARDS_PICKING);
          }
        }}
      />
    </div>
  );
};

export default LuckyCow;
