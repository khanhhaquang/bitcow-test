import classNames from 'classnames';

import Select from './Select';

export default function NetworkSelect({ className }: { className?: string }) {
  return (
    <div className={classNames('flex w-[224px] items-center justify-end text-bc-white', className)}>
      <Select />
    </div>
  );
}
