import classNames from 'classnames';
import { useFormikContext } from 'formik';
import swapAction from 'modules/swap/actions';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import PixelButton from 'components/PixelButton';
import PositiveFloatNumInput from 'components/PositiveFloatNumInput';
import { ISwapSettings } from 'pages/Swap/types';

interface TProps {
  onClose: () => void;
}

const SubTitle = ({ children }: { children: string }) => {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="text-lg">{children}</span>
      {/* <Tooltip title={children}>
        <HintIcon className="dark:opacity-30 dark:hover:opacity-100" />
      </Tooltip> */}
    </div>
  );
};

const SwapSetting: React.FC<TProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { values, setFieldValue } = useFormikContext<ISwapSettings>();

  const onConfirm = useCallback(() => {
    dispatch(swapAction.SET_SWAP_SETTING(values));
    onClose();
  }, [onClose, values, dispatch]);

  // const onResetSwapSetting = useCallback(() => {
  //   setFieldValue('slipTolerance', swapInitState.swapSettings.slipTolerance);
  //   setFieldValue('trasactionDeadline', swapInitState.swapSettings.trasactionDeadline);
  //   setFieldValue('expertMode', swapInitState.swapSettings.expertMode);
  //   setFieldValue('disableIndirect', swapInitState.swapSettings.disableIndirect);
  //   setFieldValue('privacySwap', swapInitState.swapSettings.privacySwap);
  // }, [setFieldValue]);

  // const onClickAuto = useCallback(() => {
  //   const randomSlip = Math.round(Math.random() * 100 * 2) / 100;
  //   setFieldValue('slipTolerance', randomSlip);
  // }, [setFieldValue]);

  return (
    <div className="w-full bg-bc-swap px-4 pt-4 pb-6 text-white">
      <div className="border-b border-white/20 pb-3 font-micro text-2xl">Settings</div>
      <div className="mt-9 font-pd">
        <SubTitle>Slippage Tolerance</SubTitle>
        <div className="flex gap-2">
          <div className="relative flex h-10 w-full items-center text-lg">
            <PositiveFloatNumInput
              inputAmount={values.slipTolerance}
              min={0}
              max={10}
              placeholder="Custom"
              className={classNames('h-full w-full bg-bc-input py-3 px-4 text-white')}
              onAmountChange={(v) => setFieldValue('slipTolerance', v)}
            />
            <div className={'absolute right-3 text-base text-bc-white-60'}>%</div>
          </div>
          {/* <Button
            className="rounded-none border-[1px] border-color_main py-3 px-5  text-base text-color_main hover:bg-color_main hover:text-white tablet:h-10"
            variant="outlined"
            onClick={onClickAuto}>
            Auto
          </Button> */}
        </div>
      </div>
      <div className="mt-3 font-pd">
        <SubTitle>Transaction Deadline</SubTitle>
        <div className="relative flex h-10 w-full items-center gap-x-4 text-lg">
          <PositiveFloatNumInput
            className={classNames('h-full w-full bg-bc-input py-3 px-4 text-bc-white')}
            inputAmount={values.trasactionDeadline}
            placeholder="0"
            min={0}
            max={600}
            onAmountChange={(v) => setFieldValue('trasactionDeadline', v)}
          />
          <div className="absolute right-3 text-base text-bc-white-60">minutes</div>
        </div>
      </div>
      {/* <hr className="my-4 h-[1px] border-0 bg-color_list_hover tablet:mx-5" />
      <div className="mt-6 flex justify-between tablet:mx-5">
        <SubTitle>Expert Mode</SubTitle>
        <Switch
          checked={values.expertMode}
          onChange={(checked) => setFieldValue('expertMode', checked)}
        />
      </div>
      <div className="flex justify-between tablet:mx-5">
        <SubTitle>Disable Indirect Routing</SubTitle>
        <Switch
          checked={values.disableIndirect}
          onChange={(checked) => setFieldValue('disableIndirect', checked)}
        />
      </div>
      <div className="flex justify-between tablet:mx-5">
        <SubTitle>Privacy Swap</SubTitle>
        <Switch
          checked={values.privacySwap}
          onChange={(checked) => setFieldValue('privacySwap', checked)}
        />
      </div> */}
      {/* Mobile */}
      <div className="mt-9 flex justify-center">
        <PixelButton
          className="text-2xl"
          width={206}
          height={44}
          // disabled={activeWallet && (!isValid || !dirty)}
          onClick={onConfirm}>
          SAVE
        </PixelButton>
      </div>
    </div>
  );
};

export default SwapSetting;
