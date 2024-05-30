import PixelButton from 'components/PixelButton';
import LuckyCard from './components/LuckyCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import { cn } from 'utils/cn';
import 'swiper/css';
// import 'swiper/swiper-bundle.css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
// import { useRef } from 'react';
import styles from './ScratchLuckyCard.module.scss';

import SlideButton from './components/SlideButton';

const StrachLuckyCard = () => {
  const isSubmitting = false;
  // const swiperRef = useRef<SwiperRef>(null);

  return (
    <div className="mt-5 flex flex-col">
      <div className="h-[600px] w-[928px]">
        <Swiper
          className="px-[50px]"
          effect={'coverflow'}
          // grabCursor={true}
          centeredSlides={true}
          allowTouchMove={false}
          loop={true}
          slidesPerView={2}
          coverflowEffect={{
            rotate: 0,
            stretch: 80,
            depth: 60,
            modifier: 3
            // slideShadows: true
          }}
          modules={[EffectCoverflow]}
          // pagination={{ el: '.swiper-pagination', clickable: true }}
          // navigation={{
          //   nextEl: '.swiper-button-next',
          //   prevEl: '.swiper-button-prev'
          // }}
          // className={styles.swiper_container}
        >
          {[1, 2, 3, 4, 5].map((i) => {
            return (
              <SwiperSlide key={`lucky-card-${i}`}>
                <LuckyCard></LuckyCard>
              </SwiperSlide>
            );
          })}
          <div className={cn(styles.slidePrev, 'swiper-button-prev')}>
            <SlideButton type="prev" />
          </div>
          <div className={cn(styles.slideNext, 'swiper-button-next')}>
            <SlideButton type="next" />
          </div>
        </Swiper>
      </div>
      <div className="mt-12 justify-center font-pd text-2xl leading-none text-white">
        Only claim when you finish revealing all the cards
      </div>
      <div className="mt-12 flex justify-center pl-3">
        <PixelButton
          isLoading={isSubmitting}
          width={178}
          height={46}
          color="black"
          className="!bg-white text-2xl uppercase leading-none text-black">
          REDEEM
        </PixelButton>
      </div>
    </div>
  );
};

export default StrachLuckyCard;
