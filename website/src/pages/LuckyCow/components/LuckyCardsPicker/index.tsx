import { useCallback, useEffect, useState, useRef, useMemo } from 'react';

import PixelButton from 'components/PixelButton';
import { LuckyCardPickingBorderInner, LuckyCardPickingBorderOuter } from 'resources/icons';

import LuckyFrontCard, { CardPickingStatus } from './LuckyFrontCard';

interface CardsPickerProps {
  numsOfCard: number;
  numsOfSelectedCard: number;
  onStartScratching: () => void;
}

const CardsPicker = ({ numsOfCard, numsOfSelectedCard, onStartScratching }: CardsPickerProps) => {
  const [cardsStatus, setCardsStatus] = useState<Array<CardPickingStatus>>([]);
  const [cardMarginRight, setCardMarginRight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>();

  const onCalculateMarginRight = () => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const cardWidth = 263;
    const remainWidth = containerWidth - cardWidth; // remain width after first card;
    setCardMarginRight(remainWidth / (numsOfCard - 1) - cardWidth);
  };

  const currentSelected = cardsStatus.filter((status) => status === CardPickingStatus.SELECTED);

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

  useEffect(() => {
    setCardsStatus(Array(numsOfCard).fill(CardPickingStatus.NOT_SELECT));
  }, [numsOfCard]);

  useEffect(onCalculateMarginRight, [containerRef?.current?.clientWidth, numsOfCard]);

  useEffect(() => {
    window.addEventListener('resize', onCalculateMarginRight);
    return () => {
      window.removeEventListener('resize', onCalculateMarginRight);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex w-[80vw]" ref={containerRef}>
        {cardsStatus.map((status, index) => (
          <LuckyFrontCard
            key={`${index}_${status}`}
            index={index}
            zIndex={numsOfCard - index}
            marginRight={cardMarginRight}
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
          onClick={onStartScratching}
          className="mt-4 flex items-center justify-center bg-color_yellow_1 p-4 font-micro text-2xl uppercase text-black">
          scratch them!
        </PixelButton>
      ) : (
        <div className="relative z-20 -mt-[30px] flex h-[77px] w-[407px] items-center justify-center bg-white bg-clip-content p-1 font-pd text-2xl text-pink_950">
          <LuckyCardPickingBorderOuter className="absolute" />
          <LuckyCardPickingBorderInner className="absolute" />
          <span>Pick {numsOfSelectedCard - currentSelected?.length} cards </span>
        </div>
      )}
    </div>
  );
};

export default CardsPicker;
