/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Formik, FormikHelpers } from 'formik';
import { useCallback } from 'react';
import * as yup from 'yup';

import PixelButton from 'components/PixelButton';

import CreatePoolToken from './CreatePoolToken';

// import useMerlinWallet from '../../../hooks/useMerlinWallet';
// import usePools from '../../../hooks/usePools';
// import { ABI_ERC20 } from '../../../sdk/abi/ERC20';
import CreatePoolUi from './CreatePoolUi';
import { ICreatePool } from './types';

import useMerlinWallet from '../../../../hooks/useMerlinWallet';
import { saveLocalPairMessages } from '../../../../utils/localPools';

interface TProps {
  onClose: () => void;
}

const CreatePool: React.FC<TProps> = ({ onClose }) => {
  const { bitcowSDK, requestCreatePairWithManager, createBitcowSDK } = useMerlinWallet();
  // const { coinPrices } = usePools();

  const onConfirm = useCallback(
    async (values: ICreatePool, formikHelper: FormikHelpers<ICreatePool>) => {
      const success = await requestCreatePairWithManager(
        {
          address: values.xTokenAddress,
          name: '',
          symbol: values.xTokenSymbol,
          decimals: values.xTokenDecimals,
          description: '',
          projectUrl: '',
          logoUrl: values.xTokenLogoUrl,
          coingeckoId: ''
        },
        {
          address: values.yTokenAddress,
          name: '',
          symbol: values.yTokenSymbol,
          decimals: values.yTokenDecimals,
          description: '',
          projectUrl: '',
          logoUrl: values.yTokenLogoUrl,
          coingeckoId: ''
        },
        values.xTokenAmount,
        values.yTokenAmount,
        values.xTokenPrice,
        values.yTokenPrice
      );
      if (success) {
        const pairs = await bitcowSDK.pairV1Manager.searchPairsAll(values.xTokenAddress, 100);
        saveLocalPairMessages(bitcowSDK.config.chainId, pairs);
        createBitcowSDK();
        onClose();
      }
    },
    [onClose]
  );
  const validationSchema = yup.object({
    xTokenAddress: yup
      .string()
      .required("Token A can't be empty")
      .length(42, 'Token A may not an address'),
    xTokenSymbol: yup.string().required('Token A symbol not found, the address may not a token'),
    xTokenDecimals: yup
      .number()
      .moreThan(0, 'Token A decimals not found, the address may not a token'),
    xTokenLogoUrl: yup.string().required("Token A logo can't be empty"),
    xTokenBalance: yup.number().moreThan(0, 'Token A no available balance'),
    xTokenAmount: yup
      .number()
      .required()
      .moreThan(0, 'Token A amount must more than zero')
      .test(
        'max',
        'Token A amount must less than balance',
        (value, context) => value <= context.parent.xTokenBalance
      ),
    yTokenAddress: yup
      .string()
      .required("Token B can't be empty")
      .length(42, 'Token B may not an address'),
    yTokenDecimals: yup
      .number()
      .moreThan(0, 'Token B decimals not found, the address may not a token'),
    yTokenSymbol: yup.string().required('Token B symbol not found, the address may not a token'),
    yTokenLogoUrl: yup.string().required("Token y logo can't be empty"),
    yTokenBalance: yup.number().moreThan(0, 'Token B no available balance'),
    yTokenAmount: yup
      .number()
      .required()
      .moreThan(0, 'Token B amount must more than zero')
      .test(
        'max',
        'Token B amount must less than balance',
        (value, context) => value <= context.parent.yTokenBalance
      )
  });

  return (
    <Formik
      initialValues={{
        xTokenAddress: '',
        xTokenLogoUrl: '',
        xTokenSymbol: '',
        xTokenDecimals: 0,
        xTokenBalance: 0,
        xTokenAmount: 0,
        xTokenPrice: 0,

        yTokenAddress: '',
        yTokenLogoUrl: '',
        yTokenSymbol: '',
        yTokenDecimals: 0,
        yTokenBalance: 0,
        yTokenAmount: 0,
        yTokenPrice: 0,
        isValidating: false,
        error: undefined
      }}
      validationSchema={validationSchema}
      onSubmit={onConfirm}>
      <CreatePoolUi></CreatePoolUi>
    </Formik>
  );
};

export default CreatePool;
