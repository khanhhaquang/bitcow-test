import { Image } from 'antd';
import { FC, ReactNode, useState } from 'react';

import PixelButton from 'components/PixelButton';
import {
  CounterUpIcon,
  CounterDownIcon,
  LuckyRedeemBorderInnerIcon,
  LuckyRedeemBorderOuterIcon,
  LuckyCardsCounterIcon,
  LuckyBuyBtnIcon,
  BitUsdIcon
} from 'resources/icons';
import useLuckyCard from 'hooks/useLuckyCard';
import useMerlinWallet from 'hooks/useMerlinWallet';
import {
  openTxErrorNotification,
  openTxPendingNotification,
  openTxSuccessNotification
} from 'utils/notifications';
import useNetwork from 'hooks/useNetwork';
import useLuckyShop from 'hooks/useLuckyShop';
import { LuckyDrawService } from 'services/luckyDraw';
import useUserInfo from 'hooks/useUserInfo';

type LuckyShopProps = {
  children?: ReactNode;
  text?: ReactNode;
};

const LuckyShopWrapper: FC<LuckyShopProps> = ({ children, text }) => {
  return (
    <div className="relative flex flex-col items-center">
      <Image
        src="/images/luckyDraw/lucky-shop.webp"
        alt="shop"
        width={471}
        height={499}
        preview={false}
      />
      <div className="absolute -right-[180px] top-[176px]">
        <Image
          src="/images/luckyDraw/lucky-text-bubble.webp"
          alt="text bubble"
          width={305}
          height={171}
          preview={false}
        />
        <p className="absolute top-6 w-full pl-8 pr-6 font-pd text-2xl leading-none text-black">
          {text}
        </p>
      </div>
      {children}
    </div>
  );
};

const Redeem: FC<{ onClickRedeem: () => void }> = ({ onClickRedeem }) => {
  const { walletAddress } = useMerlinWallet();
  const { refetch: refetchUserInfo } = useUserInfo();
  const handleRedeem = async () => {
    try {
      const result = await LuckyDrawService.freePlayGame.call(walletAddress);
      // console.log('handleRedeem', result.data.orderID);
      if (result.code === 0) {
        await refetchUserInfo();
        // console.log('refetchUserInfo', data.data.orderID);
        onClickRedeem();
      }
    } catch (e) {
      console.log('🚀 ~ Check lucky code error:', e);
    }
  };

  return (
    <LuckyShopWrapper text="Wise choice!  Good luck and win some juicy prizes!">
      <div className="absolute top-[440px]">
        <div className="relative flex h-[171px] w-[407px] items-center justify-center overflow-hidden p-2">
          <LuckyRedeemBorderOuterIcon className="absolute inset-0" />
          <LuckyRedeemBorderInnerIcon className="absolute inset-1" />
          <div className="flex h-full w-full flex-col items-center gap-y-8 bg-white py-[18px]">
            <h3 className="w-[266px] text-center font-pd text-2xl leading-none text-[#6B001E]">
              Your <b className="font-pdb text-[#FF8D00]">LUCKY COW lottery card</b> is ready
            </h3>
            <PixelButton
              onClick={handleRedeem}
              width={286}
              height={38}
              color="#000"
              className="bg-[#FFC700] text-2xl text-black hover:!bg-[#FFC700] hover:!bg-lucky-redeem-btn-hover active:!bg-[#FFA800] active:!text-black">
              Redeem now
            </PixelButton>
          </div>
        </div>
      </div>
    </LuckyShopWrapper>
  );
};

