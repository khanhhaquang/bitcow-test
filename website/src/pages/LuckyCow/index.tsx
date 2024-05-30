import LuckyCardSlider from './components/LuckyCardSlider';
// import StrachLuckyCard from './ScratchLuckyCard';
import Loader from './components/Loader';
// import { Redeem } from './components/LuckyShop';

const LuckyCow = () => {
  const isLoadingAccess = false;

  if (isLoadingAccess) return <Loader />;

  return (
    <div className="flex flex-col items-center pt-20">
      {/* <Redeem /> */}
      <LuckyCardSlider></LuckyCardSlider>
    </div>
  );
};

export default LuckyCow;
