import useMerlinWallet from 'hooks/useMerlinWallet';
import Loader from './components/Loader';
import { Buy, NotConnected, Redeem } from './components/LuckyShop';
import { useMemo, useState } from 'react';

const LuckyCow = () => {
  const { wallet } = useMerlinWallet();
  const [isRedeem] = useState(false);

  const isLoadingAccess = false;

  const content = useMemo(() => {
    if (!wallet) return <NotConnected />;

    if (isRedeem) return <Redeem />;

    return <Buy />;
  }, [wallet, isRedeem]);

  if (wallet && isLoadingAccess) return <Loader />;

  return <div className="flex flex-col items-center pt-20">{content}</div>;
};

export default LuckyCow;
