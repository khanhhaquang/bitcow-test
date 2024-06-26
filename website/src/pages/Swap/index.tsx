/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Formik, FormikHelpers } from 'formik';
import { getSwapSettings } from 'modules/swap/reducer';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

import useMerlinWallet from 'hooks/useMerlinWallet';
import { openErrorNotification } from 'utils/notifications';

import LuckyRewardModal from './components/LuckyRewardModal';
import TokenSwap from './components/TokenSwap';
import { ISwapSettings } from './types';
import { ITxnLucky } from 'services/luckyDraw';

const validationSchema = yup.object({
  currencyFrom: yup.object({
    amount: yup.number().positive().required(),
    balance: yup.number().positive().required()
  }),
  expertMode: yup.boolean(),
  disableIndirect: yup.boolean(),
  privacySwap: yup.boolean()
});

const Swap: React.FC = () => {
  const swapSettings = useSelector(getSwapSettings);
  const { requestSwap, initProvider } = useMerlinWallet();
  const [luckyTxn, setLuckyTxn] = useState<ITxnLucky | undefined>();

  useEffect(() => {
    initProvider('swap');
  }, [initProvider]);

  const onSubmitSwap = useCallback(
    async (values: ISwapSettings, formikHelper: FormikHelpers<ISwapSettings>) => {
      const fromToken = values.currencyFrom?.token;
      const toToken = values.currencyTo?.token;
      const quote = values.quote;
      const inputAmt = values.currencyFrom?.amount;
      const minOutputAmt = values.currencyTo?.amount * (1 - values.slipTolerance / 100);
      if (fromToken && toToken && inputAmt && minOutputAmt && quote) {
        const result = await requestSwap(quote, quote.outAmt * 0.9, (newLuckyTxn) => {
          setLuckyTxn(newLuckyTxn);
        });

        if (result) {
          formikHelper.setFieldValue('currencyFrom', {
            ...values.currencyFrom,
            amount: 0
          });
          formikHelper.setFieldValue('currencyTo', {
            ...values.currencyTo,
            amount: 0
          });
        }
        formikHelper.setSubmitting(false);
      } else {
        openErrorNotification({ detail: 'Invalid input for swapping' });
      }
    },
    [requestSwap]
  );

  return (
    <div className="relative mx-auto flex h-full w-full flex-col items-center pt-[140px] laptop:pt-10 tablet:px-8">
      <Formik
        initialValues={swapSettings}
        validationSchema={validationSchema}
        onSubmit={onSubmitSwap}>
        <TokenSwap />
      </Formik>
      <LuckyRewardModal onClose={() => setLuckyTxn(undefined)} luckyTxn={luckyTxn} />
    </div>
  );
};

export default Swap;
