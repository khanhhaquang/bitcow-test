/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { toChecksumAddress } from '@ethereumjs/util';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { Contract, getAddress, isAddress, isAddressable } from 'ethers';
import { useFormikContext } from 'formik';
import { useCallback } from 'react';

import Button from 'components/Button';
import PositiveFloatNumInput from 'components/PositiveFloatNumInput';
import useUpload from 'hooks/useUpload';
import { ReactComponent as QuestionMarkIcon } from 'resources/icons/questionMark.svg';
import { ReactComponent as UploadIcon } from 'resources/icons/uploadIcon.svg';

import { ICreatePool } from './types';

import { numberGroupFormat } from '../../../../components/PositiveFloatNumInput/numberFormats';
import useMerlinWallet from '../../../../hooks/useMerlinWallet';
import { TokenInfo } from '../../../../sdk';
import { ABI_ERC20 } from '../../../../sdk/abi/ERC20';

interface TProps {
  tokenType: 'xToken' | 'yToken';
}

const CreatePoolToken: React.FC<TProps> = ({ tokenType }) => {
  const tokenTitle = tokenType === 'xToken' ? 'TOKEN A' : 'TOKEN B';

  const { bitcowSDK } = useMerlinWallet();
  const { setFieldValue, values, validateForm } = useFormikContext<ICreatePool>();
  const { handleImgUpload } = useUpload();
  const onClickMax = useCallback(() => {
    console.log('max');
    console.log(values[tokenType + 'Balance']);
    setFieldValue(tokenType + 'Amount', values[tokenType + 'Balance']);
  }, [setFieldValue, tokenType, values]);

  const onAddressChange = useCallback(
    async (address: string) => {
      if (bitcowSDK && bitcowSDK.pairV1Manager && isAddress(address)) {
        address = toChecksumAddress(address);
        setFieldValue(tokenType + 'Address', address);
        values.isValidating = true;
        values.error = undefined;
        let tokenInfo: TokenInfo;
        let balanceBN: bigint;
        let decimals: number;
        let symbol: string;
        try {
          tokenInfo = await bitcowSDK.pairV1Manager.getTokenInfo(address);
        } catch (e) {
          values.error = 'Get error while check token bean used';
        }
        const tokenContract = new Contract(address, ABI_ERC20, bitcowSDK.provider);
        if (tokenInfo.decimals > 0) {
          try {
            balanceBN = await tokenContract.balanceOf(bitcowSDK.getAddress());
            decimals = tokenInfo.decimals;
            symbol = tokenInfo.symbol;
            setFieldValue(tokenType + 'LogoUrl', tokenInfo.logoUrl);
          } catch (e) {
            values.error = 'Get error while fetch token balance';
          }
        } else {
          try {
            [symbol, balanceBN, decimals] = await bitcowSDK.promiseThrottle.addAll([
              async () => {
                return tokenContract.symbol();
              },
              async () => {
                return tokenContract.balanceOf(bitcowSDK.getAddress());
              },
              async () => {
                return Number((await tokenContract.decimals()).toString());
              }
            ]);
          } catch (e) {
            console.log(e);
            values.error = 'Get error while fetch token info';
          }
          setFieldValue(tokenType + 'LogoUrl', '');
        }
        values.isValidating = false;
        setFieldValue(tokenType + 'Symbol', symbol);
        setFieldValue(tokenType + 'Decimals', decimals);
        setFieldValue(
          tokenType + 'Balance',
          new BigNumber(balanceBN.toString()).div(10 ** decimals).toNumber()
        );
      } else {
        setFieldValue(tokenType + 'Symbol', '');
        setFieldValue(tokenType + 'Decimals', 0);
        setFieldValue(tokenType + 'LogoUrl', '');
        setFieldValue(tokenType + 'Balance', 0);
      }
      setFieldValue(tokenType + 'Address', address);
    },
    [bitcowSDK, setFieldValue, tokenType, values]
  );

  const onAmountChange = useCallback(
    (amount: number) => {
      setFieldValue(tokenType + 'Amount', amount);
    },
    [setFieldValue, tokenType]
  );

  return (
    <div className="flex flex-1 flex-col space-y-1.5 font-pg text-lg leading-none">
      <div className="font-micro text-white/20">{tokenTitle}</div>
      <div className="flex flex-col space-y-3 bg-white/5 p-3">
        <div className="flex flex-col space-y-3">
          <div>Token address</div>
          <div className="flex flex-wrap py-2">
            {values[tokenType + 'LogoUrl'].length > 0 ? (
              <img src={values[tokenType + 'LogoUrl']} width={24} height={24} className="mr-2" />
            ) : (
              <QuestionMarkIcon width={17} height={17} className="mr-2 w-[17px] self-center" />
            )}
            <input
              className={classNames(
                'mr-2 h-[24px] flex-1 overflow-x-auto',
                'focus: outline-none',
                'bg-transparent text-2xl leading-none text-white  placeholder:text-white/20'
              )}
              placeholder="Paste here"
              inputMode="decimal"
              type="text"
              value={values[tokenType + 'Address']}
              onChange={async (event) => {
                await onAddressChange(event.target.value);
              }}
            />
            {values[tokenType + 'LogoUrl'].length === 0 && (
              <Button className="relative my-px h-[22px] w-[59px] !rounded-none bg-white/80 px-2 py-1 text-sm text-blue1 hover:bg-bc-grey-transparent2">
                <UploadIcon className="mr-2" />
                Icon
                <input
                  type="file"
                  id="image-upload"
                  name="image-upload"
                  accept="image/*"
                  className="absolute inset-0 opacity-0"
                  onChange={(event) => {
                    const maxAllowedSize = 15 * 1024; // 15kb
                    if (event.target.files[0].size > maxAllowedSize) {
                      event.target.value = '';
                      return;
                    }
                    handleImgUpload(event.target.files[0], (cdnUrl) => {
                      setFieldValue(tokenType + 'LogoUrl', cdnUrl);
                    });
                  }}
                />
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-1">
          <span className="h-[1.5px] flex-1 bg-white/10"></span>
        </div>
        <div className="flex flex-col space-y-1.5">
          <div className="flex flex-col space-y-3">
            <div>Amount</div>
            <div className="flex flex-wrap py-[3px]">
              <PositiveFloatNumInput
                min={0}
                max={values[tokenType + 'Balance']}
                maxDecimals={9}
                placeholder="0.00"
                className={classNames(
                  'mr-2 h-[24px] flex-1 overflow-x-auto',
                  'focus: outline-none',
                  'bg-transparent text-2xl text-white placeholder:text-white/20'
                )}
                inputAmount={values[tokenType + 'Amount']}
                onInputChange={onAmountChange}
                onAmountChange={onAmountChange}></PositiveFloatNumInput>

              <Button
                onClick={onClickMax}
                className="my-px h-[22px] !rounded-none bg-white/80 px-3 py-1 text-sm text-blue1 hover:bg-bc-grey-transparent2">
                Max
              </Button>
            </div>
          </div>
          <div className="text-sm leading-none text-white/80">
            <span>{'Available:'}</span>
            <span className="ml-2">{numberGroupFormat(values[tokenType + 'Balance'], 9)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePoolToken;
