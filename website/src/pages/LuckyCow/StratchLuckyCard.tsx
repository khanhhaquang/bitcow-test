import PixelButton from 'components/PixelButton';
import LuckyCard from './components/LuckyCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import 'swiper/css';
// import 'swiper/swiper-bundle.css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
// import { useRef } from 'react';
// import styles from './StratchLuckyCard.module.scss';
// const swiper = useSwiper();
// const swiperSlide = useSwiperSlide();

const StrachLuckyCard = () => {
  const isSubmitting = false;
  // const swiperRef = useRef<SwiperRef>(null);
  return (
    <div className="mt-5 flex flex-col">
      <div className="h-[900px] w-[900px]">
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={3}
          coverflowEffect={{
            rotate: 0,
            stretch: 15,
            depth: 40,
            modifier: 8
            // slideShadows: true
          }}
          modules={[EffectCoverflow, Navigation]}
          // pagination={{ el: '.swiper-pagination', clickable: true }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }}
          // className={styles.swiper_container}
        >
          {[1, 2, 3, 4, 5].map((i) => {
            return (
              <SwiperSlide key={`lucky-card-${i}`}>
                <LuckyCard></LuckyCard>
              </SwiperSlide>
            );
          })}
        </Swiper>
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
