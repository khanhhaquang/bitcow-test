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

  const renderDetails = useCallback(() => {
    const details = [
      {
        label: 'Trade Fee',
        value: liquidityPool.swapFee
      },
      {
        label: 'Withdraw Fee',
        value: '0.2%'
      }
    ];

    return (
      <div className={'flex flex-col gap-1'}>
        {details.map((detail) => (
          <div className="flex justify-between text-xs text-color_text_1" key={detail.label}>
            <div className="">{detail.label}</div>
            <div className="">{detail.value}</div>
          </div>
        ))}
      </div>
    );
  }, [liquidityPool.swapFee]);

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
      {(props) => {
        return (
          <div className="w-full font-Rany text-color_text_1">
            <div className="text-lg tablet:px-5 tablet:py-[22px] tablet:leading-5">
              Add liquidity
            </div>
            <hr className="hidden h-[1px] border-0 bg-white_color_list_hover dark:bg-color_list_hover tablet:my-0 tablet:block" />
            <div className="mt-5 flex w-full flex-col tablet:mt-6 tablet:px-5 tablet:pb-[88px]">
              <div className="relative flex flex-col items-center gap-2">
                <div className="w-full bg-white_gray_bg p-4 dark:bg-color_bg_2">
                  <div className="mb-2 text-xs uppercase text-color_text_2">Pay</div>
                  <TokenLiquidity
                    token={liquidityPool.token0}
                    type="xAmt"
                    liquidityPool={liquidityPool}
                  />
                </div>
                <AddIcon className="h-[18px] w-[18px]" />
                <div className="w-full bg-white_gray_bg p-4 dark:bg-color_bg_2">
                  <div className="mb-2 text-xs uppercase text-color_text_2">Pay</div>
                  <TokenLiquidity
                    token={liquidityPool.token1}
                    type="yAmt"
                    liquidityPool={liquidityPool}
                  />
                </div>
              </div>
              <div className={'mt-2 bg-white_table p-5 dark:bg-color_bg_2 tablet:px-4'}>
                {renderDetails()}
              </div>
            </div>
            <div className="absolute left-0 -bottom-[76px] w-full bg-color_bg_panel tablet:bottom-0">
              <div className="p-5 pt-1">
                <Button
                  isLoading={props.isSubmitting}
                  variant="primary"
                  disabled={!props.isValid || !props.dirty}
                  onClick={props.submitForm}>
                  ADD
                </Button>
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};

export default AddLiquidity;
