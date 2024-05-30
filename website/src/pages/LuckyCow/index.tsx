import Loader from './components/Loader';
import { Redeem } from './components/LuckyShop';

const LuckyCow = () => {
  const isLoadingAccess = false;

  if (isLoadingAccess) return <Loader />;

  return (
    <div className="flex flex-col items-center pt-20">
      <Redeem />
    </div>
  );
};

export default LuckyCow;
