import { motion } from 'framer-motion';
import { FC } from 'react';

import BitcowModal from 'components/BitcowModal';
import { LuckyRewardBitUSDTicketBg } from 'resources/icons';
import { ReactComponent as BitUSDLuckyIcon } from 'resources/icons/bitUSDLucky.svg';
import { ReactComponent as CloseIcon } from 'resources/icons/pixelClose.svg';
import InvitationFirework from 'resources/img/lucky-draw/invitation-firework.webp';
import LotteryTicket from 'resources/img/lucky-draw/lotteryTicket.webp';
import { useNavigate } from 'react-router-dom';

interface RewardOptionProps {
  title: React.ReactElement;
  buttonElement: React.ReactElement;
  onClick: () => void;
}
const RewardOption = ({ title, buttonElement, onClick }: RewardOptionProps) => {
  return (
    <button
      onClick={onClick}
      className="flex h-[186px] flex-1 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg bg-[#FD981B] px-3 text-white  hover:bg-white/40 hover:text-black">
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
  const navigate = useNavigate();

  return (
    <BitcowModal onCancel={onClose} maskClosable open={open} width="100vw" destroyOnClose>
      <div className="-mt-[100px] flex h-screen w-full items-center justify-center bg-contain tablet:mt-0 tablet:h-fit">
        <motion.div
          className="pointer-events-none absolute h-full w-full bg-contain"
          animate={{
            backgroundImage: `url('${InvitationFirework}')`,
            opacity: [1, 0],
            transition: {
              ease: 'easeOut',
              duration: 5
            }
          }}
        />
        <div className="relative flex w-[516px] flex-col gap-6 border-[4px] border-black bg-color_yellow_2 p-9 pt-6 font-pd text-white tablet:w-full">
          <button className="absolute right-4 top-4 cursor-pointer text-black" onClick={onClose}>
            <CloseIcon />
          </button>
          <div className="pb-3 text-center font-micro text-2xl text-black">Congratulations!</div>
          <div className="flex w-full flex-col items-center gap-6">
            <div className="h-9 w-[361px] text-center font-pd text-lg font-normal text-black">
              You have hit a lucky spot! Choose between two rewards below:
            </div>
            <div className="flex w-full justify-between gap-6">
              <RewardOption
                onClick={() => {
                  //TODO: FIRE BITCOW SDK RECEIVE AIRDROP
                }}
                title={<h3 className="text-center text-lg leading-4">Receive bitUSD airdrop</h3>}
                buttonElement={
                  <div className="relative flex h-[82px] w-[169px] items-center justify-center bg-color_yellow_2 bg-clip-content py-2 px-1">
                    <LuckyRewardBitUSDTicketBg className="absolute inset-0 left-0" />
                    <BitUSDLuckyIcon />
                    <p className="flex flex-col items-end font-pdb text-pink_950">
                      <span className="text-5xl [text-shadow:_2px_2px_0px_rgba(0,0,0,0.13)]">
                        3.5
                      </span>
                      <span className="-mt-2 text-sm">bitUSD</span>
                    </p>
                  </div>
                }
              />
              <RewardOption
                onClick={() => {
                  navigate('/lucky-cow', { state: { isFromLuckyChance: true } });
                }}
                title={
                  <p className="flex h-9 flex-col items-center gap-1 text-center text-lg leading-4">
                    <span>Redeem</span>
                    <span className="text-pink_950">LUCKY COW lottery</span>
                  </p>
                }
                buttonElement={
                  <p className="flex flex-col items-center gap-1">
                    <img src={LotteryTicket} alt="lottery-ticket" className="h-[75px] w-[146px]" />
                    <span className="text-pink_950">(worth 10$)</span>
                  </p>
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
