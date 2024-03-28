import { useContext } from 'react';

import { NetworkContext } from '../contexts/NetworkProvider';

const useNetworkContext = () => useContext(NetworkContext);

export default useNetworkContext;
