import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import useTokenAwardInfo from 'hooks/useTokenAwardInfo';
import { FC, useEffect, useMemo, useState } from 'react';

import { LuckyCoin } from 'resources/icons';
import { ILuckNews, LuckyDrawService } from 'services/luckyDraw';
import { cn } from 'utils/cn';
import { displayAddress } from 'wallet/utils/formatter';

enum LuckyHighLightIconStatus {
  SUCCESS,
  ERROR
}

const LuckyHightLightItem: FC<{ data: ILuckNews }> = ({ data }) => {
  const { address, amount, token, tokenIcon } = data;

  const { data: tokensInfo } = useTokenAwardInfo();
  const [iconStatus, setIconStatus] = useState<LuckyHighLightIconStatus>(
    LuckyHighLightIconStatus.SUCCESS
  );

  const tokenUrl = useMemo(
    () => tokensInfo?.find((t) => t.contractAddress === token)?.tokenIcon || '',
    [tokensInfo, token]
  );

  const onImgError = () => {
    setIconStatus(LuckyHighLightIconStatus.ERROR);
  };

  return (
    <div className="flex flex-nowrap items-center gap-x-2 text-2xl leading-6">
      <span className="whitespace-nowrap font-pd text-white">
        {displayAddress(address).toUpperCase()} just won:
      </span>
      <span className="whitespace-nowrap font-pdb text-color_yellow_3">
        {amount} {tokenIcon}
      </span>
      {iconStatus === LuckyHighLightIconStatus.SUCCESS && tokenUrl ? (
        <img
          src={tokenUrl}
          className="ml-1 h-6 w-6 min-w-[24px]"
          alt={tokenIcon}
          onError={onImgError}
        />
      ) : (
        // fallback icon
        <LuckyCoin className="ml-1" />
      )}
    </div>
  );
};

const LuckyResultHighlight: FC<{ classNames?: string }> = ({ classNames }) => {
  const {
    data: newsData,
    refetch,
    isFetched,
    isLoading
  } = useQuery({
    queryKey: [LuckyDrawService.getNewsList.key],
    queryFn: () => LuckyDrawService.getNewsList.call(),
    enabled: false
  });
  // duplicated content for infinity loop
  const content = useMemo(() => {
    const winners = newsData?.data || [];
    return (
      <motion.div
        className="flex h-6 items-center gap-3"
        animate={{
          translateX: ['0%', '-100%']
        }}
        transition={{
          duration: 60,
          ease: 'linear',
          repeat: Infinity
        }}>
        {winners?.map((item) => (
          <LuckyHightLightItem key={item?.id} data={item} />
        ))}
      </motion.div>
    );
  }, [newsData?.data]);

  useEffect(() => {
    if (!isFetched && !isLoading) {
      refetch();
    }
  }, [isFetched, isLoading]);

  return (
    <div
      className={cn(
        'fixed inset-x-0 z-10 flex h-15 w-screen items-center gap-3 overflow-hidden border-y-4 border-black bg-[#BA3800] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.10),3px_3px_0px_0px_rgba(0,0,0,0.10)]',
        classNames
      )}>
      {content}
      {content}
    </div>
  );
};

export default LuckyResultHighlight;
