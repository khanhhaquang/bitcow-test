import useNetwork from 'hooks/useNetwork';
import { BridgeIcon } from 'resources/icons';

const BridgeNavigator = () => {
  const { currentNetwork } = useNetwork();

  if (!currentNetwork?.bridgeUrl) return null;

  return (
    <a
      target="_blank"
      rel="noreferrer noopener"
      href={currentNetwork.bridgeUrl}
      className="flex h-10 items-center gap-x-2 rounded-none p-[6px] text-bc-white hover:bg-white/10 hover:text-bc-white active:bg-transparent active:text-black">
      <BridgeIcon className="min-w-[22px]" />
      <div className="font-pg text-lg">Bridge</div>
    </a>
  );
};

export default BridgeNavigator;
