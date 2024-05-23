import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import PixelButton from 'components/PixelButton';
import CreatePoolToken from './CreatePoolToken';

interface TProps {
  onClose: () => void;
}

const CreatePool: React.FC<TProps> = ({ onClose }) => {
  const dispatch = useDispatch();

  const onConfirm = useCallback(() => {
    onClose();
  }, [onClose, dispatch]);

  return (
    <div className="flex w-full flex-col space-y-6 bg-bc-swap px-6 pt-6 pb-9 text-white">
      <div className="border-b border-white/20 pb-3 font-micro text-2xl">Create new pool</div>
      <div className="flex flex-col space-y-9">
        <div className="flex space-x-3">
          <CreatePoolToken tokenType="TOKEN A"></CreatePoolToken>
          <CreatePoolToken tokenType="TOKEN B"></CreatePoolToken>
        </div>
        <div className="flex justify-center">
          <PixelButton
            className="text-2xl"
            width={206}
            height={44}
            // disabled={activeWallet && (!isValid || !dirty)}
            onClick={onConfirm}>
            CREATE
          </PixelButton>
        </div>
      </div>
    </div>
  );
};

export default CreatePool;
