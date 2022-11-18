import { useContext } from 'react';

import { GlobalSettingContext } from 'contexts/GlobalSettingProvider';

const useGlobalSetting = () => useContext(GlobalSettingContext);

export default useGlobalSetting;
