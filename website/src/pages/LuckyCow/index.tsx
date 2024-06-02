import { useEffect, useMemo, useState } from 'react';

import useMerlinWallet from 'hooks/useMerlinWallet';

import Loader from './components/Loader';
import LuckyCardsPicker from './components/LuckyCardsPicker';
import LuckyCodeModal from './components/LuckyCodeModal';
import { Buy, NotConnected, Redeem } from './components/LuckyShop';
import useUserInfo from 'hooks/useUserInfo';

import LuckyCardSlider from './components/LuckyCardSlider';
import { useLocation } from 'react-router-dom';
import { GameProgress } from 'services/user';
import { useLuckyGame } from 'hooks/useLuckyGame';
import LuckyPrizeModal from './components/LuckyPrizeModal';

export enum LuckyCowStatus {
  PRELOADING,
  REDEEM,
  BUY,
  CARDS_PICKING,
  CARDS_SCRATCHING
}

const LuckyCow = () => {
  const { state } = useLocation();
  const { isFromLuckyChance } = (state || {}) as { isFromLuckyChance?: boolean };

  const { wallet } = useMerlinWallet();
  const { playGame, isPlayGameRequesting, playGameRequestResult } = useLuckyGame();
  const { data: userInfo } = useUserInfo();
  const [status, setStatus] = useState<LuckyCowStatus>(
    isFromLuckyChance ? LuckyCowStatus.REDEEM : LuckyCowStatus.PRELOADING
  );
  const [isLuckyCodeOpen, setIsLuckyCodeOpen] = useState(false);
  const [isLuckyPrizeOpen, setIsLuckyPrizeOpen] = useState(false);

  const content = useMemo(() => {
    switch (status) {
      case LuckyCowStatus.BUY:
        return (
          <Buy
            onBuyCallback={(hash: string) => {
              playGame(hash);
            }}
            onClickRedeemCode={() => setIsLuckyCodeOpen(true)}
          />
        );
      case LuckyCowStatus.REDEEM:
        return (
          <Redeem
            onClickRedeem={() => {
              setStatus(LuckyCowStatus.CARDS_PICKING);
            }}
          />
        );
      case LuckyCowStatus.CARDS_PICKING:
        return (
          <LuckyCardsPicker
            numsOfCard={10}
            numsOfSelectedCard={userInfo?.quantity}
            onStartScratching={() => {
              setStatus(LuckyCowStatus.CARDS_SCRATCHING);
            }}
          />
        );
      case LuckyCowStatus.CARDS_SCRATCHING:
        return (
          <LuckyCardSlider
            onClaim={() => {
              setStatus(LuckyCowStatus.BUY);
              setIsLuckyPrizeOpen(true);
            }}
          />
        );
      default:
        return <Loader />;
    }
  }, [wallet, status]);

  useEffect(() => {
    if (isFromLuckyChance) return;

    if (userInfo?.isGameActive) {
      if (userInfo?.gameProgress === GameProgress.CARD_SELECTED) {
        setStatus(LuckyCowStatus.CARDS_PICKING);
      } else {
        setStatus(LuckyCowStatus.CARDS_PICKING);
      }
    } else if (userInfo?.freePlayGame) {
      setStatus(LuckyCowStatus.REDEEM);
    } else {
      setStatus(LuckyCowStatus.BUY);
      return;
    }
  }, [userInfo?.isGameActive, userInfo?.freePlayGame, userInfo?.gameProgress]);

  useEffect(() => {
    if (playGameRequestResult?.code === 0) {
      setStatus(LuckyCowStatus.CARDS_PICKING);
    }
  }, [playGameRequestResult]);

  if (!wallet)
    return (
      <div className="flex flex-col items-center pt-20">
        <NotConnected />
      </div>
    );

  if (!userInfo) return <Loader />;

  if (isPlayGameRequesting) return <Loader>Preparing your card...</Loader>;

  return (
    <div className="flex flex-col items-center pt-20">
      {content}
      <LuckyCodeModal
        open={isLuckyCodeOpen}
        onCancel={() => setIsLuckyCodeOpen(false)}
        onSubmit={() => {
          setStatus(LuckyCowStatus.REDEEM);
          setIsLuckyCodeOpen(false);
        }}
      />
      <LuckyPrizeModal open={isLuckyPrizeOpen} onCancel={() => setIsLuckyPrizeOpen(false)} />
    </div>
  );
};

export default LuckyCow;
