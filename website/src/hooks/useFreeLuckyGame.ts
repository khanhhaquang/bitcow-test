import { LuckyDrawService } from 'services/luckyDraw';
import useMerlinWallet from './useMerlinWallet';
import { useMutation } from '@tanstack/react-query';

export const useFreeLuckyGame = () => {
  const { walletAddress } = useMerlinWallet();
  const { mutateAsync: freePlayGame } = useMutation({
    mutationFn: () => LuckyDrawService.freePlayGame.call(walletAddress)
  });

  return { freePlayGame };
};
