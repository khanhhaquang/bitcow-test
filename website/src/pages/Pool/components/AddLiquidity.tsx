import { Formik, FormikHelpers } from 'formik';
import poolAction from 'modules/pool/actions';
import { IPool } from 'obric-merlin';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

import PixelButton from 'components/PixelButton';
import PixelDivider from 'components/PixelDivider';
import useMerlinWallet from 'hooks/useMerlinWallet';
import { AddLiquidity as AddLiquidityProps } from 'pages/Pool/types';
import { ReactComponent as AddLiq } from 'resources/icons/addLiq.svg';
import { openErrorNotification } from 'utils/notifications';

import TokenLiquidity from './TokenLiquidity';

import useTokenBalance from '../../../hooks/useTokenBalance';

const AddLiquidity = ({ liquidityPool }: { liquidityPool: IPool }) => {
  const { requestAddLiquidity } = useMerlinWallet();
  const dispatch = useDispatch();
  const [token0Balance] = useTokenBalance(liquidityPool.token0);
  const [token1Balance] = useTokenBalance(liquidityPool.token1);
  const onSubmit = useCallback(
    async (values: AddLiquidityProps, formikHelper: FormikHelpers<AddLiquidityProps>) => {
      const { xToken, yToken, xAmt, yAmt } = values;
      if (xToken && yToken && xAmt && yAmt) {
        console.log('xAmt', xAmt);
        console.log('yAmt', yAmt);
        const result = await requestAddLiquidity(liquidityPool, xAmt, yAmt);
        if (result) {
          formikHelper.resetForm();
          dispatch(poolAction.TOGGLE_LIQUIDITY_MODAL(null));
        }
        formikHelper.setSubmitting(false);
      } else {
        openErrorNotification({ detail: 'Invalid input for Adding Liquidity' });
      }
    },
    [dispatch, requestAddLiquidity, liquidityPool]
  );

  const validationSchema = yup.object({
    xToken: yup.object().required(),
    yToken: yup.object().required(),
    xAmt: yup.number().positive().lessThan(token0Balance),
    yAmt: yup.number().positive().lessThan(token1Balance)
  });

  const renderDetails = useCallback(() => {
    const details = [
      {
        label: 'Trade Fee',
        value: (liquidityPool.swapFeeMillionth * 100).toFixed(2) + '%'
      },
      {
        label: 'Withdraw Fee',
        value: '0.2%'
      }
    ];

    return (
      <div className={'flex flex-col gap-2 bg-bc-grey-transparent2 p-3'}>
        {details.map((detail) => (
          <div className="flex justify-between text-xs" key={detail.label}>
            <div className="">{detail.label}</div>
            <div className="">{detail.value}</div>
          </div>
        ))}
      </div>
    );
  }, [liquidityPool]);

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
          <div className="w-full bg-bc-pool p-6  text-bc-white">
            <div className="text-lg tablet:px-5 tablet:py-[22px] tablet:leading-5">
              Add liquidity
            </div>
            <hr className="hidden h-[1px] border-0  tablet:my-0 tablet:block" />
            <div className="mt-5 flex w-full flex-col tablet:mt-6 tablet:px-5 tablet:pb-[88px]">
              <div className="relative flex flex-col items-center">
                <div className="relative w-full border-t-2 border-l-2 border-r-2 border-bc-blue bg-bc-grey-transparent p-4">
                  <div className="mb-2 text-xs uppercase text-bc-white-60">Pay</div>
                  <TokenLiquidity
                    token={liquidityPool.token0}
                    type="xAmt"
                    liquidityPool={liquidityPool}
                  />
                  <PixelDivider
                    className="absolute left-[-1px] bottom-0 right-[-1px] translate-y-1/2"
                    color="var(--bitcow-color-text-blue)"
                  />
                  <AddLiq className="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2" />
                </div>
                <div className="w-full border-b-2 border-l-2 border-r-2 border-bc-blue bg-bc-grey-transparent p-4">
                  <div className="mb-2 text-xs uppercase text-bc-white-60">Pay</div>
                  <TokenLiquidity
                    token={liquidityPool.token1}
                    type="yAmt"
                    liquidityPool={liquidityPool}
                  />
                </div>
              </div>
              <div className={'mt-3'}>{renderDetails()}</div>
            </div>
            <div className="pt-9">
              <PixelButton
                isLoading={props.isSubmitting}
                width={206}
                height={48}
                borderWidth={4}
                className="mx-auto"
                disabled={!props.isValid || !props.dirty}
                onClick={props.submitForm}>
                ADD
              </PixelButton>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};

export default AddLiquidity;
