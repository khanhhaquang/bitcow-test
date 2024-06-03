import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import useMerlinWallet from 'hooks/useMerlinWallet';
import useUserInfo from 'hooks/useUserInfo';
import { GameProgress } from 'services/user';
import { useLuckyGame } from 'hooks/useLuckyGame';
import Loader from './components/Loader';
import LuckyCardsPicker from './components/LuckyCardsPicker';
import LuckyCodeModal from './components/LuckyCodeModal';
import { Buy, NotConnected, Redeem } from './components/LuckyShop';
import LuckyCardSlider from './components/LuckyCardSlider';
import LuckyPrizeModal from './components/LuckyPrizeModal';

export enum LuckyCowStatus {
  PRELOADING,
  REDEEM,
  BUY,
  CARDS_PICKING,
  CARDS_SCRATCHING
}

const MAX_CARDS = 5;

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center pt-20 laptop:scale-75 laptop:pt-0">{children}</div>
  );
};

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
            numberOfCards={MAX_CARDS}
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
            numsOfCard={MAX_CARDS}
            numsOfSelectedCard={userInfo?.quantity || 0}
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
  }, [status, userInfo?.quantity]);

  useEffect(() => {
    if (isFromLuckyChance) {
      window.history.replaceState({}, '');
      return;
    }

    if (userInfo?.isGameActive) {
      if (userInfo?.gameProgress === GameProgress.CARD_SELECTED) {
        setStatus(LuckyCowStatus.CARDS_SCRATCHING);
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
      <Wrapper>
        <NotConnected />
      </Wrapper>
    );

  if (!userInfo) return <Loader />;

  if (isPlayGameRequesting) return <Loader>Preparing your card...</Loader>;

  return (
    <Wrapper>
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
    </Wrapper>
  );
};

export default LuckyCow;
