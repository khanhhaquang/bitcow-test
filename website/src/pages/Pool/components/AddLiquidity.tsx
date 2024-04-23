import { IPool } from 'bitcow';
import { Formik, FormikHelpers } from 'formik';
import poolAction from 'modules/pool/actions';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

import PixelButton from 'components/PixelButton';
import useMerlinWallet from 'hooks/useMerlinWallet';
import { AddLiquidity as AddLiquidityProps } from 'pages/Pool/types';
import { openErrorNotification } from 'utils/notifications';

import TokenLiquidity from './TokenLiquidity';

import useTokenBalance from '../../../hooks/useTokenBalance';
import { PlusIcon } from 'resources/icons';

const AddLiquidity = ({ liquidityPool }: { liquidityPool: IPool }) => {
  const { requestAddLiquidity, tokenBalances, setNeedBalanceTokens } = useMerlinWallet();
  const dispatch = useDispatch();
  const [token0Balance] = useTokenBalance(liquidityPool.token0);
  const [token1Balance] = useTokenBalance(liquidityPool.token1);
  const onSubmit = useCallback(
    async (values: AddLiquidityProps, formikHelper: FormikHelpers<AddLiquidityProps>) => {
      const { xToken, yToken, xAmt, yAmt } = values;
      if (xToken && yToken && xAmt && yAmt) {
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

  useEffect(() => {
    let needBalanceTokens: string[] = [];
    if (tokenBalances[liquidityPool.token0.address] === undefined) {
      needBalanceTokens.push(liquidityPool.token0.address);
    }
    if (tokenBalances[liquidityPool.token1.address] === undefined) {
      needBalanceTokens.push(liquidityPool.token1.address);
    }
    if (needBalanceTokens.length) {
      setNeedBalanceTokens(needBalanceTokens);
    }
  }, [tokenBalances, setNeedBalanceTokens, liquidityPool]);

  const validationSchema = yup.object({
    xToken: yup.object().required(),
    yToken: yup.object().required(),
    xAmt: yup.number().positive().max(token0Balance),
    yAmt: yup.number().positive().max(token1Balance)
  });

  const renderDetails = useCallback(() => {
    const details = [
      {
        label: 'Trade Fee',
        value: liquidityPool.swapFeeMillionth * 100 + '%'
      }
    ];

    return (
      <div className={'flex flex-col gap-2 border-y border-white/20 py-3'}>
        {details.map((detail) => (
          <div className="flex justify-between text-sm" key={detail.label}>
            <span>{detail.label}</span>
            <span>{detail.value}</span>
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
          <div className="w-full bg-bc-pool px-4 pt-4 pb-6 text-bc-white">
            <h2 className="pb-3 font-micro text-2xl uppercase text-white">Add liquidity</h2>
            <hr className="h-[1.5px] border-0 bg-white/20" />
            <div className="mt-9 flex w-full flex-col px-5 font-pg tablet:pb-[88px]">
              <div className="relative flex flex-col items-center">
                <div className="relative w-full pt-4 pb-0">
                  <TokenLiquidity
                    xToken={liquidityPool.token0}
                    yToken={liquidityPool.token1}
                    type="xAmt"
                    liquidityPool={liquidityPool}
                  />

                  <div className="my-4 flex items-center justify-between">
                    <span className="h-[1.5px] flex-1 bg-white/20" />
                    <PlusIcon className="mx-4" width={15} height={15} />
                    <span className="h-[1.5px] flex-1 bg-white/20" />
                  </div>
                </div>
                <div className="w-full pb-4 pt-0">
                  <TokenLiquidity
                    xToken={liquidityPool.token0}
                    yToken={liquidityPool.token1}
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
                width={264}
                height={42}
                borderWidth={4}
                className="mx-auto text-2xl"
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
