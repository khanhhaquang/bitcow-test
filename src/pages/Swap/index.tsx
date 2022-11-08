/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Card from 'components/Card';
import { Formik, FormikHelpers } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import * as yup from 'yup';
import { SettingIcon } from 'resources/icons';
// import SwapSetting from './components/SwapSetting';
// import styles from './Swap.module.scss';
import { useSelector } from 'react-redux';
import { getSwapSettings } from 'modules/swap/reducer';
import TokenSwap from './components/TokenSwap';
// import useHippoClient from 'hooks/useHippoClient';
// import { ISwapSettings } from './types';

const validationSchema = yup.object({
  currencyFrom: yup.object({
    // token: yup.required(),
    amount: yup.number().required(),
    balance: yup.number().required()
  }),
  expertMode: yup.boolean(),
  disableIndirect: yup.boolean(),
  privacySwap: yup.boolean()
});

const Swap: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const swapSettings = useSelector(getSwapSettings);
  // const { hippoSwap, hippoWallet, requestSwap } = useHippoClient();

  const renderCardHeader = useMemo(
    () => (
      <div className="w-full flex justify-start relative">
        <h5 className="font-bold text-white text-base">Swap</h5>
      </div>
    ),
    [setIsVisible, isVisible]
  );

  const onSubmitSwap = useCallback(() => {
    console.log('on submit swap');
  }, []);

  return (
    <div className="w-full max-w-[463px] mx-auto mt-[140px] flex flex-col justify-center items-center h-full relative">
      <Formik
        initialValues={swapSettings}
        validationSchema={validationSchema}
        onSubmit={onSubmitSwap}>
        <TokenSwap />
        {/* <Card className="relative w-[432px] min-h-[442px] py-6 px-5 flex flex-col bg-color_bg_3 text-white font-Rany">
          <button className="absolute py-6 px-5 top-0 right-0 cursor-pointer">
            <SettingIcon />
          </button>
          {renderCardHeader}
        </Card> */}
      </Formik>
    </div>
  );
};

export default Swap;
