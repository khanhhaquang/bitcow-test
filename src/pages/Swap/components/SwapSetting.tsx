import { useFormikContext } from 'formik';
import { ISwapSettings } from 'pages/Swap/types';
import Button from 'components/Button';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import swapAction from 'modules/swap/actions';
import PositiveFloatNumInput from 'components/PositiveFloatNumInput';
import classNames from 'classnames';
// import { initState as swapInitState } from 'modules/swap/reducer';
import { HintIcon } from 'resources/icons';
import Switch from 'components/Switch';

interface TProps {
  onClose: () => void;
}

const SubTitle = ({ children }: { children: string }) => {
  return (
    <div className="flex gap-2 items-center mb-4">
      <div className="text-base">{children}</div>
      <HintIcon />
    </div>
  );
};

const SwapSetting: React.FC<TProps> = ({ onClose }) => {
  const slippageOptions = [0.5, 1, 2];

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

  // TODO: manage state here!
  const isCustomSlippage = !slippageOptions.includes(values.slipTolerance);

  return (
    <div className="w-full font-Rany text-white">
      <div className="text-lg">Transaction Settings</div>
      <hr className="h-[1px] bg-color_list_hover my-4 border-0" />
      <div className="mt-6 mobile:mt-0">
        <SubTitle>Slippage Tolerance</SubTitle>
        <div className="flex gap-2">
          <div className="flex relative items-center w-full border-color_bg_2 border-[1px]">
            <PositiveFloatNumInput
              inputAmount={!isCustomSlippage ? 0 : values.slipTolerance}
              min={0}
              max={10}
              isConfine={true}
              placeholder="Custom"
              className={classNames('bg-color_bg_2 text-white py-3 px-4 w-full h-full')}
              onAmountChange={(v) => setFieldValue('slipTolerance', v)}
            />
            <div className={'text-base text-gray_05 absolute right-3'}>%</div>
          </div>
          <Button
            className="border-[1px] border-color_main text-color_main hover:text-black hover:bg-color_main font-Rany text-base py-3 px-5 rounded-none"
            variant="outlined">
            Auto
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <SubTitle>Transaction Deadline</SubTitle>
        <div className="flex w-fit items-center gap-x-4">
          <PositiveFloatNumInput
            className={classNames('bg-color_bg_2 text-white py-3 px-4')}
            inputAmount={values.trasactionDeadline}
            isConfine={true}
            placeholder="0"
            min={0}
            max={600}
            onAmountChange={(v) => setFieldValue('trasactionDeadline', v)}
          />
          <div className="capitalize text-base">minutes</div>
        </div>
      </div>
      <hr className="h-[1px] bg-color_list_hover my-4 border-0" />
      <div className="mt-6 flex justify-between">
        <SubTitle>Expert Mode</SubTitle>
        <Switch
          checked={values.expertMode}
          onChange={(checked) => setFieldValue('expertMode', checked)}
        />
      </div>
      <div className="flex justify-between">
        <SubTitle>Disable Indirect Routing</SubTitle>
        <Switch
          checked={values.disableIndirect}
          onChange={(checked) => setFieldValue('disableIndirect', checked)}
        />
      </div>
      <div className="flex justify-between">
        <SubTitle>Privacy Swap</SubTitle>
        <Switch
          checked={values.privacySwap}
          onChange={(checked) => setFieldValue('privacySwap', checked)}
        />
      </div>
      <Button
        className="mt-5 w-full bg-button_gradient text-black font-Furore text-lg disabled:bg-color_bg_3 rounded-none"
        // disabled={activeWallet && (!isValid || !dirty)}
        onClick={onConfirm}>
        SAVE
      </Button>
    </div>
  );
};

export default SwapSetting;
