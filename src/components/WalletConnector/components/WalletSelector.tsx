import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { useMemo } from 'react';

import Button from 'components/Button';
import useAptosWallet from 'hooks/useAptosWallet';

type TOptionProps = {
  onClick?: () => void;
  label: string;
  icon?: string;
};

const Option: React.FC<TOptionProps> = ({ onClick, label, icon }) => {
  const getWalletIcon = () => {
    return icon ? (
      <img src={icon} width={24} height={24} className="block rounded-full bg-white" />
    ) : (
      <div className="bg-grey-700 block h-6 w-6 rounded-full" />
    );
  };

  return (
    <Button
      onClick={onClick ? onClick : undefined}
      className="flex w-auto grow justify-between gap-2 !rounded-none border-[1px] border-gray_008 bg-color_bg_2 !py-3 !px-4 hover:border-color_main"
      variant="outlined">
      {getWalletIcon()}
      <div className="text-base">{label}</div>
    </Button>
  );
};

const WalletSelector: React.FC = () => {
  const { wallets, select } = useWallet();
  const { closeModal } = useAptosWallet();

  const renderButtonGroup = useMemo(() => {
    return wallets.map((wallet) => {
      const option = wallet.adapter;
      return (
        <Option
          key={option.name}
          label={option.name}
          icon={option.icon}
          onClick={() => {
            select(option.name);
            closeModal();
          }}
        />
      );
    });
  }, [wallets, select, closeModal]);

  return (
    <div className="font-Rany text-white">
      <div className="text-lg">Connect wallet</div>
      <hr className="my-4 h-[1px] border-0 bg-color_list_hover" />
      <div className="mb-4 text-lg">Select Wallet</div>
      <div className="grid grid-cols-2 gap-4">{renderButtonGroup}</div>
    </div>
  );
};

export default WalletSelector;
