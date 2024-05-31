import React, { useState } from 'react';
import LuckyCard from './LuckyCard';
import { cn } from 'utils/cn';
import styles from './LuckyCardSlider.module.scss';
import { ReactComponent as SlidePrevIcon } from 'resources/icons/slideLeft.svg';
import { ReactComponent as SlideNextIcon } from 'resources/icons/slideRight.svg';
import Button from 'components/Button';
import PixelButton from 'components/PixelButton';
import LuckyPrizeModal from './LuckyPrizeModal';

function LuckyCardSlider() {
  const [isLuckyPrizeOpen, setIsLuckyPrizeOpen] = useState(true);
  const [revealedAll, setRevealedAll] = useState(false);
  const data = [1, 2, 3, 4, 5];
  const [activeIndex, setactiveSlide] = useState(Math.floor(data.length / 2));
  const isSubmitting = false;

  const next = () =>
    activeIndex < data.length - 1 ? setactiveSlide(activeIndex + 1) : setactiveSlide(0);

  const prev = () =>
    activeIndex > 0 ? setactiveSlide(activeIndex - 1) : setactiveSlide(data.length - 1);

  const onClickRevealAll = () => {
    setRevealedAll(true);
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

  return (
    <div className="flex flex-col">
      <div className="relative flex w-[928px] justify-center">
        <div className={cn(styles.slideContainer, 'relative h-[600px]')}>
          {data.map((value, index) => {
            return (
              <div key={`lucky-card-${index}`} className={cn(styles.slide, getClassName(index))}>
                <LuckyCard disabled={index != activeIndex} revealed={revealedAll}></LuckyCard>
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
        <div className="absolute -right-[100px] bottom-0">
          <PixelButton
            onClick={onClickRevealAll}
            width={178}
            height={38}
            color="#000"
            className="bg-[#FFC700] text-2xl uppercase leading-none text-black">
            REVEAL ALL
          </PixelButton>
        </div>
      </div>
      <div className="mt-4 items-center justify-center text-center font-pd text-2xl leading-none text-white">
        Only claim when you finish
        <br />
        revealing all the cards
      </div>
      <div className="mt-5 flex justify-center pl-3">
        <PixelButton
          isLoading={isSubmitting}
          onClick={() => {
            setIsLuckyPrizeOpen(true);
          }}
          width={178}
          height={38}
          color="black"
          className="!bg-white text-2xl uppercase leading-none text-black">
          claim
        </PixelButton>
      </div>
      <LuckyPrizeModal open={isLuckyPrizeOpen} onCancel={() => setIsLuckyPrizeOpen(false)} />
    </div>
  );
}

export default LuckyCardSlider;
