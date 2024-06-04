import React, { useEffect, useState } from 'react';
import LuckyCard from './LuckyCard';
import { cn } from 'utils/cn';
import styles from './LuckyCardSlider.module.scss';
import { ReactComponent as SlidePrevIcon } from 'resources/icons/slideLeft.svg';
import { ReactComponent as SlideNextIcon } from 'resources/icons/slideRight.svg';
import Button from 'components/Button';
import PixelButton from 'components/PixelButton';
import useUserInfo from 'hooks/useUserInfo';
import { useDispatch } from 'react-redux';
import { ILuckyCardInfo } from 'services/luckyDraw';
import luckyCowAction from 'modules/luckyCow/actions';
import { useLuckyGame } from 'hooks/useLuckyGame';

interface TProps {
  onClaim: () => void;
}
const LuckyCardSlider: React.FC<TProps> = ({ onClaim }) => {
  const dispatch = useDispatch();
  const [revealedAll, setRevealedAll] = useState(false);
  const [completeCard, setCompleteCard] = useState<Array<string>>([]);
  const { data: userInfo, isFetched, isLoading, refetch } = useUserInfo();
  const [data, setData] = useState<Array<ILuckyCardInfo>>([]);
  const [activeIndex, setActiveSlide] = useState(0);
  const { claim, isClaiming, claimResult } = useLuckyGame();

  useEffect(() => {
    if (!userInfo || !userInfo.pickCard) {
      refetch();
    } else {
      let pickedCard = [];
      Object.keys(userInfo.pickCard).forEach((key) => {
        const card: ILuckyCardInfo = userInfo.pickCard[key] as ILuckyCardInfo;
        pickedCard.push(card);
      });
      // const sample = {
      //   tokens: [
      //     'i-coin',
      //     'c-coin',
      //     'b-coin',
      //     'g-coin',
      //     'd-coin',
      //     'd-coin',
      //     'd-coin',
      //     'b-coin',
      //     'h-coin',
      //     'f-coin'
      //   ],
      //   amounts: [179.36, 24.89, 212.6, 185.24, 63.09, 43.53, 141.72, 88.52, 138.73, 143.74],
      //   luckyAmount: 212.6,
      //   luckyToken: 'xxx',
      //   luckyTokenAddress: ''
      // };
      // pickedCard.push(sample);
      // pickedCard.push(sample);
      // pickedCard.push(sample);
      // pickedCard.push(sample);

      setData(pickedCard);
      setActiveSlide(Math.floor(data.length / 2));
      dispatch(luckyCowAction.SET_PICKED_CARD(pickedCard));
    }
  }, [isFetched, isLoading, userInfo]);

  const next = () =>
    activeIndex < data.length - 1 ? setActiveSlide(activeIndex + 1) : setActiveSlide(0);

  const prev = () =>
    activeIndex > 0 ? setActiveSlide(activeIndex - 1) : setActiveSlide(data.length - 1);

  const onClickRevealAll = () => {
    setRevealedAll(true);
  };
  const onCompleteCard = (key) => {
    if (!completeCard.includes(key)) {
      // console.log('complete card', key);
      setCompleteCard([...completeCard, key]);
    }
    if (completeCard.length >= data.length) {
      setRevealedAll(true);
    }
  };
  const getClassName = (index) => {
    if (activeIndex === index) return styles.slideActive;
    else if (activeIndex - 1 === index || activeIndex + 4 === index) return styles.slideSecondLeft;
    else if (activeIndex + 1 === index || activeIndex - 4 === index) return styles.slideSecondRight;
    else if (activeIndex - 2 === index || activeIndex + 3 === index) return styles.slideThirdLeft;
    else if (activeIndex + 2 === index || activeIndex - 3 === index) return styles.slideThirdRight;
    else if (index < activeIndex - 2) return styles.slideBackLeft;
    else if (index > activeIndex + 2) return styles.slideBackRight;
  };

  useEffect(() => {
    if (claimResult?.code === 0) {
      console.log('claim hash: ', claimResult.data.claimHash);
      dispatch(luckyCowAction.SET_CLAIM_HASH(claimResult.data.claimHash));
      onClaim();
    }
  }, [claimResult]);

  return (
    <div className="flex flex-col">
      <div className="relative flex w-[928px] justify-center">
        <div className={cn(styles.slideContainer, 'relative h-[600px]')}>
          {data.map((value, index) => {
            return (
              <div key={`lucky-card-${index}`} className={cn(styles.slide, getClassName(index))}>
                <LuckyCard
                  cardInfo={value}
                  disabled={index != activeIndex}
                  revealed={revealedAll}
                  onComplete={() => onCompleteCard(`lucky-card-${index}`)}></LuckyCard>
              </div>
            );
          })}
        </div>
        {data.length > 1 && (
          <div className={cn(styles.slidePrev, 'swiper-button-prev')}>
            <Button
              variant="icon"
              className="bg-transparent hover:opacity-90 active:opacity-50"
              onClick={prev}>
              <SlidePrevIcon width={73} height={110} />
            </Button>
          </div>
        )}
        {data.length > 1 && (
          <div className={cn(styles.slideNext, 'swiper-button-next')}>
            <Button
              variant="icon"
              className="bg-transparent hover:opacity-90 active:opacity-50"
              onClick={next}>
              <SlideNextIcon width={73} height={110} />
            </Button>
          </div>
        )}
        {!revealedAll && (
          <div className="absolute -right-[100px] bottom-0">
            <PixelButton
              onClick={onClickRevealAll}
              width={178}
              height={38}
              color="#000"
              className="bg-[#FFC700] text-2xl uppercase leading-none text-black hover:!bg-[#FFC700] hover:!bg-lucky-redeem-btn-hover active:!bg-[#FFA800] active:!text-black">
              REVEAL ALL
            </PixelButton>
          </div>
        )}
      </div>
      <div className="mt-4 items-center justify-center text-center font-pd text-2xl leading-none text-white">
        Only claim when you finish
        <br />
        revealing all the cards
      </div>
      <div className="mt-5 flex justify-center pl-3">
        <PixelButton
          disabled={!revealedAll || isClaiming}
          onClick={() => claim()}
          isLoading={isClaiming}
          width={178}
          height={38}
          color="black"
          className="!bg-white text-2xl uppercase leading-none text-black hover:!bg-white hover:!text-black/60 active:translate-x-1 active:translate-y-1 active:!bg-white active:!text-black disabled:!bg-[#B8B8B8] disabled:!text-black/40">
          {isClaiming ? 'processing' : 'claim'}
        </PixelButton>
      </div>
    </div>
  );
};

export default LuckyCardSlider;
