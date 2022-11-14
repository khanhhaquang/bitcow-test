import { Formik, FormikHelpers } from 'formik';
import poolAction from 'modules/pool/actions';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

import Button from 'components/Button';
import useAptosWallet from 'hooks/useAptosWallet';
import { AddLiquidity as AddLiquidityProps } from 'pages/Pool/types';
import { AddIcon } from 'resources/icons';
import { IPool } from 'types/pool';
import { openErrorNotification } from 'utils/notifications';

import TokenLiquidity from './TokenLiquidity';

const AddLiquidity = ({ liquidityPool }: { liquidityPool: IPool }) => {
  const { requestAddLiquidity } = useAptosWallet();
  const dispatch = useDispatch();
  const onSubmit = useCallback(
    async (values: AddLiquidityProps, formikHelper: FormikHelpers<AddLiquidityProps>) => {
      const { xToken, yToken, xAmt, yAmt } = values;
      if (xToken && yToken && xAmt && yAmt) {
        const result = await requestAddLiquidity({
          xToken,
          yToken,
          xAmt,
          yAmt
        });
        if (result) {
          formikHelper.resetForm();
          dispatch(poolAction.TOGGLE_LIQUIDITY_MODAL(null));
        }
        formikHelper.setSubmitting(false);
      } else {
        openErrorNotification({ detail: 'Invalid input for Adding Liquidity' });
      }
    },
    [dispatch, requestAddLiquidity]
  );

  const validationSchema = yup.object({
    xToken: yup.object().required(),
    yToken: yup.object().required(),
    xAmt: yup.number().positive(),
    yAmt: yup.number().positive()
  });

  return (
    <Formik
      initialValues={{
        xToken: liquidityPool.token0,
        yToken: liquidityPool.token1,
        xAmt: 0,
        yAmt: 0
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}>
      {(props) => (
        <div className="w-full font-Rany text-white">
          <div className="text-lg">Add liquidity</div>
          <div className="mt-5 flex w-full flex-col">
            <div className="relative flex flex-col items-center gap-2">
              <div className="bg-color_bg_2 p-4">
                <div className="mb-2 text-xs uppercase text-gray_05">Pay</div>
                <TokenLiquidity token={liquidityPool.token0} type="xAmt" />
              </div>
              <AddIcon className="h-[18px] w-[18px]" />
              <div className="bg-color_bg_2 p-4">
                <div className="mb-2 text-xs uppercase text-gray_05">Pay</div>
                <TokenLiquidity token={liquidityPool.token1} type="yAmt" />
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
                ADD
              </Button>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default AddLiquidity;
