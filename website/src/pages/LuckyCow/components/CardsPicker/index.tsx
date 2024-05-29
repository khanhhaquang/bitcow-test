import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';

import ButtonBorder from 'resources/img/lucky-draw/buttonBorder.png';

import FrontCard, { CardStatus } from './FrontCard';

interface CardsPickerProps {
  numsOfCard: number;
  numsOfSelectedCard: number;
}
const CardsPicker = ({ numsOfCard, numsOfSelectedCard }: CardsPickerProps) => {
  const [cardsStatus, setCardsStatus] = useState<Array<CardStatus>>([]);
  const [cardMarginRight, setCardMarginRight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>();

  const onCalculateMarginRight = () => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const cardWidth = 263;
    const remainWidth = containerWidth - cardWidth; // remain width after first card;
    setCardMarginRight(remainWidth / (numsOfCard - 1) - cardWidth);
  };

  const currentSelected = cardsStatus.filter((status) => status === CardStatus.SELECTED);

  const isPickEnoughCards = useMemo(() => {
    if (numsOfSelectedCard === 0) return false;
    return currentSelected?.length === numsOfSelectedCard;
  }, [currentSelected, numsOfSelectedCard]);

  const onSelectCard = useCallback(
    (index) => {
      const newCard =
        cardsStatus[index] === CardStatus.SELECTED ? CardStatus.NOT_SELECT : CardStatus.SELECTED;

      if (newCard === CardStatus.SELECTED && isPickEnoughCards) return;

      const newCardStatus = [
        ...cardsStatus.slice(0, index),
        newCard,
        ...cardsStatus.slice(index + 1)
      ];
      setCardsStatus(newCardStatus);
    },
    [cardsStatus, isPickEnoughCards]
  );

  useEffect(() => {
    setCardsStatus(Array(numsOfCard).fill(CardStatus.NOT_SELECT));
  }, [numsOfCard]);

  useEffect(onCalculateMarginRight, [containerRef?.current?.clientWidth]);

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
          <FrontCard
            key={`${index}_${status}`}
            index={index}
            zIndex={numsOfCard - index}
            marginRight={cardMarginRight}
            onSelectCard={onSelectCard}
            status={status}
          />
        ))}
      </div>
      {isPickEnoughCards ? (
        <div className="z-20 -mt-[20px] border-y-4 border-x-4 border-black bg-color_yellow_1 px-20 py-3 font-micro text-2xl uppercase text-black">
          scratch them!
        </div>
      ) : (
        <div
          className="z-20 -mt-[20px] overflow-hidden rounded-xl border-4 bg-white px-28 py-3 font-pd text-2xl text-pink-950"
          style={{
            borderImage: `url(${ButtonBorder}) 16 / 2 / 1 round`
          }}>
          Pick {numsOfSelectedCard - currentSelected?.length} cards
        </div>
      )}
    </div>
  );
};

export default CardsPicker;
