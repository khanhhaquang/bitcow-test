/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Formik, FormikHelpers, useFormikContext } from 'formik';
import { useCallback, useEffect } from 'react';
import * as yup from 'yup';

import PixelButton from 'components/PixelButton';

import CreatePoolToken from './CreatePoolToken';

// import { ABI_ERC20 } from '../../../sdk/abi/ERC20';
import { ICreatePool } from './types';

import useMerlinWallet from '../../../../hooks/useMerlinWallet';
import usePools from '../../../../hooks/usePools';

interface TProps {}

const CreatePoolUi: React.FC<TProps> = () => {
  const { setFieldValue, values, isValidating, isSubmitting, isValid, dirty, submitForm, errors } =
    useFormikContext<ICreatePool>();
  const { bitcowSDK, requestCreatePairWithManager, wallet } = useMerlinWallet();
  const { coinPrices } = usePools();

  const getError = useCallback(() => {
    console.log(' values.error', values.error);
    return (
      errors.xTokenAddress ||
      errors.xTokenSymbol ||
      errors.xTokenLogoUrl ||
      errors.xTokenBalance ||
      errors.xTokenAmount ||
      errors.yTokenAddress ||
      errors.yTokenSymbol ||
      errors.yTokenLogoUrl ||
      errors.yTokenBalance ||
      errors.yTokenAmount ||
      values.error
    );
  }, [errors, values]);
  console.log('getError', getError());
  useEffect(() => {
    console.log('values', values);
  }, [values]);
  useEffect(() => {
    console.log('errors', errors);
  }, [errors]);

  const validate = useCallback(async () => {
    if (
      bitcowSDK &&
      bitcowSDK.pairV1Manager &&
      values.xTokenAddress &&
      values.yTokenAddress &&
      errors.xTokenAddress === undefined &&
      errors.yTokenAddress === undefined &&
      errors.xTokenSymbol === undefined &&
      errors.yTokenSymbol === undefined &&
      errors.xTokenBalance === undefined &&
      errors.yTokenBalance === undefined
    ) {
      values.isValidating = true;
      values.error = undefined;
      const necessaryTokens: string[] = ['bitusd', 'USDT', 'WBTC', 'wBTC'];
      const xInNecessary = necessaryTokens.includes(values.xTokenSymbol);
      const yInNecessary = necessaryTokens.includes(values.yTokenSymbol);
      values.xTokenPrice = 0;
      values.yTokenPrice = 0;
      if (!xInNecessary && !yInNecessary) {
        values.error = "One of two token should be in ['bitUSD', 'USDT', 'WBTC']";
      }
      if (xInNecessary) {
        values.xTokenPrice = coinPrices[values.xTokenSymbol];
      }
      if (yInNecessary) {
        values.yTokenPrice = coinPrices[values.yTokenSymbol];
      }
      if (values.error === undefined) {
        const exist = await bitcowSDK.pairV1Manager.isPoolExist(
          values.xTokenAddress,
          values.yTokenAddress
        );
        if (exist) {
          values.error = 'This pair already existed in the pools.';
        }
      }
      values.isValidating = false;
    }
  }, [bitcowSDK, values, errors]);

  useEffect(() => {
    validate();
  }, [validate]);

  return (
    <div className="flex w-full flex-col space-y-6 bg-bc-swap px-6 pt-6 pb-9 text-white">
      <div className="border-b border-white/20 pb-3 font-micro text-2xl">Create new pool</div>
      <div className="flex flex-col space-y-6">
        <div className="flex space-x-3">
          <CreatePoolToken tokenType="xToken"></CreatePoolToken>
          <CreatePoolToken tokenType="yToken"></CreatePoolToken>
        </div>
        <div className="flex flex-col items-center justify-center">
          {getError() && (
            <div className="mb-3 font-pg text-sm leading-none text-orange-400">{getError()}</div>
          )}
          <PixelButton
            className="mt-3 text-2xl"
            isLoading={isSubmitting}
            width={206}
            height={44}
            disabled={
              !wallet ||
              !isValid ||
              !dirty ||
              values.error !== undefined ||
              isValidating ||
              values.isValidating
            }
            onClick={submitForm}>
            CREATE
          </PixelButton>
        </div>
      </div>
    </div>
  );
};

export default CreatePoolUi;
