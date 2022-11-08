/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import cx from 'classnames';
// import { Switch, SwitchProps } from 'components/Antd';
import { CheckIcon, CrossIcon } from 'resources/icons';
import styles from './SwitchInput.module.scss';

interface TProps {
  className?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SwitchInput: React.FC<TProps> = ({ className, onChange, checked }) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const check = e.target.checked;
    onChange(check);
  };
  return (
    <label className={cx('inline-flex relative items-center mb-5 cursor-pointer', className)}>
      <input type="checkbox" onChange={handleOnChange} checked={checked} className="sr-only peer" />
      <div className="w-20 h-9 bg-color_bg_2 rounded-none p-[2px] peer-focus:outline-none peer-focus:ring-0 peer peer-checked:after:translate-x-full peer-checked:after:border-gray_008 after:content-[''] after:absolute after:top-[2px] after:left-[2px] peer-checked:after:left-[14px] after:bg-gray_008 after:border-gray_008 peer-checked:after:bg-color_main peer-checked:after:border-color_main after:border after:rounded-none after:h-8 after:w-8 after:transition-all peer-checked:bg-color_bg_2"></div>
      <div className="hidden peer-checked:block absolute top-1/2 right-[9px] transform -translate-y-1/2">
        <CheckIcon />
      </div>
      <div className="block peer-checked:hidden absolute top-1/2 left-[10px] transform -translate-y-1/2">
        <CrossIcon />
      </div>
    </label>
  );
};

export default SwitchInput;
