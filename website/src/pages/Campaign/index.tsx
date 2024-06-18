// import useMerlinWallet from 'hooks/useMerlinWallet';
// import { useMemo } from 'react';
import MiningGala from './components/MiningGala';

const Campaign = () => {
  // const { isLoggedIn } = useMerlinWallet();
  // const content = useMemo(() => {
  //   return MiningGala();
  // }, [isLoggedIn]);

  return (
    <div className="relative flex flex-col items-center pt-20">
      <MiningGala></MiningGala>
    </div>
  );
};
export default Campaign;
