import { Tooltip } from 'antd';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import swapAction from 'modules/swap/actions';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Button from 'components/Button';
import PositiveFloatNumInput from 'components/PositiveFloatNumInput';
// import { initState as swapInitState } from 'modules/swap/reducer';
import Switch from 'components/Switch';
import { ISwapSettings } from 'pages/Swap/types';
import { HintIcon } from 'resources/icons';

interface TProps {
  onClose: () => void;
}

const SubTitle = ({ children }: { children: string }) => {
  return (
    <div className="mb-4 flex items-center gap-2">
      <div className="text-base">{children}</div>
      <Tooltip title={children}>
        <HintIcon className="opacity-30 hover:opacity-100" />
      </Tooltip>
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

  const onClickAuto = useCallback(() => {
    const randomSlip = Math.round(Math.random() * 100 * 2) / 100;
    setFieldValue('slipTolerance', randomSlip);
  }, [setFieldValue]);

  return (
    <div className="w-full font-Rany text-white">
      <div className="text-lg">Transaction Settings</div>
      <hr className="my-4 h-[1px] border-0 bg-color_list_hover" />
      <div className="mobile:mt-0 mt-6">
        <SubTitle>Slippage Tolerance</SubTitle>
        <div className="flex gap-2">
          <div className="relative flex w-full items-center border-[1px] border-color_bg_2">
            <PositiveFloatNumInput
              inputAmount={values.slipTolerance}
              min={0}
              max={10}
              isConfine={true}
              placeholder="Custom"
              className={classNames('h-full w-full bg-color_bg_2 py-3 px-4 text-white')}
              onAmountChange={(v) => setFieldValue('slipTolerance', v)}
            />
            <div className={'absolute right-3 text-base text-gray_05'}>%</div>
          </div>
          <Button
            className="rounded-none border-[1px] border-color_main py-3 px-5 font-Rany text-base text-color_main hover:bg-color_main hover:text-black"
            variant="outlined"
            onClick={onClickAuto}>
            Auto
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <SubTitle>Transaction Deadline</SubTitle>
        <div className="flex w-fit items-center gap-x-4">
          <PositiveFloatNumInput
            className={classNames('bg-color_bg_2 py-3 px-4 text-white')}
            inputAmount={values.trasactionDeadline}
            isConfine={true}
            placeholder="0"
            min={0}
            max={600}
            onAmountChange={(v) => setFieldValue('trasactionDeadline', v)}
          />
          <div className="text-base capitalize">minutes</div>
        </div>
      </div>
      <hr className="my-4 h-[1px] border-0 bg-color_list_hover" />
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
        className="mt-5 w-full rounded-none bg-color_main font-Furore text-lg text-black disabled:bg-color_bg_3"
        // disabled={activeWallet && (!isValid || !dirty)}
        onClick={onConfirm}>
        SAVE
      </Button>
    </div>
  );
};

export default SwapSetting;
