import classNames from 'classnames';
import { useFormikContext } from 'formik';
import swapAction from 'modules/swap/actions';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Button from 'components/Button';
import PositiveFloatNumInput from 'components/PositiveFloatNumInput';
import { ISwapSettings } from 'pages/Swap/types';

interface TProps {
  onClose: () => void;
}

const SubTitle = ({ children }: { children: string }) => {
  return (
    <div className="mb-4 flex items-center gap-2">
      <div className="text-base">{children}</div>
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
    <div className="w-full font-Rany text-item_black dark:text-white">
      <div className="text-lg tablet:px-5 tablet:py-[22px] tablet:leading-5">
        Transaction Settings
      </div>
      <hr className="my-4 h-[1px] border-0 bg-white_color_list_hover dark:bg-color_list_hover tablet:my-0" />
      <div className="mt-6 tablet:mx-5">
        <SubTitle>Slippage Tolerance</SubTitle>
        <div className="flex gap-2">
          <div className="relative flex w-full items-center tablet:h-10">
            <PositiveFloatNumInput
              inputAmount={values.slipTolerance}
              min={0}
              max={10}
              isConfine={true}
              placeholder="Custom"
              className={classNames(
                'h-full w-full bg-white_table py-3 px-4 text-item_black dark:bg-color_bg_2 dark:text-white'
              )}
              onAmountChange={(v) => setFieldValue('slipTolerance', v)}
            />
            <div className={'absolute right-3 text-base text-white_gray_05 dark:text-gray_05'}>
              %
            </div>
          </div>
          {/* <Button
            className="rounded-none border-[1px] border-color_main py-3 px-5 font-Rany text-base text-color_main hover:bg-color_main hover:text-white tablet:h-10"
            variant="outlined"
            onClick={onClickAuto}>
            Auto
          </Button> */}
        </div>
      </div>
      <div className="mt-6 tablet:mx-5">
        <SubTitle>Transaction Deadline</SubTitle>
        <div className="flex w-fit items-center gap-x-4 tablet:h-10">
          <PositiveFloatNumInput
            className={classNames(
              'bg-white_table py-3 px-4 text-item_black dark:bg-color_bg_2 dark:text-white'
            )}
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
      <div className="hidden bg-gray_008 p-4 tablet:block">
        <Button
          className="h-10 w-full rounded-none bg-color_main font-Furore text-lg text-white disabled:bg-color_bg_3"
          // disabled={activeWallet && (!isValid || !dirty)}
          onClick={onConfirm}>
          SAVE
        </Button>
      </div>
      {/* Desktop */}
      <Button
        className="mt-5 w-full rounded-none bg-color_main font-Furore text-lg text-white disabled:bg-color_bg_3 tablet:hidden"
        // disabled={activeWallet && (!isValid || !dirty)}
        onClick={onConfirm}>
        SAVE
      </Button>
    </div>
  );
};

export default SwapSetting;
