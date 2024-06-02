import BitcowModal from 'components/BitcowModal';
import { FC, useMemo } from 'react';
import { CloseIcon } from 'resources/icons';
import imageLuckyPrize from 'resources/img/luckyPrize.webp';
import { useSelector } from 'react-redux';
import { getClaimHash } from 'modules/luckyCow/reducer';
import useNetwork from 'hooks/useNetwork';
import useUserInfo from 'hooks/useUserInfo';
import { ILuckyCardInfo } from 'services/luckyDraw';
import { ILuckyAward } from '../types';
import useTokenAwardInfo from 'hooks/useTokenAwardInfo';

type LuckyPrizeModalProps = {
  open: boolean;
  onCancel: () => void;
};

const LuckyPrizeModal: FC<LuckyPrizeModalProps> = ({ open, onCancel }) => {
  const { currentNetwork } = useNetwork();
  const { data: userInfo } = useUserInfo();
  const { data: tokenInfo } = useTokenAwardInfo();
  // const data = useSelector(getLuckyAward);

  // data.map((item, index) => {
  //   return (
  //     <div key={`lucky-prize-${index}`} className="flex flex-col items-center">
  //       <img src={imageLuckyPrize} width={112} height={111} />
  //       <div className="flex text-center text-2xl text-black">
  //         <img
  //           src={item.icon}
  //           width={19}
  //           height={19}
  //           className="mr-2 h-[19px] w-[19px] rounded-full"
  //         />
  //         <div className="truncate font-pd text-lg">{item.token}</div>
  //       </div>
  //       <div className="text-center font-micro text-5xl text-black">{item.amount}</div>
  //     </div>
  //   );
  // })
  const content = useMemo(() => {
    let pickedCard: ILuckyCardInfo[] = [];
    let data: ILuckyAward[] = [];
    if (!userInfo || !userInfo.pickCard) {
      return <></>;
    }
    Object.keys(userInfo.pickCard).forEach((key) => {
      if (key != 'orderID') {
        const card: ILuckyCardInfo = userInfo.pickCard[key] as ILuckyCardInfo;
        pickedCard.push(card);
      }
    });
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
  }, [userInfo, tokenInfo]);
  const claimHash = useSelector(getClaimHash);
  const link = `${currentNetwork.chainConfig.blockExplorerUrls[0]}/tx/${claimHash}`;
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
          <div className="mb-1 flex gap-x-6">{content}</div>
        </div>
        <div className="mb-5 text-center font-micro text-lg text-white">are on the way</div>
        <div className="text-center font-pd text-lg text-white">
          Check the transaction{' '}
          <a href={link} target="_blank" rel="noreferrer" className="hover:underline">
            here
          </a>
        </div>
      </div>
    </BitcowModal>
  );
};

export default LuckyPrizeModal;
