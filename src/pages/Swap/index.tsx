/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Types } from 'aptos';
import { Formik, FormikHelpers } from 'formik';
import { getSwapSettings } from 'modules/swap/reducer';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

import Card from 'components/Card';
import useAptosWallet from 'hooks/useAptosWallet';
import { SettingIcon } from 'resources/icons';

// import SwapSetting from './components/SwapSetting';
// import styles from './Swap.module.scss';

import { openErrorNotification } from 'utils/notifications';

import TokenSwap from './components/TokenSwap';
import { ISwapSettings } from './types';
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
  const { requestSwap } = useAptosWallet();
  // const { hippoSwap, hippoWallet, requestSwap } = useHippoClient();

  const onSubmitSwap = useCallback(
    async (values: ISwapSettings, formikHelper: FormikHelpers<ISwapSettings>) => {
      console.log('on submit swap');
      const fromToken = values.currencyFrom?.token;
      const toToken = values.currencyTo?.token;
      const inputAmt = values.currencyFrom?.amount;
      const minOutputAmt = values.currencyTo?.amount * (1 - values.slipTolerance / 100);
      if (fromToken && toToken && inputAmt && minOutputAmt) {
        const options: Partial<Types.SubmitTransactionRequest> = {
          expiration_timestamp_secs:
            '' + (Math.floor(Date.now() / 1000) + values.trasactionDeadline * 60)
          // max_gas_amount: '' + values.maxGasFee
        };
        const result = await requestSwap({ fromToken, toToken, inputAmt, minOutputAmt, options });
        console.log('swap result>>>', result);
        if (result) {
          // formikHelper.setFieldValue('currencyFrom', {
          //   ...values.currencyFrom,
          //   amount: 0
          // });
          formikHelper.resetForm();
        }
        formikHelper.setSubmitting(false);
      } else {
        openErrorNotification({ detail: 'Invalid input for swapping' });
      }
    },
    [requestSwap]
  );

  return (
    <div className="relative mx-auto mt-[140px] flex h-full w-full max-w-[463px] flex-col items-center justify-center">
      <Formik
        initialValues={swapSettings}
        validationSchema={validationSchema}
        onSubmit={onSubmitSwap}>
        <TokenSwap />
      </Formik>
    </div>
  );
};

export default Swap;
