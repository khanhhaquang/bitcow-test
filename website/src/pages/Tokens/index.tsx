//import sizeOf from 'buffer-image-size';
import { Formik, FormikHelpers } from 'formik';
import { useCallback } from 'react';
import * as yup from 'yup';

import CreatePair from './components/CreatePair';
import { ICreatePoolSetting } from './types';

import useMerlinWallet from '../../hooks/useMerlinWallet';
import useTokenBalance from '../../hooks/useTokenBalance';
import { openErrorNotification } from '../../utils/notifications';

const Tokens: React.FC = () => {
  const { requestCreatePair, bitusdToken, symbolToToken } = useMerlinWallet();
  const [bitusdTokenBalance, ready] = useTokenBalance(bitusdToken);
  const validationSchema = yup.object({
    name: yup.string().required("Name can't be empty"),
    symbol: yup
      .string()
      .required("Symbol can't be empty")
      .test('Repeat', 'Token Symbol has exited', (value) => !symbolToToken[value]),
    projectUrl: yup.string().url(),
    logoUrl: yup
      .string()
      .url('Logo URL is invalid')
      .matches(
        new RegExp(
          '.(bmp|jpg|png|tif|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|WMF|webp|jpeg)$'
        ),
        {
          message: 'image logo must end with one of: bmp/jpg/png/tif/gif/webp/jpeg'
        }
      )
      .required("Log url can't be empty"),
    mintAmount: yup.number().required().moreThan(0, 'Mint Amount should more than 0'),
    addLiquidityAmount: yup
      .number()
      .min(0)
      .required()
      .test(
        'max',
        'Add liquidity amount must be less than Supply Amount',
        (value, context) => value < context.parent.mintAmount
      ),
    bitusdAddLiquidityAmount: yup
      .number()
      .required('Adding bitusd to initial pool is required')
      .moreThan(0, 'bitusd addded to initial pool must more than 0')
      .max(bitusdTokenBalance, "Added bitusd amount can't be more than your balance")
  });
  const onSubmit = useCallback(
    async (values: ICreatePoolSetting, formikHelper: FormikHelpers<ICreatePoolSetting>) => {
      if (values.bitusdAddLiquidityAmount > bitusdTokenBalance) {
        openErrorNotification({ detail: "BITUSD Add amount can't more than your owned balance" });
        return;
      }
      if (symbolToToken[values.symbol]) {
        openErrorNotification({ detail: 'This symbol is already used by another token' });
        return;
      }
      let response;
      try {
        response = await fetch(values.logoUrl, {
          mode: 'no-cors'
        });
      } catch (e) {
        openErrorNotification({
          detail: `Unable to load the image. Please check the validity of the URL. ${
            e instanceof Error ? e.message : ''
          }`
        });
        return;
      }
      const arrayBuffer = await response.arrayBuffer();
      if (arrayBuffer.byteLength / 1024 > 15) {
        openErrorNotification({ detail: 'Image size must less than 15kB' });
        return;
      }
      /*
      try {
        const image = sizeOf(Buffer.from(arrayBuffer));
        if (image.width != image.height) {
          openErrorNotification({ detail: 'Image width must equal height' });
          return;
        }
      } catch (e) {
        openErrorNotification({
          detail: `Could not read the content of the logo image: ${
            e instanceof Error ? e.message : ''
          }`
        });
        return;
      }
      */

      // console.log(arrayBuffer);

      const result = await requestCreatePair(
        {
          name: values.name,
          symbol: values.symbol,
          decimals: values.decimals,
          description: values.description,
          projectUrl: values.projectUrl,
          logoUrl: values.logoUrl,
          coingeckoId: values.coingeckoId
        },
        values.mintAmount,
        values.addLiquidityAmount,
        values.bitusdAddLiquidityAmount,
        values.protocolFeeShareThousandth,
        values.feeMillionth,
        values.protocolFeeAddress,
        values.addTokenListFee
      );
      if (result) {
        formikHelper.resetForm();
      }
      formikHelper.setSubmitting(false);
    },
    [requestCreatePair, bitusdTokenBalance, symbolToToken]
  );
  return (
    <Formik
      initialValues={{
        name: '',
        symbol: '',
        decimals: 18,
        description: '',
        projectUrl: '',
        logoUrl: '',
        coingeckoId: '',
        mintAmount: 0,
        addLiquidityAmount: 0,
        bitusdAddLiquidityAmount: 0,
        protocolFeeShareThousandth: 300,
        feeMillionth: 2000,
        protocolFeeAddress: '0x1B6af6914Ed8da853Dd24AA8e3Ef0751660c5840',
        addTokenListFee: '0'
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}>
      <CreatePair bitusdBalance={bitusdTokenBalance} ready={ready}></CreatePair>
    </Formik>
  );
};
export default Tokens;
