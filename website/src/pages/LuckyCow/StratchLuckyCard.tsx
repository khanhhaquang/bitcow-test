import PixelButton from 'components/PixelButton';
import LuckyCard from './components/LuckyCard';

const StrachLuckyCard = () => {
  const isSubmitting = false;
  return (
    <div>
      <LuckyCard></LuckyCard>
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
