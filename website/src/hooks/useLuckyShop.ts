import { useMutation, useQuery } from '@tanstack/react-query';
import useMerlinWallet from './useMerlinWallet';
import { formatEther } from 'viem';
import { useMemo } from 'react';

const useLuckyShop = () => {
  const { bitcowSDK, walletAddress } = useMerlinWallet();

  const { data: allowanceResult } = useQuery({
    queryKey: ['bitcowSDK.lotteryToken.allowance', bitcowSDK, walletAddress],
    queryFn: () =>
      bitcowSDK?.lotteryToken?.allowance(walletAddress, bitcowSDK.lottery.contractAddress),
    enabled: true
  });

  const { isPending: isIncreasingAllowance, mutateAsync: increaseAllowance } = useMutation({
    mutationFn: (data: { amount: number }) =>
      bitcowSDK?.lotteryToken?.increaseAllowance(bitcowSDK.lottery.contractAddress, data.amount)
  });

  const { isPending: isPurchasing, mutateAsync: purchase } = useMutation({
    mutationFn: (data: { amount: number }) =>
      bitcowSDK.lottery?.purchase(1, data.amount, bitcowSDK.lotteryToken.contractAddress)
  });

  const allowance = useMemo(
    () => (allowanceResult ? Number(formatEther(allowanceResult)) : 0),
    [allowanceResult]
  );

  console.log('allowance', allowance);

  return { allowance, increaseAllowance, isIncreasingAllowance, purchase, isPurchasing };
};

export default useLuckyShop;
