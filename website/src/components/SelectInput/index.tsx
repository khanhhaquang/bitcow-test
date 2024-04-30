/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Select, SelectProps } from 'components/Antd';
import { CaretIcon, CheckIcon } from 'resources/icons';
import { cn } from 'utils/cn';
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
    <div className={cn('selectInput', className)}>
      <Select suffixIcon={<CaretIcon className="fill-white" />} {...rest}>
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