const Buy: FC<{
  numberOfCards: number;
  onBuyCallback: (hash: string) => void;
  onClickRedeemCode: () => void;
}> = ({ onClickRedeemCode, onBuyCallback, numberOfCards }) => {
  const { data: luckyCard } = useLuckyCard();
  const { allowance, isIncreasingAllowance, isPurchasing, purchase, increaseAllowance } =
    useLuckyShop();
  const { bitcowSDK, checkTransactionError } = useMerlinWallet();
  const { currentNetwork } = useNetwork();

  const [cardsAmount, setCardsAmount] = useState(1);

  const isProcessing = isIncreasingAllowance || isPurchasing;

  const cardPrice = luckyCard?.price || 0;
  const totalPrice = cardsAmount * cardPrice;

  const handleChangeAmount = (nextValue: number) => {
    if (cardsAmount <= 1 && nextValue < cardsAmount) return;
    if (cardsAmount === numberOfCards && nextValue > cardsAmount) return;

    setCardsAmount(nextValue);
  };

  const handlePurchase = async () => {
    try {
      const result = await purchase({ amount: cardsAmount });
      if (result.status === 1) {
        openTxSuccessNotification(
          currentNetwork.chainConfig.blockExplorerUrls[0],
          result.hash,
          'Buy cards successfully'
        );
        onBuyCallback(result.hash);
      } else if (result.status === 0) {
        openTxErrorNotification(
          currentNetwork.chainConfig.blockExplorerUrls[0],
          result.hash,
          'Failed to buy'
        );
      }
    } catch (e) {
      checkTransactionError(e);
    }
  };

  const handleIncreaseAllowance = async () => {
    try {
      openTxPendingNotification('Increasing allowance');
      const increaseResult = await increaseAllowance({ amount: totalPrice });

      if (increaseResult.status === 1) {
        openTxSuccessNotification(
          currentNetwork.chainConfig.blockExplorerUrls[0],
          increaseResult.hash,
          'Increased allowance successfully'
        );
        handlePurchase();
      } else if (increaseResult.status === 0) {
        openTxErrorNotification(
          currentNetwork.chainConfig.blockExplorerUrls[0],
          increaseResult.hash,
          'Failed to increase'
        );
      }
    } catch (e) {
      checkTransactionError(e);
    }
  };

  const handleClickBuy = async () => {
    if (bitcowSDK) {
      if (allowance < totalPrice) {
        handleIncreaseAllowance();
        return;
      }
      handlePurchase();
    }
  };

  return (
    <LuckyShopWrapper
      text={
        <>
          Welcome degen! Ready to win big?{' '}
          <b className="font-pdb text-[#FF8D00]">$10,000 jackpot</b> awaits!
        </>
      }>
      <div className="absolute top-[440px]">
        <div className="relative flex h-[211px] w-[407px] items-center justify-center overflow-hidden p-2">
          <LuckyRedeemBorderOuterIcon className="absolute inset-0 h-full" />
          <LuckyRedeemBorderInnerIcon className="absolute inset-1 h-[calc(100%_-_8px)]" />
          <div className="flex h-full w-full flex-col items-center bg-white pt-5">
            <h3 className="text-center font-pd text-2xl leading-none text-[#6B001E]">
              Get some <br />
              <b className="font-pdb text-[#FF8D00]">LUCKY COW lottery card?</b>
            </h3>

            <div className="mt-5 flex justify-center gap-x-6">
              {isProcessing ? (
                <span className="font-pdb text-2xl text-[#FF8D00]">Processing...</span>
              ) : (
                <>
                  <div className="relative flex h-15 min-w-[101px] overflow-hidden p-1.5">
                    <LuckyCardsCounterIcon className="absolute inset-0 w-full" />
                    <p className="relative flex h-full flex-1 shrink-0 items-center justify-center bg-transparent pt-1 font-pdb text-[48px] text-[#6B001E] [text-shadow:_2px_2px_0px_rgba(0,0,0,0.13)]">
                      {cardsAmount}
                    </p>
                    <div className="relative flex h-full w-7 shrink-0 flex-col justify-between border-l-[3px] border-[#FF6B00] bg-[#FF6B00]">
                      <button
                        onClick={() => handleChangeAmount(cardsAmount + 1)}
                        className="flex h-[22px] items-center justify-center bg-[#FF8D00] text-[#6B001E] hover:bg-[#FFC276]">
                        <CounterUpIcon />
                      </button>
                      <button
                        onClick={() => handleChangeAmount(cardsAmount - 1)}
                        className="flex h-[22px] items-center justify-center bg-[#FF8D00] text-[#6B001E] hover:bg-[#FFC276]">
                        <CounterDownIcon />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleClickBuy()}
                    className="group relative flex h-15 min-w-[162px] items-center overflow-hidden p-1.5">
                    <LuckyBuyBtnIcon className="absolute inset-0 w-full text-[#FF8D00] group-hover:text-[#FFC276] group-active:text-[#E85E00]" />
                    <p className="relative flex flex-1 items-center justify-center gap-x-1 font-pdb text-[48px] text-[#6B001E] [text-shadow:_2px_2px_0px_rgba(0,0,0,0.13)]">
                      <BitUsdIcon />
                      <span className="flex items-baseline pt-2">
                        {totalPrice}
                        <small className="text-sm">bitUSD</small>
                      </span>
                    </p>
                  </button>
                </>
              )}
            </div>

            <a
              className="relative mt-3 font-pd text-lg text-[#FF8D00] underline hover:text-[#FF8D00] hover:underline"
              href={undefined}
              onClick={() => {
                onClickRedeemCode();
              }}>
              I have a redeem code
            </a>
          </div>
        </div>
      </div>
    </LuckyShopWrapper>
  );
};

const NotConnected: FC = () => {
  return <LuckyShopWrapper text="Connect wallet to proceed..." />;
};

export { Redeem, Buy, NotConnected };
