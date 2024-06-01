import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, FC } from 'react';

import BitcowModal from 'components/BitcowModal';
import {
  CardCornerBottomLeft,
  CardCornerBottomRight,
  CardCornerTopLeft,
  CardCornerTopRight,
  LuckyRewardBitUSDTicketBg
} from 'resources/icons';
import { ReactComponent as BitUSDLuckyIcon } from 'resources/icons/bitUSDLucky.svg';
import { ReactComponent as CloseIcon } from 'resources/icons/pixelClose.svg';
import InvitationFirework from 'resources/img/lucky-draw/invitation-firework.webp';
import LotteryTicket from 'resources/img/lucky-draw/lotteryTicket.webp';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ITxnLucky, LuckyDrawService, RewardChoice } from 'services/luckyDraw';

interface RewardOptionProps extends ButtonHTMLAttributes<HTMLButtonElement> {}
const RewardOption = ({ disabled, children, ...rest }: RewardOptionProps) => {
  return (
    <button
      disabled={disabled}
      className="relative flex h-[186px] flex-1 cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-lg bg-white/10 px-3 font-pd  text-white hover:bg-white/40 hover:text-black"
      {...rest}>
      <CardCornerTopLeft className="absolute top-0 left-0" />
      <CardCornerTopRight className="absolute top-0 right-0" />
      <CardCornerBottomLeft className="absolute bottom-0 left-0" />
      <CardCornerBottomRight className="absolute bottom-0 right-0" />
      {children}
    </button>
  );
};

interface LuckyRewardModalProps {
  open?: boolean;
  onClose?: () => void;
  luckyTxn?: ITxnLucky;
}
const LuckyRewardModal: FC<LuckyRewardModalProps> = ({ luckyTxn, onClose }) => {
  const navigate = useNavigate();

  const { mutateAsync: chooseOptionRequest, isPending } = useMutation({
    mutationFn: (data: { luckyId: number; choice: RewardChoice }) =>
      LuckyDrawService.chooseRewardOption.call(data.luckyId, data.choice)
  });

  return (
    <BitcowModal onCancel={onClose} maskClosable open={!!luckyTxn} width="100vw" destroyOnClose>
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
          <div className="pb-3 text-center font-micro text-4xl text-black">Congratulations!</div>
          <div className="flex w-full flex-col items-center gap-6">
            <div className="h-9 w-[361px] text-center font-pd text-lg font-normal text-black">
              You have hit a lucky spot! Choose between two rewards below:
            </div>
            <div className="flex w-full justify-between gap-6">
              <RewardOption
                disabled={isPending}
                onClick={() => {
                  chooseOptionRequest({
                    luckyId: luckyTxn?.luckyId,
                    choice: RewardChoice.RECEIVE_AIRDROP
                  })
                    .then((result) => {
                      onClose();
                      console.log(result);
                      //TODO: show airdropHash here
                    })
                    .catch((e) => console.log(e));
                }}>
                <h3 className="text-center text-lg leading-4">Receive bitUSD airdrop</h3>
                <div className="relative flex h-[82px] w-[169px] items-center justify-center bg-color_yellow_2 bg-clip-content py-2 px-1">
                  <LuckyRewardBitUSDTicketBg className="absolute inset-0 left-0" />
                  <BitUSDLuckyIcon />
                  <p className="flex flex-col items-end font-pdb text-pink_950">
                    <span className="text-5xl [text-shadow:_2px_2px_0px_rgba(0,0,0,0.13)]">
                      {luckyTxn?.luckyAmount.toFixed(1)}
                    </span>
                    <span className="-mt-2 text-sm">bitUSD</span>
                  </p>
                </div>
              </RewardOption>
              <RewardOption
                disabled={isPending}
                onClick={() => {
                  chooseOptionRequest({
                    luckyId: luckyTxn?.luckyId,
                    choice: RewardChoice.SCRATCH_CARDS
                  })
                    .then((result) => {
                      console.log('🚀 chooseOptionRequest ~ SCRATCH_CARDS:', result);
                      if (result.code === 0) {
                        onClose();
                        navigate('/lucky-cow', { state: { isFromLuckyChance: true } });
                      }
                    })
                    .catch((e) => console.log(e));
                }}>
                <p className="flex h-9 flex-col items-center gap-1 text-center text-lg leading-4">
                  <span>Redeem</span>
                  <span className="font-pdb text-pink_950">LUCKY COW lottery</span>
                </p>
                <p className="flex flex-col items-center gap-1">
                  <img src={LotteryTicket} alt="lottery-ticket" className="h-[75px] w-[146px]" />
                  <span className="text-pink_950">(worth 10$)</span>
                </p>
              </RewardOption>
            </div>
          </div>
        </div>
      </div>
    </BitcowModal>
  );
};

export default LuckyRewardModal;
