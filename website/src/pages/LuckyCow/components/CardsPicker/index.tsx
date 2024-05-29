import { useCallback, useEffect, useState, useRef, useMemo } from 'react';

import Button from 'components/Button';
import PixelButton from 'components/PixelButton';

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
      <div className="z-20 -mt-[20px]">
        {isPickEnoughCards ? (
          <PixelButton width={286} height={38} borderWidth={4} color="#000000">
            <Button className="flex h-[30px] w-[278px] items-center justify-center bg-color_yellow_1 font-micro text-2xl uppercase text-black">
              scratch them!
            </Button>
          </PixelButton>
        ) : (
          <PixelButton width={407} height={77} borderWidth={4} color="#6B001E">
            <PixelButton width={399} height={69} borderWidth={4} color="#FFB500">
              <Button className="flex h-[61px] w-[391px] items-center justify-center bg-white font-pd text-2xl text-pink-950">
                Pick {numsOfSelectedCard - currentSelected?.length} cards
              </Button>
            </PixelButton>
          </PixelButton>
        )}
      </div>
    </div>
  );
};

export default CardsPicker;
