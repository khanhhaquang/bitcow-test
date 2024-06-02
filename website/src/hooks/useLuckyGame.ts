import { LuckyDrawService } from 'services/luckyDraw';
import useMerlinWallet from './useMerlinWallet';
import { useMutation } from '@tanstack/react-query';
import useUserInfo from './useUserInfo';

export const useLuckyGame = () => {
  const { walletAddress } = useMerlinWallet();
  const { data: userInfo } = useUserInfo();

  const { mutateAsync: freePlayGame } = useMutation({
    mutationFn: () => LuckyDrawService.freePlayGame.call(walletAddress)
  });

  const {
    mutateAsync: playGame,
    isPending: isPlayGameRequesting,
    data: playGameRequestResult
  } = useMutation({
    mutationFn: (txn: string) => LuckyDrawService.requestPlayGame.call(txn)
  });

  const { mutateAsync: pickCard } = useMutation({
    mutationFn: (cardIndexID: string[]) =>
      LuckyDrawService.pickCard.call(userInfo.orderID, cardIndexID) // onSuccess: (data) => data.code === 0 && refetchUserPoint()
  });

  return { freePlayGame, playGame, pickCard, isPlayGameRequesting, playGameRequestResult };
};
