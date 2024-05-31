import { motion } from 'framer-motion';
import { FC } from 'react';

import BitcowModal from 'components/BitcowModal';
import { LuckyRewardBitUSDTicketBg } from 'resources/icons';
import { ReactComponent as BitUSDLuckyIcon } from 'resources/icons/bitUSDLucky.svg';
import { ReactComponent as CloseIcon } from 'resources/icons/pixelClose.svg';
import InvitationFirework from 'resources/img/lucky-draw/invitation-firework.webp';
import LotteryTicket from 'resources/img/lucky-draw/lotteryTicket.png';

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
                  <div className="relative flex h-[82px] w-[169px] items-center justify-center bg-color_yellow_2 bg-clip-content py-2 px-1">
                    <LuckyRewardBitUSDTicketBg className="absolute inset-0 left-0" />
                    <BitUSDLuckyIcon />
                    <div className="flex flex-col items-end text-pink_950">
                      <div className="text-5xl">3.5</div>
                      <div className="-mt-2 text-sm">bitUSD</div>
                    </div>
                  </div>
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
