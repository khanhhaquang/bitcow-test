import classNames from 'classnames';

import Select from './Select';

export default function NetworkSelect({ className }: { className?: string }) {
  return (
    <div
      className={classNames(
        'flex h-[26px] w-[224px] items-center justify-between text-bc-white',
        className
      )}>
      <div className="text-lg">Network:</div>
      <Select />
    </div>
  );
}
