import { useContext } from 'react';

import { PoolsContext } from 'contexts/PoolsProvider';

const usePools = () => useContext(PoolsContext);

export default usePools;
