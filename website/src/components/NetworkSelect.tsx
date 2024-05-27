import classNames from 'classnames';

import BridgeNavigator from './BridgeNavigator';
import Select from './Select';

export default function NetworkSelect({ className }: { className?: string }) {
  return (
    <div
      className={classNames('flex w-full items-center justify-between text-bc-white', className)}>
      <BridgeNavigator />
      <Select />
    </div>
  );
}
