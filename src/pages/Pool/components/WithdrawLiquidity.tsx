import cx from 'classnames';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import poolAction from 'modules/pool/actions';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

import Button from 'components/Button';
import CoinIcon from 'components/CoinIcon';
import PositiveFloatNumInput from 'components/PositiveFloatNumInput';
import SliderInput from 'components/SliderInput';
import useAptosWallet from 'hooks/useAptosWallet';
import { useBreakpoint } from 'hooks/useBreakpoint';
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
  const { isTablet } = useBreakpoint('tablet');
  const { getOwnedLiquidity } = usePools();
  const [pool, setPool] = useState<{ lp: number; coins: {} }>();

  const fetchRecord = useCallback(async () => {
    const { lp, myCoins } = await getOwnedLiquidity(liquidityPool.id);
    setPool({ lp, coins: myCoins });
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
              <div className="text-sm text-white_gray_05 dark:text-gray_05">
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
        <div className="w-full font-Rany text-item_black dark:text-white">
          <div className="text-lg tablet:px-5 tablet:py-[22px] tablet:leading-5">
            Remove liquidity
          </div>
          <hr className="hidden h-[1px] border-0 bg-white_gray_bg dark:bg-color_list_hover tablet:my-0 tablet:block" />
          <div className="mt-5 flex w-full flex-col items-center justify-center gap-2 tablet:mt-6 tablet:px-5 tablet:pb-[88px]">
            <div className="w-full bg-white_gray_bg p-4 dark:bg-color_bg_2">
              <div className="mb-2 text-xs uppercase text-white_gray_05 dark:text-gray_05">
                AVAILABLE FOR WITHDRAWAL
              </div>
              <div className="mt-4 flex flex-col gap-4">{renderCoinRow()}</div>
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
                      className="hover-bg-item_black h-6 grow rounded-none bg-white_gray_01 text-sm text-white_gray_05 hover:text-white dark:bg-gray_01 dark:text-gray_05 dark:hover:bg-gray_03 dark:hover:text-gray_05">
                      {option}%
                    </Button>
                  ))}
                </div>
                <div
                  className={
                    'relative flex grow font-Rany text-gray_03 tablet:w-full tablet:items-end'
                  }>
                  <PositiveFloatNumInput
                    ref={inputRef}
                    min={0.01}
                    max={100}
                    maxDecimals={2}
                    placeholder="0.00"
                    className="relative z-[2] mt-6 w-full bg-transparent pr-2 pl-1 text-right text-3xl text-item_black dark:text-white tablet:text-left"
                    inputAmount={props.values.percent || 0}
                    onAmountChange={(a) => onAmountChange(a, props)}
                    suffix={isTablet ? '%' : null}
                    suffixClassname="text-3xl text-white_gray_03 dark:text-gray_05 absolute left-[54px] pl-3 z-[1] top-6"
                  />
                  <div
                    className={cx('mt-6 grow text-3xl tablet:hidden', {
                      'text-white_gray_03 dark:text-gray_05': props.values.percent <= 0,
                      'text-item_black dark:text-white': props.values.percent > 0
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
              <Fragment>
                <LeftArrowIcon className="rotate-90 fill-white" />
                <div className="w-full bg-white_gray_bg p-4 dark:bg-color_bg_2">
                  <div className="mb-2 text-xs uppercase text-white_gray_05 dark:text-gray_05">
                    AMOUNT TO RECEIVE
                  </div>
                  <div className="mt-4 flex flex-col gap-4">
                    {renderCoinRow(props.values.percent)}
                  </div>
                </div>
              </Fragment>
            )}
          </div>
          <div className="absolute left-0 -bottom-[76px] w-full bg-white dark:bg-gray_bg tablet:bottom-0">
            <div className="p-5 pt-1">
              <Button
                isLoading={props.isSubmitting}
                className="w-full rounded-none bg-color_main font-Furore text-[18px] text-white disabled:bg-white_gray_01 disabled:bg-none disabled:text-white_gray_03 dark:disabled:bg-[#272B30] dark:disabled:text-gray_03"
                disabled={!props.isValid || !props.dirty}
                onClick={props.submitForm}>
                Remove Liquidity
              </Button>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default WithdrawLiquidity;
