import { LuckyDrawService } from 'services/luckyDraw';
import useMerlinWallet from './useMerlinWallet';
import { useMutation } from '@tanstack/react-query';
import useUserInfo from './useUserInfo';
import { UserService } from 'services/user';

export const useLuckyGame = () => {
  const { walletAddress } = useMerlinWallet();
  const { data: userInfo } = useUserInfo();

  const { mutateAsync: activateLuckyCode, isPending: isActivateLuckyCodeRequesting } = useMutation({
    mutationFn: (code: string) => UserService.activateInviteCode.call(walletAddress, code)
  });

  const {
    mutateAsync: freePlayGame,
    isPending: isFreePlayGameRequesting,
    data: freePlayGameResult
  } = useMutation({
    mutationFn: () => LuckyDrawService.freePlayGame.call(walletAddress)
  });

  const {
    mutateAsync: playGame,
    isPending: isPlayGameRequesting,
    data: playGameRequestResult
  } = useMutation({
    mutationFn: (txn: string) => LuckyDrawService.requestPlayGame.call(txn)
  });

  const {
    mutateAsync: pickCard,
    isPending: isPickCardRequesting,
    data: pickCardResult
  } = useMutation({
    mutationFn: (cardIndexID: string[]) =>
      LuckyDrawService.pickCard.call(userInfo?.orderID, cardIndexID) // onSuccess: (data) => data.code === 0 && refetchUserPoint()
  });

  const {
    mutateAsync: claim,
    isPending: isClaiming,
    data: claimResult
  } = useMutation({
    mutationFn: () => LuckyDrawService.claim.call(userInfo?.orderID)
  });

  return {
    activateLuckyCode,
    freePlayGame,
    playGame,
    pickCard,
    claim,
    isActivateLuckyCodeRequesting,
    isClaiming,
    claimResult,
    isPlayGameRequesting,
    playGameRequestResult,
    isFreePlayGameRequesting,
    freePlayGameResult,
    isPickCardRequesting,
    pickCardResult
  };
};
