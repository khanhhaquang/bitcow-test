import BitcowModal from 'components/BitcowModal';
import PixelButton from 'components/PixelButton';
import { FC, useState } from 'react';
import { CloseIcon } from 'resources/icons';

type LuckyCodeModalProps = {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

const LuckyCodeModal: FC<LuckyCodeModalProps> = ({ open, onSubmit, onCancel }) => {
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <BitcowModal
      closable
      maskClosable
      open={open}
      width={572}
      bodyStyle={{ padding: 0 }}
      onCancel={() => onCancel()}
      className="h-[300px] border-[4px] border-black bg-[#FF8D00]"
      closeIcon={<CloseIcon className="relative top-4 text-black" />}>
      <div className="flex w-full flex-col items-center gap-y-6 pt-3 pb-6">
        <h3 className="text-center font-micro text-4xl text-black">Lucky Code?</h3>
        <div className="relative mb-5 flex h-[30px] w-[370px] items-center justify-center">
          <p className="absolute -top-1 left-0 h-1 w-full bg-white/40" />
          <p className="absolute -bottom-1 left-0 h-1 w-full bg-white/40" />
          <p className="absolute -left-1 top-0 h-full w-1 bg-white/40" />
          <p className="absolute -right-1 top-0 h-full w-1 bg-white/40" />
          <input
            className="text-pd h-full w-full bg-white/20 px-4 py-2 outline-0"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <span className="absolute -bottom-8 left-0 text-red-500">This code is not valid</span>
        </div>

        <p className="text-center font-pd text-lg text-white">
          Input a LUCKY CODE to redeem your <br />
          <small className="text-lg text-[#6B001E]">LUCKY COW lottery card</small>
        </p>

        <PixelButton
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
