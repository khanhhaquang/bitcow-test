import { Formik, FormikHelpers } from 'formik';
import poolAction from 'modules/pool/actions';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

import Button from 'components/Button';
import useAptosWallet from 'hooks/useAptosWallet';
import { WithdrawLiquidity as WithdrawLiquidityProps } from 'pages/Pool/types';
import { IPool } from 'types/pool';
import { openErrorNotification } from 'utils/notifications';

import TokenLiquidity from './TokenLiquidity';

const WithdrawLiquidity = ({ liquidityPool }: { liquidityPool: IPool }) => {
  const dispatch = useDispatch();
  const { requestWithdrawLiquidity } = useAptosWallet();

  const onSubmit = useCallback(
    async (values: WithdrawLiquidityProps, formikHelper: FormikHelpers<WithdrawLiquidityProps>) => {
      console.log('on submit withdraw liquidity');
      const { xToken, yToken, amt } = values;
      if (xToken && yToken && amt) {
        const result = await requestWithdrawLiquidity({
          xToken,
          yToken,
          amt
        });
        console.log('withdraw result>>>', result);
        if (result) {
          formikHelper.resetForm();
          dispatch(poolAction.TOGGLE_LIQUIDITY_MODAL(null));
        }
        formikHelper.setSubmitting(false);
      } else {
        openErrorNotification({ detail: 'Invalid input for withdrawing Liquidity' });
      }
    },
    [dispatch, requestWithdrawLiquidity]
  );

  const validationSchema = yup.object({
    xToken: yup.object().required(),
    yToken: yup.object().required(),
    amt: yup.number().positive()
  });

  return (
    <Formik
      initialValues={{
        xToken: liquidityPool.token0,
        yToken: liquidityPool.token1,
        amt: 0
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}>
      {(props) => (
        <div className="w-full font-Rany text-white">
          <div className="text-lg">Withdraw liquidity</div>
          <div className="mt-5 flex w-full flex-col">
            <div className="relative flex flex-col items-center gap-2">
              <div className="bg-color_bg_2 p-4">
                <div className="mb-2 text-xs uppercase text-gray_05">Get</div>
                <TokenLiquidity token={liquidityPool.token0} type="xAmt" />
              </div>
            </div>
          </div>
          <div className="absolute left-0 -bottom-[92.5px] w-full bg-color_bg_3">
            <div className="bg-gray_008 p-5">
              <Button
                isLoading={props.isSubmitting}
                className="w-full rounded-none bg-button_gradient font-Furore text-[18px] text-black disabled:bg-[#272B30] disabled:bg-none disabled:text-gray_03"
                disabled={!props.isValid || !props.dirty}
                onClick={props.submitForm}>
                Withdraw
              </Button>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default WithdrawLiquidity;
