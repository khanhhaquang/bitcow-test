import { FC } from 'react';
import BitcowModal from 'components/BitcowModal';
import PixelButton from 'components/PixelButton';
import { ReactComponent as BitUSDLuckyIcon } from 'resources/icons/bitUSDLucky.svg';
import { ReactComponent as CloseIcon } from 'resources/icons/pixelClose.svg';
import LotteryTicket from 'resources/img/lucky-draw/lotteryTicket.png';
import InvitationFirework from 'resources/img/lucky-draw/invitation-firework.webp';
import { motion } from 'framer-motion';

interface RewardOptionProps {
  title: React.ReactElement;
  buttonElement: React.ReactElement;
}
const RewardOption = ({ title, buttonElement }: RewardOptionProps) => {
  return (
    <button className="flex h-[186px] flex-1 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg bg-[#FD981B] px-3 text-white  hover:bg-white/40 hover:text-black">
      {title}
      {buttonElement}
    </button>
  );
};

interface LuckyRewardModalProps {
  open?: boolean;
  onClose?: () => void;
}
const LuckyRewardModal: FC<LuckyRewardModalProps> = ({ open, onClose }) => {
  return (
    <BitcowModal onCancel={onClose} maskClosable={true} open={open} width="100vw" destroyOnClose>
      <div className="-mt-[100px] flex h-screen w-full items-center justify-center bg-contain tablet:mt-0 tablet:h-fit">
        <motion.div
          className="absolute h-full w-full bg-contain"
          animate={{
            backgroundImage: `url('${InvitationFirework}')`,
            opacity: [1, 0],
            transition: {
              ease: 'easeOut',
              duration: 5
            }
          }}
        />
        <div className="relative flex w-[516px] flex-col gap-6 bg-color_yellow_2 p-9 pt-6 font-pd text-white tablet:w-full">
          <CloseIcon className="absolute right-4 top-4 cursor-pointer" onClick={onClose} />
          <div className="pb-3 text-center font-micro text-2xl text-black">Congratulations!</div>
          <div className="flex w-full flex-col items-center gap-6">
            <div className="h-9 w-[361px] text-center font-pd text-lg font-normal text-black">
              You have hit a lucky spot! Choose between two rewards below:
            </div>
            <div className="flex w-full justify-between gap-6">
              <RewardOption
                title={<div className="text-center text-lg leading-4">Receive bitUSD airdrop</div>}
                buttonElement={
                  <PixelButton
                    className="bg-color_yellow_2 font-micro text-2xl uppercase hover:!bg-color_yellow_2"
                    width={169}
                    height={94}
                    color="#6B001E"
                    borderWidth={4}>
                    <div className="flex h-[94px] w-[169px] items-center justify-between border-4 border-[#FF6B00] p-3">
                      <BitUSDLuckyIcon />
                      <div className="flex h-fit flex-col items-end text-pink_950">
                        <div className="text-5xl">3.5</div>
                        <div className="text-sm">bitUSD</div>
                      </div>
                    </div>
                  </PixelButton>
                }
              />
              <RewardOption
                title={
                  <div className="flex h-9 flex-col items-center gap-1 text-center text-lg leading-4">
                    <div>Redeem</div>
                    <div className="text-pink_950">LUCKY COW lottery</div>
                  </div>
                }
                buttonElement={
                  <div className="flex flex-col items-center gap-1">
                    <img src={LotteryTicket} alt="lottery-ticket" className="h-[75px] w-[146px]" />
                    <div className="text-pink_950">(worth 10$)</div>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </BitcowModal>
  );
};

export default LuckyRewardModal;
