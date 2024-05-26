import { isAddress } from 'ethers';
import { useFormikContext } from 'formik';
import { useCallback, useEffect, useState } from 'react';

import PixelButton from 'components/PixelButton';

import CreatePoolToken from './CreatePoolToken';
import { ICreatePool } from './types';

import useMerlinWallet from '../../../../hooks/useMerlinWallet';
import usePools from '../../../../hooks/usePools';

interface TProps {}

const CreatePoolUi: React.FC<TProps> = () => {
  const { values, isSubmitting, submitForm } = useFormikContext<ICreatePool>();
  const { bitcowSDK, wallet } = useMerlinWallet();
  const { coinPrices } = usePools();

  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isXValidating, setXIsValidating] = useState<boolean>(false);
  const [isYValidating, setYIsValidating] = useState<boolean>(false);

  const [error, setError] = useState<string>(undefined);
  const [errorX, setErrorX] = useState<string>(undefined);
  const [errorY, setErrorY] = useState<string>(undefined);

  const getError = useCallback(() => {
    return errorX || errorY || error;
  }, [errorX, errorY, error]);

  const validate = useCallback(async () => {
    if (
      bitcowSDK &&
      bitcowSDK.pairV1Manager &&
      !isXValidating &&
      errorX === undefined &&
      !isYValidating &&
      errorY === undefined
    ) {
      setIsValidating(true);
      setError(undefined);
      if (!wallet) {
        setError('Please connect wallet');
        setIsValidating(false);
        return;
      }
      if (values.xTokenAddress.trim().length === 0) {
        setError("Token A can't be empty");
        setIsValidating(false);
        return;
      }
      if (!isAddress(values.xTokenAddress)) {
        setError('Token A may not an address');
        setIsValidating(false);
        return;
      }
      if (values.yTokenAddress.trim().length === 0) {
        setError("Token B can't be empty");
        setIsValidating(false);
        return;
      }
      if (!isAddress(values.yTokenAddress)) {
        setError('Token B may not an address');
        setIsValidating(false);
        return;
      }

      if (values.xTokenAddress === values.yTokenAddress) {
        setError('Token A and Token B must different');
        setIsValidating(false);
        return;
      }

      if (values.xTokenSymbol.length === 0) {
        setError('Token A symbol not found, may not an token address');
        setIsValidating(false);
        return;
      }

      if (values.yTokenSymbol.length === 0) {
        setError('Token B symbol not found, may not an token address');
        setIsValidating(false);
        return;
      }

      const necessaryTokens: string[] = ['bitusd', 'USDT', 'WBTC', 'wBTC'];
      const xInNecessary = necessaryTokens.includes(values.xTokenSymbol);
      const yInNecessary = necessaryTokens.includes(values.yTokenSymbol);
      values.xTokenPrice = 0;
      values.yTokenPrice = 0;
      if (!xInNecessary && !yInNecessary) {
        setError("One of two token should be in ['bitUSD', 'USDT', 'WBTC']");
        setIsValidating(false);
        return;
      }
      if (xInNecessary) {
        values.xTokenPrice = coinPrices[values.xTokenSymbol];
      }
      if (yInNecessary) {
        values.yTokenPrice = coinPrices[values.yTokenSymbol];
      }

      if (await bitcowSDK.pairV1Manager.isPoolExist(values.xTokenAddress, values.yTokenAddress)) {
        setError('This pair already existed in the pools.');
        setIsValidating(false);
        return;
      }

      if (values.xTokenLogoUrl.length === 0) {
        setError('Token A logoUrl not found, please upload');
        setIsValidating(false);
        return;
      }
      if (values.xTokenBalance === 0) {
        setError('Token A no available balance');
        setIsValidating(false);
        return;
      }
      if (values.xTokenAmount === 0) {
        setError('Token A amount must more than zero');
        setIsValidating(false);
        return;
      }
      if (values.xTokenAmount > values.xTokenBalance) {
        setError("Token A amount can't more than balance");
        setIsValidating(false);
        return;
      }

      if (values.yTokenLogoUrl.length === 0) {
        setError('Token B logoUrl not found, please upload');
        setIsValidating(false);
        return;
      }
      if (values.yTokenBalance === 0) {
        setError('Token B no available balance');
        setIsValidating(false);
        return;
      }
      if (values.yTokenAmount === 0) {
        setError('Token B amount must more than zero');
        setIsValidating(false);
        return;
      }
      if (values.yTokenAmount > values.yTokenBalance) {
        setError("Token B amount can't more than balance");
        setIsValidating(false);
        return;
      }

      setIsValidating(false);
    }
  }, [bitcowSDK, values, coinPrices, errorY, errorX, isXValidating, isYValidating]);

  useEffect(() => {
    validate();
  }, [validate]);

  return (
    <div className="flex w-full flex-col space-y-6 bg-bc-swap px-6 pt-6 pb-9 text-white">
      <div className="border-b border-white/20 pb-3 font-micro text-2xl">Create new pool</div>
      <div className="flex flex-col space-y-6">
        <div className="flex space-x-3">
          <CreatePoolToken
            tokenType="xToken"
            setError={setErrorX}
            setIsValidating={setXIsValidating}></CreatePoolToken>
          <CreatePoolToken
            tokenType="yToken"
            setError={setErrorY}
            setIsValidating={setYIsValidating}></CreatePoolToken>
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
              !wallet || isXValidating || isYValidating || isValidating || getError() !== undefined
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
