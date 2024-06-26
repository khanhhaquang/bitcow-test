import { Formik, FormikHelpers } from 'formik';
import poolAction from 'modules/pool/actions';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import CreatePoolUi from './CreatePoolUi';
import { ICreatePool } from './types';

import useMerlinWallet from '../../../../hooks/useMerlinWallet';
import { saveLocalPairMessages } from '../../../../utils/localPools';

interface TProps {}

const CreatePool: React.FC<TProps> = () => {
  const { bitcowSDK, requestCreatePairWithManager, createBitcowSDK } = useMerlinWallet();
  const dispatch = useDispatch();
  const onConfirm = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        formikHelper.resetForm();
        dispatch(poolAction.TOGGLE_LIQUIDITY_MODAL(null));
      }
      formikHelper.setSubmitting(false);
    },
    [bitcowSDK, createBitcowSDK, requestCreatePairWithManager]
  );

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
      onSubmit={onConfirm}>
      <CreatePoolUi></CreatePoolUi>
    </Formik>
  );
};

export default CreatePool;
