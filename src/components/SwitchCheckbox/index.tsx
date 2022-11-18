import cx from 'classnames';

import { CheckIcon, CrossIcon } from 'resources/icons';

interface TProps {
  className?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SwitchCheckbox: React.FC<TProps> = ({ className, onChange, checked }) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const check = e.target.checked;
    onChange(check);
  };
  return (
    <label className={cx('relative mb-5 inline-flex cursor-pointer items-center', className)}>
      <input type="checkbox" onChange={handleOnChange} checked={checked} className="peer sr-only" />
      <div className="peer h-9 w-20 rounded-none bg-color_bg_2 p-[2px] after:absolute after:top-[2px] after:left-[2px] after:h-8 after:w-8 after:rounded-none after:border after:border-gray_008 after:bg-gray_008 after:transition-all after:content-[''] peer-checked:bg-color_bg_2 peer-checked:after:left-[14px] peer-checked:after:translate-x-full peer-checked:after:border-gray_008 peer-checked:after:border-color_main peer-checked:after:bg-color_main peer-focus:outline-none peer-focus:ring-0"></div>
      <div className="absolute top-1/2 right-[9px] hidden -translate-y-1/2 transform peer-checked:block">
        <CheckIcon />
      </div>
      <div className="absolute top-1/2 left-[10px] block -translate-y-1/2 transform peer-checked:hidden">
        <CrossIcon />
      </div>
    </label>
  );
};

export default SwitchCheckbox;
