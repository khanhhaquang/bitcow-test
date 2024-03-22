import { useContext } from 'react';

import { MerlinWalletContext } from 'contexts/MerlinWalletProvider';

const useMerlinWallet = () => useContext(MerlinWalletContext);

export default useMerlinWallet;
