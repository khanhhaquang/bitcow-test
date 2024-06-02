import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FC, useMemo, useState } from 'react';

import { LuckyCoin } from 'resources/icons';
import { ILuckNews, LuckyDrawService } from 'services/luckyDraw';

type LuckyHightLightItemProps = Pick<ILuckNews, 'address' | 'amount' | 'token' | 'tokenIcon'>;

enum LuckyHighLightIconStatus {
  SUCCESS,
  ERROR
}

const LuckyHightLightItem: FC<LuckyHightLightItemProps> = ({
  address,
  amount,
  token,
  tokenIcon
}) => {
  const [iconStatus, setIconStatus] = useState<LuckyHighLightIconStatus>(
    LuckyHighLightIconStatus.SUCCESS
  );

  const onImgError = () => {
    setIconStatus(LuckyHighLightIconStatus.ERROR);
  };
  const compressedAddress =
    address?.length > 4
      ? `${address.slice(0, 2)}...${address.slice(address.length - 2, address.length)}`
      : address;

  return (
    <div className="flex flex-nowrap items-center gap-2 text-2xl leading-6">
      <span className="whitespace-nowrap font-pd text-white">
        {compressedAddress.toUpperCase()} just won:
      </span>
      <span className="whitespace-nowrap font-pdb text-color_yellow_3">
        {amount} {token}
      </span>
      {iconStatus === LuckyHighLightIconStatus.SUCCESS ? (
        <img
          src={tokenIcon}
          className="ml-1 h-6 w-6 min-w-[24px]"
          alt={token}
          onError={onImgError}
        />
      ) : (
        // fallback icon
        <LuckyCoin className="ml-1" />
      )}
    </div>
  );
};

const LuckyResultHighlight = () => {
  const { data: newsData } = useQuery({
    queryKey: [LuckyDrawService.getNewsList.key],
    queryFn: LuckyDrawService.getNewsList.call,
    enabled: true
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
          duration: 30,
          ease: 'linear',
          repeat: Infinity
        }}>
        {winners?.map((item) => (
          <LuckyHightLightItem key={item?.id} {...item} />
        ))}
      </motion.div>
    );
  }, [newsData?.data]);

  return (
    <div className="z-10 flex w-screen items-center gap-3 overflow-hidden border-4 border-black bg-[#BA3800] py-[18px] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.10),3px_3px_0px_0px_rgba(0,0,0,0.10)]">
      {content}
      {content}
    </div>
  );
};

export default LuckyResultHighlight;
