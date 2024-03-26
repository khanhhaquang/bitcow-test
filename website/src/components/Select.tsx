import classNames from 'classnames';
import { ReactNode, useEffect, useMemo, useState } from 'react';

import { ReactComponent as SelectUnfoldIcon } from 'resources/icons/selectUnfold.svg';

interface IOption {
  icon: string;
  label: string;
  value: string;
  disabled?: boolean;
}
interface ISelectProps {
  className?: string;
  options: IOption[];
  defaultValue?: string;
  onSelect: (value: string) => void;
}

function SelectRow({
  icon,
  label,
  suffix,
  isHoverEnabled
}: {
  icon: string;
  label: string;
  suffix?: ReactNode;
  isHoverEnabled?: boolean;
}) {
  return (
    <div
      className={classNames(
        'flex h-[28px] w-[133px] cursor-pointer items-center justify-start gap-x-[3px] border border-transparent bg-bc-white-10 px-2 py-1',
        { 'hover:border-bc-white-60': isHoverEnabled }
      )}>
      <img className="h-[15px] w-[15px] rounded-full" src={icon} alt={`${label} icon`} />
      <div className="truncate text-lg">{label}</div>
      {suffix && <div className="ml-auto">{suffix}</div>}
    </div>
  );
}

export default function Select({ defaultValue, options, onSelect }: ISelectProps) {
  const [value, setValue] = useState(defaultValue ?? options[0].value);
  useEffect(() => {
    if (onSelect) onSelect(value);
  }, [onSelect, value]);
  const currentOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );
  const [isUnfold, setIsUnfold] = useState(false);

  // add logic to unfold when click outside the component
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!e.target) return;
      const target = e.target as HTMLElement;
      if (!target.closest('.bc-select')) {
        setIsUnfold(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="bc-select relative text-bc-white">
      <div onClick={() => setIsUnfold(!isUnfold)}>
        <SelectRow
          icon={currentOption?.icon}
          label={currentOption?.label}
          suffix={<SelectUnfoldIcon className={isUnfold && 'rotate-180'} />}
        />
      </div>
      {isUnfold && (
        <div className="absolute left-0 top-full">
          {options.map((option) => {
            return (
              <div
                key={option.value}
                className="mt-[2px]"
                onClick={() => {
                  setValue(option.value);
                  setIsUnfold(false);
                }}>
                <SelectRow icon={option.icon} label={option.label} isHoverEnabled />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
