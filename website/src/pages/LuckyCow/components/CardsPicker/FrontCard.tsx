import { motion } from 'framer-motion';

import FrontCardImg from 'resources/img/lucky-draw/frontCard.jpeg';
import { cn } from 'utils/cn';

export enum CardStatus {
  NOT_SELECT,
  SELECTED
}

interface FrontCardProps {
  zIndex: number;
  index: number;
  onSelectCard: (index: number) => void;
  status: CardStatus;
  marginRight: number;
  enableHover: boolean;
}

const FrontCard = ({
  zIndex,
  index,
  onSelectCard,
  status,
  marginRight,
  enableHover
}: FrontCardProps) => {
  const isSelected = status === CardStatus.SELECTED;
  return (
    <motion.div
      className={cn(
        'h-[380px] w-[263px] rounded border-4 border-black bg-white bg-no-repeat hover:cursor-pointer',
        isSelected && '!border-white'
      )}
      style={{
        zIndex,
        marginRight, // used for collapse item
        boxShadow:
          '18px 18px 0px 0px rgba(0, 0, 0, 0.05), 12px 12px 0px 0px rgba(0, 0, 0, 0.10), 6px 6px 0px 0px rgba(0, 0, 0, 0.10)'
      }}
      initial={
        isSelected && {
          transform: 'translateY(-40px)'
        }
      }
      whileHover={
        enableHover && {
          transform: 'translateY(-20px)',
          transition: {
            type: 'spring',
            bounce: 0.4,
            duration: 0.8
          }
        }
      }
      drag={false}
      onClick={() => onSelectCard(index)}>
      <img
        src={FrontCardImg}
        className={cn('h-full w-full', (enableHover || isSelected) && 'hover:opacity-80')}
      />
    </motion.div>
  );
};

export default FrontCard;
