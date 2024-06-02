import BitcowModal from 'components/BitcowModal';
import { FC } from 'react';
import { CloseIcon } from 'resources/icons';
import imageLuckyPrize from 'resources/img/luckyPrize.webp';
import { useSelector } from 'react-redux';
import { getLuckyAward } from 'modules/luckyCow/reducer';

type LuckyPrizeModalProps = {
  open: boolean;
  onCancel: () => void;
};

const LuckyPrizeModal: FC<LuckyPrizeModalProps> = ({ open, onCancel }) => {
  const data = useSelector(getLuckyAward);
  // const data = [
  //   {
  //     token: 'SOL',
  //     icon: 'images/WBTC.svg',
  //     amount: 50
  //   },
  //   {
  //     token: 'SOL',
  //     icon: 'images/WBTC.svg',
  //     amount: 50
  //   },
  //   {
  //     token: 'SOL',
  //     icon: 'images/WBTC.svg',
  //     amount: 50
  //   },
  //   {
  //     token: 'SOL',
  //     icon: 'images/WBTC.svg',
  //     amount: 50
  //   },
  //   {
  //     token: 'SOL',
  //     icon: 'images/WBTC.svg',
  //     amount: 50
  //   }
  // ];
  return (
    <BitcowModal
      closable
      open={open}
      width={795}
      bodyStyle={{ padding: 0 }}
      onCancel={() => onCancel()}
      className="h-[391px] bg-[#FF8D00]"
      closeIcon={<CloseIcon className="relative top-4 text-black" />}>
      <div className="flex h-[391px] w-full flex-col items-center bg-[#FF8D00] py-6">
        <h3 className="mb-6 text-center font-micro text-4xl text-black">your prizes</h3>
        <div className="flex items-center justify-center">
          <div className="mb-1 grid grid-cols-5 gap-x-6">
            {data.map((item, index) => {
              return (
                <div key={`lucky-prize-${index}`} className="flex flex-col items-center">
                  <img src={imageLuckyPrize} width={112} height={111} />
                  <div className="flex text-center text-2xl text-black">
                    <img src={item.icon} width={19} height={19} className="mr-2" />
                    <div className="truncate font-pg text-lg">{item.token}</div>
                  </div>
                  <div className="text-center font-micro text-5xl text-black">{item.amount}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mb-5 text-center font-micro text-lg text-white">are on the way</div>
        <div className="text-center font-pd text-lg text-white">Check the transaction here</div>
      </div>
    </BitcowModal>
  );
};

export default LuckyPrizeModal;
