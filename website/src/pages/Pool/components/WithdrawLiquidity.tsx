import { BN, IPool } from 'bitcow';
import cx from 'classnames';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import poolAction from 'modules/pool/actions';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

import Button from 'components/Button';
import CoinIcon from 'components/CoinIcon';
import PixelButton from 'components/PixelButton';
import PositiveFloatNumInput from 'components/PositiveFloatNumInput';
import SliderInput from 'components/SliderInput';
import { useBreakpoint } from 'hooks/useBreakpoint';
import useDebouncedCallback from 'hooks/useDebouncedCallback';
import useMerlinWallet from 'hooks/useMerlinWallet';
import usePools from 'hooks/usePools';
import useTokenAmountFormatter from 'hooks/useTokenAmountFormatter';
import { WithdrawLiquidity as WithdrawLiquidityProps } from 'pages/Pool/types';
import { ReactComponent as RmLiqIcon } from 'resources/icons/rmLiq.svg';
import { openErrorNotification } from 'utils/notifications';

const percentageOptions = [25, 50, 75, 100];

const WithdrawLiquidity = ({ liquidityPool }: { liquidityPool: IPool }) => {
  const dispatch = useDispatch();
  const { requestWithdrawLiquidity, tokenBalances } = useMerlinWallet();
  const { isTablet } = useBreakpoint('tablet');
  const { getOwnedLiquidity } = usePools();
  const [pool, setPool] = useState<{ lp: BN; coins: {} }>();
  const [tokenAmountFormatter] = useTokenAmountFormatter();

  const fetchRecord = useCallback(() => {
    const userLp = tokenBalances[liquidityPool.lpAddress];
    const userLiq = getOwnedLiquidity(liquidityPool);
    setPool({
      lp: new BN(userLp.toString()),
      coins: userLiq.assetsPooled
    });
  }, [getOwnedLiquidity, liquidityPool, tokenBalances]);

  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);

  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = useCallback(
    async (values: WithdrawLiquidityProps, formikHelper: FormikHelpers<WithdrawLiquidityProps>) => {
      const { xToken, yToken, percent } = values;
      if (xToken && yToken && percent && pool) {
        const result = await requestWithdrawLiquidity(
          liquidityPool,
          pool.lp.muln(percent).divn(100).toString()
        );
        if (result) {
          formikHelper.resetForm();
          dispatch(poolAction.TOGGLE_LIQUIDITY_MODAL(null));
        }
        formikHelper.setSubmitting(false);
      } else {
        openErrorNotification({ detail: 'Invalid input for withdrawing Liquidity' });
      }
    },
    [dispatch, pool, requestWithdrawLiquidity, liquidityPool]
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
          const token =
            liquidityPool.token0.symbol === key ? liquidityPool.token0 : liquidityPool.token1;
          return (
            <div className="flex w-full items-center justify-between" key={key}>
              <div className="flex items-center gap-2">
                <CoinIcon token={token} size={26} />
                <div className="text-lg uppercase">{key}</div>
              </div>
              <div className="text-4xl text-white/60">
                {tokenAmountFormatter(
                  percent ? (pool.coins[key] * percent) / 100 : pool.coins[key],
                  token
                )}
              </div>
            </div>
          );
        });
      }
    },
    [liquidityPool.token0, liquidityPool.token1, pool, tokenAmountFormatter]
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
        <div className="w-full bg-bc-pool px-4 pt-4 pb-6 text-white">
          <h2 className="pb-3 font-micro text-2xl uppercase text-white">Remove liquidity</h2>
          <hr className="h-[1.5px] border-0 bg-white/20" />
          <div className="mt-9 flex w-full flex-col items-center justify-center px-5 tablet:pb-[88px]">
            <div className="relative w-full overflow-hidden bg-white/5 px-6 py-4 font-pg">
              <span className="absolute top-0 left-0 h-2 w-2 bg-blue2" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-blue2" />
              <span className="absolute bottom-0 left-0 h-2 w-2 bg-blue2" />
              <span className="absolute bottom-0 right-0 h-2 w-2 bg-blue2" />
              <div className="flex flex-col gap-y-2">{renderCoinRow()}</div>
            </div>
            <div>
              <SliderInput
                className="mx-0 mt-6 mb-0 tablet:hidden"
                min={0}
                max={100}
                tooltip={null}
                onChange={(val: number) => props.setFieldValue('percent', val)}
                value={props.values.percent}
              />
              <div className="flex items-center tablet:flex-col-reverse tablet:items-start">
                <div className="mt-4 flex w-full items-center justify-between gap-2">
                  {percentageOptions.map((option) => (
                    <Button
                      key={option}
                      onClick={() => onAmountChange(option, props)}
                      className="h-6 grow rounded-none bg-white/20 text-sm text-white/60 hover:text-bc-white">
                      {option}%
                    </Button>
                  ))}
                </div>
                <div className={'relative flex grow  tablet:w-full tablet:items-end'}>
                  <PositiveFloatNumInput
                    ref={inputRef}
                    min={0.01}
                    max={100}
                    maxDecimals={2}
                    placeholder="0.00"
                    className="relative z-[2] mt-6 w-full bg-transparent pr-2 pl-1 text-right font-micro text-3xl tablet:text-left"
                    inputAmount={props.values.percent || 0}
                    onAmountChange={(a) => onAmountChange(a, props)}
                    suffix={isTablet ? '%' : null}
                    suffixClassname="text-3xl text-bc-white absolute left-[54px] pl-3 z-[1] top-6"
                  />
                  <div
                    className={cx('mt-6 grow text-3xl tablet:hidden', {
                      'text-bc-white-60': props.values.percent <= 0,
                      'text-bc-white': props.values.percent > 0
                    })}>
                    %
                  </div>
                  <SliderInput
                    className="m-0 mb-2 hidden w-full grow tablet:block"
                    min={0}
                    max={100}
                    tooltip={null}
                    onChange={(val: number) => props.setFieldValue('percent', val)}
                    value={props.values.percent}
                  />
                </div>
              </div>
            </div>
            {props.values.percent > 0 && (
              <>
                <RmLiqIcon className="mb-2" />
                <div className="relative w-full bg-white/5 px-6 py-4 font-pg">
                  <span className="absolute top-0 left-0 h-2 w-2 bg-blue2" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-blue2" />
                  <span className="absolute bottom-0 left-0 h-2 w-2 bg-blue2" />
                  <span className="absolute bottom-0 right-0 h-2 w-2 bg-blue2" />
                  <div className="mb-2 text-xs text-bc-white-60">Amount to receive</div>
                  <div className="mt-4 flex flex-col gap-4">
                    {renderCoinRow(props.values.percent)}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex w-full justify-center pt-6">
            <PixelButton
              width={319}
              height={48}
              borderWidth={4}
              className="text-2xl uppercase"
              onClick={props.submitForm}
              isLoading={props.isSubmitting}
              disabled={!props.isValid || !props.dirty}>
              Remove Liquidity
            </PixelButton>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default WithdrawLiquidity;
