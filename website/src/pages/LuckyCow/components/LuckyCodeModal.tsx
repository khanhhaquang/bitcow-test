import BitcowModal from 'components/BitcowModal';
import PixelButton from 'components/PixelButton';
import useMerlinWallet from 'hooks/useMerlinWallet';
import { FC, useState } from 'react';
import { CloseIcon } from 'resources/icons';
import { UserService } from 'services/user';

type LuckyCodeModalProps = {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

const LuckyCodeModal: FC<LuckyCodeModalProps> = ({ open, onSubmit, onCancel }) => {
  const { wallet } = useMerlinWallet();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const result = await UserService.activateInviteCode.call(wallet?.accounts[0].evm, code);
      if (result.code === 0) {
        setCode('');
        onSubmit();
      } else {
        setError(result.message);
      }
    } catch (e) {
      console.log('🚀 ~ Check lucky code error:', e);
      setError('Checking failed');
    }
  };

  return (
    <BitcowModal
      closable
      maskClosable
      open={open}
      width={572}
      bodyStyle={{ padding: 0 }}
      onCancel={() => {
        setCode('');
        setError('');
        onCancel();
      }}
      className="h-[300px] border-[4px] border-black"
      closeIcon={<CloseIcon className="relative top-4 text-black" />}
      drawerCloseIcon={<CloseIcon className="text-black" />}>
      <div className="flex w-full flex-col items-center gap-y-6 bg-[#FF8D00] pt-3 pb-6">
        <h3 className="text-center font-micro text-4xl text-black">Lucky Code?</h3>
        <div className="relative mb-5 flex h-[30px] w-[370px] items-center justify-center">
          <p className="absolute -top-1 left-0 h-1 w-full bg-white/40" />
          <p className="absolute -bottom-1 left-0 h-1 w-full bg-white/40" />
          <p className="absolute -left-1 top-0 h-full w-1 bg-white/40" />
          <p className="absolute -right-1 top-0 h-full w-1 bg-white/40" />
          <input
            className="h-full w-full bg-white/20 px-4 py-2 text-center font-micro text-2xl outline-0"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError('');
            }}
          />
        </div>

        <p className="text-center font-pd text-lg text-white">
          Input a LUCKY CODE to redeem your <br />
          <small className="text-lg text-[#6B001E]">LUCKY COW lottery card</small>
        </p>

        {!!error && <p className="text-center font-pd text-[#FF1F00]">{error}</p>}

        <PixelButton
          disabled={!code}
          width={278}
          height={38}
          color="#000"
          onClick={handleSubmit}
          className="bg-[#FFC700] text-2xl text-black hover:!bg-[#FFC700] hover:!bg-lucky-redeem-btn-hover active:!bg-[#FFA800] active:!text-black">
          Redeem now
        </PixelButton>
      </div>
    </BitcowModal>
  );
};

export default LuckyCodeModal;
