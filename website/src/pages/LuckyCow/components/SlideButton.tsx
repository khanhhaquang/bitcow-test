import { useSwiper } from 'swiper/react';
import { ReactComponent as SlidePrevIcon } from 'resources/icons/slideLeft.svg';
import { ReactComponent as SlideNextIcon } from 'resources/icons/slideRight.svg';
import Button from 'components/Button';
interface TProps {
  type: 'prev' | 'next';
}

const SlideButton: React.FC<TProps> = ({ type }) => {
  const swiper = useSwiper();
  const onClickSlide = () => {
    console.log(swiper.activeIndex);
    if (type === 'prev') {
      swiper.slidePrev();
    } else {
      swiper.slideNext();
    }
  };

  return (
    <Button
      variant="icon"
      className="bg-transparent hover:opacity-90 active:opacity-50"
      onClick={onClickSlide}>
      {type === 'prev' ? (
        <SlidePrevIcon width={73} height={110} />
      ) : (
        <SlideNextIcon width={73} height={110} />
      )}
    </Button>
  );
};

export default SlideButton;
