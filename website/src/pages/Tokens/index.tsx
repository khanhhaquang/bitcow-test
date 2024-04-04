import sizeOf from 'buffer-image-size';
import { Formik, FormikHelpers } from 'formik';
import { useCallback } from 'react';
import * as yup from 'yup';

import CreatePair from './components/CreatePair';
import { ICreatePoolSetting } from './types';

import useMerlinWallet from '../../hooks/useMerlinWallet';
import useTokenBalance from '../../hooks/useTokenBalance';
import { openErrorNotification } from '../../utils/notifications';

const Tokens: React.FC = () => {
  const { requestCreatePair, bitusdToken } = useMerlinWallet();
  const [bitusdTokenBalance, ready] = useTokenBalance(bitusdToken);
  const validationSchema = yup.object({
    name: yup.string().required("Name can't be empty"),
    symbol: yup.string().required("Symbol can't be empty"),
    projectUrl: yup.string().url(),
    logoUrl: yup
      .string()
      .url('Logo Url is a invalid url')
      .matches(
        new RegExp(
          '.(bmp|jpg|png|tif|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|WMF|webp|jpeg)$'
        )
      )
      .required("Log url can't be empty"),
    mintAmount: yup.number().required().moreThan(0, 'Mint Amount should create than 0'),
    addLiquidityAmount: yup
      .number()
      .min(0)
      .test(
        'max',
        '${path} must be less than Mint Amount',
        (value, context) => value < context.parent.mintAmount
      ),
    bitusdAddLiquidityAmount: yup.number().required().moreThan(0, 'BITUSD Add must more than 0')
  });
  const onSubmit = useCallback(
    async (values: ICreatePoolSetting, formikHelper: FormikHelpers<ICreatePoolSetting>) => {
      if (values.bitusdAddLiquidityAmount > bitusdTokenBalance) {
        openErrorNotification({ detail: "BITUSD Add amount can't more than your owned balance" });
        return;
      }

      const response = await fetch(values.logoUrl);
      const arrayBuffer = await response.arrayBuffer();
      if (arrayBuffer.byteLength / 1024 > 10) {
        openErrorNotification({ detail: 'Image size must less than 10kB' });
        return;
      }
      const image = sizeOf(Buffer.from(arrayBuffer));
      if (image.width != image.height) {
        openErrorNotification({ detail: 'Image with must equals height' });
        return;
      }

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
    [requestCreatePair, bitusdTokenBalance]
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
