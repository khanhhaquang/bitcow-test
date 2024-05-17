import { ReactNode, useEffect, useState } from 'react';

import { ReactComponent as SelectUnfoldIcon } from 'resources/icons/selectUnfold.svg';
import { cn } from 'utils/cn';

import useNetwork from '../hooks/useNetwork';
import { useEvmConnectContext, WalletType } from '../wallet';

function SelectRow({
  icon,
  label,
  suffix,
  className,
  isDropdownItem
}: {
  icon: string;
  label: string;
  suffix?: ReactNode;
  isDropdownItem?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex cursor-pointer items-center justify-start gap-x-2 bg-transparent p-1.5 hover:bg-white/10 active:bg-transparent active:text-black/50',
        isDropdownItem ? 'bg-white/5' : '',
        className
      )}>
      <img className="h-5 w-5 rounded-full" src={icon} alt={`${label} icon`} />
      <div className="truncate font-pg text-lg">{label}</div>
      {suffix && <div className="ml-auto">{suffix}</div>}
    </div>
  );
}

export default function Select() {
  const { networks, currentNetwork, setCurrentNetwork } = useNetwork();
  const { setCurrentChain, wallet } = useEvmConnectContext();
  const [isUnfold, setIsUnfold] = useState(false);
  useEffect(() => {
    if (
      networks &&
      wallet &&
      wallet.type === WalletType.EVM &&
      wallet.chainId !== currentNetwork.chainConfig.chainId
    ) {
      const newNetwork = networks.find((network) => network.chainConfig.chainId === wallet.chainId);
      if (newNetwork) {
        setCurrentNetwork(newNetwork);
      }
    }
  }, [wallet, currentNetwork, setCurrentNetwork, networks]);
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
          icon={currentNetwork?.icon}
          label={currentNetwork?.chainConfig.chainName}
          suffix={<SelectUnfoldIcon className={isUnfold ? 'rotate-180' : ''} />}
        />
      </div>
      {isUnfold && (
        <div className="absolute left-0 top-full w-full">
          {networks.map((network) => {
            return (
              <div
                key={network.chainConfig.chainId}
                className="mt-0.5"
                onClick={async () => {
                  if (await setCurrentChain(network.chainConfig)) {
                    setCurrentNetwork(network);
                  }
                  setIsUnfold(false);
                }}>
                <SelectRow
                  icon={network.icon}
                  label={network.chainConfig.chainName}
                  isDropdownItem
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
