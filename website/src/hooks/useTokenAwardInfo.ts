import { useQuery } from '@tanstack/react-query';
import { LuckyDrawService } from 'services/luckyDraw';

const useTokenAwardInfo = () => {
  return useQuery({
    queryKey: [LuckyDrawService.getTokenAwardList.key],
    queryFn: () => LuckyDrawService.getTokenAwardList.call(),
    select: (data) => data?.data
  });
};

export default useTokenAwardInfo;
