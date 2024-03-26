import classNames from 'classnames';

import Select from './Select';

export default function NetworkSelect({ className }: { className?: string }) {
  const options = [
    {
      label: 'Merlin',
      value: 'mainnet',
      icon: '/images/merlin.png'
    },
    {
      label: 'B Squared',
      value: 'testnet',
      icon: '/images/bSquared.png'
    },
    { label: 'Botanix', value: 'localhost', icon: '/images/botanix.png' }
  ];

  return (
    <div
      className={classNames(
        'flex h-[26px] w-[224px] items-center justify-between text-bc-white',
        className
      )}>
      <div className="text-lg">Network:</div>
      <Select onSelect={() => {}} options={options} />
    </div>
  );
}
