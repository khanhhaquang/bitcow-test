/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import cx from 'classnames';

import { Select, SelectProps } from 'components/Antd';
import { CaretIcon, CheckIcon } from 'resources/icons';
// import styles from './Select.module.scss';

interface OptionProps {
  label: string;
  value: string;
  disabled?: boolean;
}

interface TProps extends SelectProps {
  className?: string;
  options: OptionProps[];
}

const SelectInput: React.FC<TProps> = ({ className, options, ...rest }) => {
  return (
    <div className={cx('selectInput', className)}>
      <Select suffixIcon={<CaretIcon className="fill-black dark:fill-white" />} {...rest}>
        {options.map((option) => {
          const { label, value, ...optRest } = option;
          return (
            <Select.Option value={value} {...optRest} key={label}>
              {label}
              <div className="text-white">
                <CheckIcon />
              </div>
            </Select.Option>
          );
        })}
      </Select>
    </div>
  );
};

export default SelectInput;
