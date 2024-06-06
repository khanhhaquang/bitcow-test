import { getClaimHash, getPickedCard } from 'modules/luckyCow/reducer';
import { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';

import BitcowModal from 'components/BitcowModal';
import useNetwork from 'hooks/useNetwork';
import useTokenAwardInfo from 'hooks/useTokenAwardInfo';
import { CloseIcon } from 'resources/icons';
import imageLuckyPrize from 'resources/img/luckyPrize.webp';

import { ILuckyAward } from '../types';

type LuckyPrizeModalProps = {
  open: boolean;
  onCancel: () => void;
};

const LuckyPrizeModal: FC<LuckyPrizeModalProps> = ({ open, onCancel }) => {
  const { currentNetwork } = useNetwork();
  const { data: tokenInfo } = useTokenAwardInfo();
  const pickedCard = useSelector(getPickedCard);

  const claimHash = useSelector(getClaimHash);

  const link = `${currentNetwork.chainConfig.blockExplorerUrls[0]}/tx/${claimHash}`;

  const content = useMemo(() => {
    let data: ILuckyAward[] = [];
    pickedCard.map((card) =>
      data.push({
        token: card.luckyToken,
        amount: card.luckyAmount,
        icon: tokenInfo ? tokenInfo.find((w) => w.tokenSymbol === card.luckyToken)?.tokenIcon : ''
      })
    );
    return data.map((item, index) => {
      return (
        <div key={`lucky-prize-${index}`} className="flex flex-col items-center">
          <img src={imageLuckyPrize} width={112} height={111} />
          <div className="flex text-center text-2xl text-black">
            <img
              src={item.icon}
              width={19}
              height={19}
              className="mr-2 h-[19px] w-[19px] rounded-full"
            />
            <div className="truncate font-pd text-lg">{item.token}</div>
          </div>
          <div className="text-center font-micro text-5xl text-black">{item.amount}</div>
        </div>
      );
    });
  }, [tokenInfo, pickedCard]);

  return (
    <BitcowModal
      closable
      open={open}
      width="100%"
      bodyStyle={{ padding: 0 }}
      onCancel={() => onCancel()}>
      <div className="-mt-[100px] flex h-screen items-center justify-center">
        <div className="relative h-[391px] w-fit bg-[#FF8D00] px-24">
          <button className="absolute right-4 top-4 cursor-pointer text-black" onClick={onCancel}>
            <CloseIcon />
          </button>
          <div className="flex h-[391px] w-full flex-col items-center bg-[#FF8D00] py-6">
            <h3 className="mb-6 text-center font-micro text-4xl text-black">your prizes</h3>
            <div className="flex items-center justify-center">
              <div className="mb-1 flex gap-x-6">{content}</div>
            </div>
            <div className="mb-5 text-center font-micro text-lg text-white">
              {pickedCard.length > 1 ? 'are' : 'is'} on the way
            </div>
            <div className="text-center font-pd text-lg text-white">
              Check the transaction{' '}
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="text-black hover:text-black hover:underline">
                here
              </a>
            </div>
          </div>
        </div>
      </div>
    </BitcowModal>
  );
};

export default LuckyPrizeModal;
