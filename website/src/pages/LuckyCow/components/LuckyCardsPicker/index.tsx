import { useCallback, useEffect, useState, useRef, useMemo } from 'react';

import PixelButton from 'components/PixelButton';
import { LuckyCardPickingBorderInner, LuckyCardPickingBorderOuter } from 'resources/icons';

import LuckyFrontCard, { CardPickingStatus } from './LuckyFrontCard';
import { LuckyDrawService } from 'services/luckyDraw';
import useUserInfo from 'hooks/useUserInfo';
// import { useDispatch } from 'react-redux';
// import luckyCowAction from 'modules/luckyCow/actions';
// import { ILuckyAward } from 'pages/LuckyCow/types';
// import useTokenAwardInfo from 'hooks/useTokenAwardInfo';

interface CardsPickerProps {
  numsOfCard: number;
  numsOfSelectedCard: number;
  onStartScratching: () => void;
}

const LuckyCardPickers = ({
  numsOfCard,
  numsOfSelectedCard,
  onStartScratching
}: CardsPickerProps) => {
  const [cardsStatus, setCardsStatus] = useState<Array<CardPickingStatus>>(
    Array(numsOfCard).fill(CardPickingStatus.NOT_SELECT)
  );
  const [cardMarginRight, setCardMarginRight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>();
  const { data: userInfo } = useUserInfo();
  // const { data: tokenInfo } = useTokenAwardInfo();
  // const dispatch = useDispatch();

  const onCalculateMarginRight = () => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const CARD_WIDTH = 263;
    const remainWidth = containerWidth - CARD_WIDTH; // remain width after first card;
    setCardMarginRight(remainWidth / (numsOfCard - 1) - CARD_WIDTH);
  };

  const currentSelected = useMemo(
    () => cardsStatus.filter((status) => status === CardPickingStatus.SELECTED) || [],
    [cardsStatus]
  );

  const isPickEnoughCards = useMemo(() => {
    if (numsOfSelectedCard === 0) return false;
    return currentSelected?.length === numsOfSelectedCard;
  }, [currentSelected, numsOfSelectedCard]);

  const onSelectCard = useCallback(
    (index) => {
      const newCard =
        cardsStatus[index] === CardPickingStatus.SELECTED
          ? CardPickingStatus.NOT_SELECT
          : CardPickingStatus.SELECTED;

      if (newCard === CardPickingStatus.SELECTED && isPickEnoughCards) return;

      const newCardPickingStatus = [
        ...cardsStatus.slice(0, index),
        newCard,
        ...cardsStatus.slice(index + 1)
      ];
      setCardsStatus(newCardPickingStatus);
    },
    [cardsStatus, isPickEnoughCards]
  );

  const onSubmitPickCard = async () => {
    const selectedIndex = cardsStatus.reduce(function (acc, curr, index) {
      if (curr === CardPickingStatus.SELECTED) {
        acc.push(index);
      }
      return acc;
    }, []);

    const result = await LuckyDrawService.pickCard.call(userInfo?.orderID, selectedIndex);
    console.log(userInfo.orderID);
    // const result = await pickCard(selectedIndex);
    if (result.code === 0) {
      // let pickedCard: ILuckyCardInfo[] = [];
      // let luckyAward: ILuckyAward[] = [];
      // Object.keys(result.data).forEach((key) => {
      //   if (key != 'orderID') {
      //     const card: ILuckyCardInfo = result.data[key] as ILuckyCardInfo;
      //     pickedCard.push(card);
      //   }
      // });
      // pickedCard.map((card) =>
      //   luckyAward.push({
      //     token: card.luckyToken,
      //     amount: card.luckyAmount,
      //     icon: tokenInfo.find((w) => w.tokenSymbol === card.luckyToken)?.tokenIcon
      //   })
      // );
      // console.log('pickedCard', pickedCard);
      // dispatch(luckyCowAction.SET_PICKED_CARD(pickedCard));
      // dispatch(luckyCowAction.SET_LUCKY_AWARD(luckyAward));
      onStartScratching();
    }
  };

  useEffect(onCalculateMarginRight, []);

  useEffect(() => {
    window.addEventListener('resize', onCalculateMarginRight);
    return () => {
      window.removeEventListener('resize', onCalculateMarginRight);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex w-[80vw] justify-center" ref={containerRef}>
        {cardsStatus.map((status, index) => (
          <LuckyFrontCard
            index={index}
            key={`${index}_${status}`}
            zIndex={numsOfCard - index}
            marginRight={index === cardsStatus.length - 1 ? 0 : cardMarginRight}
            onSelectCard={onSelectCard}
            status={status}
            enableHover={status === CardPickingStatus.NOT_SELECT && !isPickEnoughCards}
          />
        ))}
      </div>
      {isPickEnoughCards ? (
        <PixelButton
          width={286}
          height={38}
          borderWidth={4}
          color="#000000"
          onClick={onSubmitPickCard}
          className="mt-4 flex items-center justify-center bg-color_yellow_1 p-4 font-micro text-2xl uppercase text-black hover:!bg-[#FFC700] hover:!bg-lucky-redeem-btn-hover active:!bg-[#FFA800] active:!text-black">
          scratch them!
        </PixelButton>
      ) : (
        <div className="relative z-20 -mt-[30px] flex h-[77px] w-[407px] items-center justify-center bg-white bg-clip-content p-1 font-pd text-2xl text-pink_950">
          <LuckyCardPickingBorderOuter className="absolute" />
          <LuckyCardPickingBorderInner className="absolute" />
          <span>Pick {numsOfSelectedCard - currentSelected.length} cards</span>
        </div>
      )}
    </div>
  );
};

export default LuckyCardPickers;
