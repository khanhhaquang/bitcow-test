import { Formik, FormikHelpers, FormikProps } from 'formik';
import poolAction from 'modules/pool/actions';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

import Button from 'components/Button';
import CoinIcon from 'components/CoinIcon';
import PositiveFloatNumInput from 'components/PositiveFloatNumInput';
import useAptosWallet from 'hooks/useAptosWallet';
import useDebouncedCallback from 'hooks/useDebouncedCallback';
import usePools from 'hooks/usePools';
import { WithdrawLiquidity as WithdrawLiquidityProps } from 'pages/Pool/types';
import { LeftArrowIcon } from 'resources/icons';
import { IPool } from 'types/pool';
import { openErrorNotification } from 'utils/notifications';

const percentageOptions = [25, 50, 75, 100];

const WithdrawLiquidity = ({ liquidityPool }: { liquidityPool: IPool }) => {
  const dispatch = useDispatch();
  const { requestWithdrawLiquidity } = useAptosWallet();
  const { getOwnedLiquidity } = usePools();
  const [pool, setPool] = useState<{ lp: number; coins: {} }>();

  const fetchRecord = useCallback(async () => {
    const { lp, coins } = await getOwnedLiquidity(liquidityPool.id);
    setPool({ lp, coins });
  }, [getOwnedLiquidity, liquidityPool.id]);

  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);

  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = useCallback(
    async (values: WithdrawLiquidityProps, formikHelper: FormikHelpers<WithdrawLiquidityProps>) => {
      const { xToken, yToken, percent } = values;
      if (xToken && yToken && percent && pool) {
        const result = await requestWithdrawLiquidity({
          xToken,
          yToken,
          amt: pool.lp * (percent / 100)
        });
        if (result) {
          formikHelper.resetForm();
          dispatch(poolAction.TOGGLE_LIQUIDITY_MODAL(null));
        }
        formikHelper.setSubmitting(false);
      } else {
        openErrorNotification({ detail: 'Invalid input for withdrawing Liquidity' });
      }
    },
    [dispatch, pool, requestWithdrawLiquidity]
  );

  const validationSchema = yup.object({
    xToken: yup.object().required(),
    yToken: yup.object().required(),
    percent: yup.number().positive()
  });

  const onAmountChange = useDebouncedCallback(
    useCallback((a: number, props: FormikProps<WithdrawLiquidityProps>) => {
      props.setFieldValue('percent', a);
    }, []),
    200
  );

  const renderCoinRow = useCallback(
    (percent?: number) => {
      if (pool) {
        return Object.keys(pool?.coins).map((key) => {
          return (
            <div className="flex w-full items-center justify-between" key={key}>
              <div className="flex items-center gap-2">
                <CoinIcon symbol={key} size={20} />
                <div className="text-[18px]">{key}</div>
              </div>
              <div className="text-sm text-gray_05">
                {percent ? (pool.coins[key] * percent) / 100 : pool.coins[key]}
              </div>
            </div>
          );
        });
      }
    },
    [pool]
  );

  return (
    <Formik
      initialValues={{
        xToken: liquidityPool.token0,
        yToken: liquidityPool.token1,
        percent: 0,
        amt: 0
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}>
      {(props) => (
        <div className="w-full font-Rany text-white">
          <div className="text-lg">Withdraw liquidity</div>
          <div className="mt-5 flex w-full flex-col items-center justify-center gap-2">
            <div className="w-full bg-color_bg_2 p-4">
              <div className="mb-2 text-xs uppercase text-gray_05">AVAILABLE FOR WITHDRAWAL</div>
              <div className="mt-4 flex flex-col gap-4">{renderCoinRow()}</div>
              <div className="flex">
                <div className="mt-5 flex w-full items-center justify-between gap-2">
                  {percentageOptions.map((option) => (
                    <Button
                      key={option}
                      onClick={() => onAmountChange(option, props)}
                      className="h-6 grow rounded-none bg-gray_01 text-sm text-gray_05 hover:bg-gray_03 hover:text-white">
                      {option}%
                    </Button>
                  ))}
                </div>
                <div className={'flex grow font-Rany text-gray_03'}>
                  <PositiveFloatNumInput
                    ref={inputRef}
                    min={0.01}
                    max={100}
                    maxDecimals={2}
                    placeholder="0.00"
                    className="relative mt-6 w-full bg-transparent pr-2 pl-1 text-right text-3xl text-white"
                    inputAmount={props.values.percent || 0}
                    onAmountChange={(a) => onAmountChange(a, props)}
                  />
                  <div className="mt-6 grow text-3xl text-gray_05">%</div>
                </div>
              </div>
            </div>
            {props.values.percent > 0 && (
              <Fragment>
                <LeftArrowIcon className="rotate-90 fill-white" />
                <div className="w-full bg-color_bg_2 p-4">
                  <div className="mb-2 text-xs uppercase text-gray_05">AMOUNT TO RECEIVE</div>
                  <div className="mt-4 flex flex-col gap-4">
                    {renderCoinRow(props.values.percent)}
                  </div>
                </div>
              </Fragment>
            )}
          </div>
          <div className="absolute left-0 -bottom-[92.5px] w-full bg-color_bg_3">
            <div className="bg-gray_008 p-5">
              <Button
                isLoading={props.isSubmitting}
                className="w-full rounded-none bg-color_main font-Furore text-[18px] text-white hover:bg-opacity-90 disabled:bg-[#272B30] disabled:bg-none disabled:text-gray_03"
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
