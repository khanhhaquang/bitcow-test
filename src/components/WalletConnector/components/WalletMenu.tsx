import Button from 'components/Button';

import { useEvmConnectContext } from '../../../wallet';

const WalletMenu: React.FC = () => {
  const { disconnect } = useEvmConnectContext();
  return (
    <div className="flex w-full p-2">
      <Button
        onClick={() => {
          disconnect();
        }}
        className="w-full">
        Logout
      </Button>
    </div>
  );
};

export default WalletMenu;
