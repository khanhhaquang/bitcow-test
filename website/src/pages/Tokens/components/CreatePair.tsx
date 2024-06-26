import BigNumber from 'bignumber.js';
import { useFormikContext } from 'formik';
import { useEffect } from 'react';

import MessageShow from './MessageShow';
import NumberInput from './NumberInput';
import TextInput from './TextInput';
import UploadInput from './UploadInput';

import PixelButton from '../../../components/PixelButton';
import useMerlinWallet from '../../../hooks/useMerlinWallet';
import useNetwork from '../../../hooks/useNetwork';
import { ICreatePoolSetting } from '../types';

const CreatePair: React.FC<{ bitusdBalance: number | undefined; ready: boolean }> = ({
  bitusdBalance,
  ready
}) => {
  const { isSubmitting, dirty, submitForm, isValid, setFieldValue, values, errors } =
    useFormikContext<ICreatePoolSetting>();
  const { createFee, wallet, openWalletModal } = useMerlinWallet();
  useEffect(() => {
    if (createFee) {
      setFieldValue('addTokenListFee', createFee.toString());
    }
  }, [createFee, setFieldValue]);
  const { currentNetwork } = useNetwork();

  return (
    <div className="border-1 mx-32 mt-4 flex h-fit w-full flex-col items-center bg-bc-pool bg-cover bg-no-repeat p-9 text-bc-white text-bc-white shadow-bc-swap tablet:mt-4 ">
      <div className="mx-auto text-center text-3xl text-amber-600">Create Token and Pool</div>
      <div className="mx-auto mt-8 w-1/2">
        <TextInput title={'Name'} actionType={'name'}></TextInput>
        <TextInput title={'Ticker'} actionType={'symbol'}></TextInput>
        <TextInput title={'Description'} actionType={'description'}></TextInput>
        <TextInput title={'Project Url'} actionType={'projectUrl'}></TextInput>
        <UploadInput title={'Logo Url'} actionType={'logoUrl'} />
        <NumberInput
          title={'Token Supply'}
          actionType={'mintAmount'}
          placeholderVale={'0.00'}></NumberInput>
        <NumberInput
          title={`Add ${values.symbol || '...'} to pool`}
          actionType={'addLiquidityAmount'}
          placeholderVale={'0.00'}></NumberInput>
        <NumberInput
          title={'Add bitUSD to pool'}
          actionType={'bitusdAddLiquidityAmount'}
          placeholderVale={ready ? bitusdBalance.toString() : '0.00'}></NumberInput>
        <MessageShow
          title={'Create Fee:'}
          value={
            createFee && currentNetwork
              ? new BigNumber(createFee.toString()).div(10 ** 18).toString() +
                currentNetwork.chainConfig.nativeCurrency.symbol
              : ''
          }></MessageShow>

        {!isValid ? (
          <div className="m-4 text-center text-2xl text-red-500">
            {errors.name ||
              errors.symbol ||
              errors.logoUrl ||
              errors.mintAmount ||
              errors.addLiquidityAmount ||
              errors.bitusdAddLiquidityAmount}
          </div>
        ) : null}

        {isValid && (
          <div className="m-4 text-center text-2xl">
            You are about to mint {values.mintAmount} {values.symbol}, and add
            {values.addLiquidityAmount} {values.symbol} + {values.bitusdAddLiquidityAmount} bitusd
            to create a new liquidity pool.
          </div>
        )}

        <div className="pt-2">
          <PixelButton
            isLoading={isSubmitting}
            width={180}
            height={40}
            borderWidth={4}
            className="mx-auto"
            disabled={wallet ? isSubmitting || !isValid || !dirty : false}
            onClick={wallet ? submitForm : openWalletModal}>
            {wallet ? 'Create' : 'Connect Wallet'}
          </PixelButton>
        </div>
      </div>
    </div>
  );
};

export default CreatePair;
