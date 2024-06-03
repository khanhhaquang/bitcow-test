import { useEffect, useMemo, useRef, useState } from 'react';
import ScratchCard from './ScratchCard';
import imageScratchChest from 'resources/img/scratchChest.webp';
import imageScratchToken from 'resources/img/scratchToken.webp';
import imageScratchAmount from 'resources/img/scratchAmount.webp';
import imageLuckyToken from 'resources/img/luckyCardToken.webp';
import imageLuckyAmount from 'resources/img/luckyCardAmount.webp';
import imageLuckyTitle from 'resources/img/luckyCardTitle.webp';
import imageLuckyTop from 'resources/img/luckyCardBgTop.webp';
import imageLuckyLeft from 'resources/img/luckyCardBgLeft.webp';
import imageLuckyRight from 'resources/img/luckyCardBgRight.webp';
import imageNextTime from 'resources/img/nextTime.webp';
import imageJackpot from 'resources/img/jackpot.webp';
import { Image } from 'antd';
import styles from './LuckyCard.module.scss';
import { cn } from 'utils/cn';
import {
  CardCornerBottomLeft,
  CardCornerBottomRight,
  CardCornerTopLeft,
  CardCornerTopRight
} from 'resources/icons';
import { ILuckyCardInfo } from 'services/luckyDraw';
import useTokenAwardInfo from 'hooks/useTokenAwardInfo';

interface TProps {
  cardInfo: ILuckyCardInfo;
  disabled?: boolean;
  revealed?: boolean;
  onComplete: () => void;
}

const LuckyCard: React.FC<TProps> = ({ cardInfo, disabled, revealed, onComplete }) => {
  const { data: tokenInfo, isFetched, isLoading, refetch } = useTokenAwardInfo();
  const [finishScratch, setFinishScratch] = useState<Array<string>>([]);
  const cardRef = useRef<ScratchCard>(null);
  const finishPercent = 50;
  const fadeOutOnComplete = true;
  const brushSize = 10;

  const chestList = [0, 0, 0, 0];
  const decNumber = (num: number) => {
    // if (num / 10000 >= 1) {
    //   const decNum = num / 10000;
    //   return decNum.toPrecision(3);
    // } else {
    //   return num;
    // }
    const numString = num.toString();
    if (numString.length > 3) {
      const sub = numString.substring(0, 3);
      return sub.endsWith('.') ? sub.substring(0, sub.length - 1) : sub;
    } else {
      return numString;
    }
  };

  const tokenContent = useMemo(() => {
    return cardInfo.tokens.map((value, index) => {
      const iconUrl = tokenInfo ? tokenInfo?.find((w) => w.tokenSymbol === value)?.tokenIcon : '';
      return (
        <ScratchCard
          key={`scratch-token-${index}`}
          ref={cardRef}
          width={60}
          height={26}
          image={imageScratchToken}
          brushSize={brushSize}
          disabled={disabled}
          revealed={revealed}
          fadeOutOnComplete={fadeOutOnComplete}
          finishPercent={finishPercent}
          onComplete={() => onCompleteScratch(`scratch-token-${index}`)}>
          <div className="flex h-full w-full items-center justify-center">
            <Image src={iconUrl} width={13} height={13} className="rounded-full" preview={false} />
            <div className="ml-1 h-[13px] text-sm leading-none text-black">{value}</div>
          </div>
        </ScratchCard>
      );
    });
  }, [tokenInfo, revealed, disabled, finishScratch]);

  useEffect(() => {
    if (!isFetched && !isLoading) {
      refetch();
    }
  }, [isFetched, isLoading]);

  const onCompleteScratch = (key) => {
    if (!finishScratch.includes(key)) {
      // console.log('finishScrach', key);
      setFinishScratch([...finishScratch, key]);
    }
    if (finishScratch.length >= 24) {
      onComplete();
    }
  };

  return (
    <div className="relative h-[600px] w-[414px] border-[3px] border-black bg-[#FD8900] shadow-bc-swap backdrop-blur-lg">
      <img
        src={imageLuckyTop}
        width={345}
        height={84}
        className="absolute top-[78px] left-1/2 -ml-[166px]"
      />
      <img src={imageLuckyLeft} width={138} height={132} className="absolute bottom-0 left-0" />
      <img src={imageLuckyRight} width={132} height={130} className="absolute bottom-0 right-0" />
      <div className="absolute flex h-full w-full flex-col">
        <div className="mb-[59px] flex justify-center">
          <Image src={imageLuckyTitle} width={342} height={94} preview={false} />
        </div>
        <div className="flex justify-center gap-x-5">
          {chestList.map((value, index) => (
            <ScratchCard
              key={`scratch-chest-${index}`}
              ref={cardRef}
              width={70}
              height={57}
              image={imageScratchChest}
              brushSize={brushSize}
              disabled={disabled}
              revealed={revealed}
              fadeOutOnComplete={fadeOutOnComplete}
              finishPercent={finishPercent}
              onComplete={() => onCompleteScratch(`scratch-chest-${index}`)}>
              <div className="flex h-full w-full items-center justify-center">
                {value > 0 ? (
                  <Image src={imageJackpot} width={58} height={39} preview={false} />
                ) : (
                  <Image src={imageNextTime} width={51} height={34} preview={false} />
                )}
              </div>
            </ScratchCard>
          ))}
        </div>
        <div className="relative mx-3 my-3 flex flex-col justify-center bg-white/10 py-2">
          <CardCornerTopLeft className="absolute top-0 left-0" />
          <CardCornerTopRight className="absolute top-0 right-0" />
          <CardCornerBottomLeft className="absolute bottom-0 left-0" />
          <CardCornerBottomRight className="absolute bottom-0 right-0" />
          <div className="flex justify-center">
            <Image src={imageLuckyToken} width={103} height={36} preview={false} />
          </div>
          <div className="mt-3 flex justify-center">
            <div className="grid w-[330px] grid-cols-5 gap-x-2 gap-y-1">{tokenContent}</div>
          </div>
          <div className="mt-3 flex justify-center text-center font-pd text-sm leading-none text-amber-900">
            The token that appears the most times
            <br /> will be the one you receive
          </div>
        </div>
        <div className="flex flex-col justify-center px-3">
          <div className="flex justify-center">
            <Image src={imageLuckyAmount} width={103} height={36} preview={false} />
          </div>
          <div className="mt-3 flex justify-center">
            <div className="grid w-[302px] grid-cols-5 place-content-center gap-x-3 gap-y-1">
              {cardInfo.amounts.map((value, index) => (
                <ScratchCard
                  key={`scratch-amount-${index}`}
                  ref={cardRef}
                  width={48}
                  height={45}
                  image={imageScratchAmount}
                  disabled={disabled}
                  revealed={revealed}
                  brushSize={brushSize}
                  fadeOutOnComplete={fadeOutOnComplete}
                  finishPercent={finishPercent}
                  onComplete={() => onCompleteScratch(`scratch-amount-${index}`)}>
                  <div
                    className={cn(
                      styles.strokeText,
                      'flex justify-center font-pdb text-[22px] leading-none'
                    )}
                    data-storke={decNumber(value)}>
                    {decNumber(value)}
                  </div>
                </ScratchCard>
              ))}
            </div>
          </div>
          <div className="mt-3 flex justify-center text-center font-pd text-sm leading-none text-amber-900">
            The largest number here will be the <br />
            token amount you receive
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyCard;
