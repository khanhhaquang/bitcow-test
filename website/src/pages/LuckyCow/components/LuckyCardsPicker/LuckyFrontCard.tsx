import { motion } from 'framer-motion';

import FrontCardImg from 'resources/img/luckyFrontCard.webp';
import { cn } from 'utils/cn';

export enum CardPickingStatus {
  NOT_SELECT,
  SELECTED
}

interface FrontCardProps {
  zIndex: number;
  index: number;
  onSelectCard: (index: number) => void;
  status: CardPickingStatus;
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
  const isSelected = status === CardPickingStatus.SELECTED;
  return (
    <motion.div
      className={cn(
        'relative h-[380px] w-[263px] rounded border-4 border-black bg-no-repeat hover:cursor-pointer',
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
      {!isSelected && <div className="absolute top-0 left-0 h-full w-full bg-black/20" />}
      <img
        src={FrontCardImg}
        className={cn('h-full w-full', (enableHover || isSelected) && 'hover:opacity-80')}
      />
    </motion.div>
  );
};

export default FrontCard;
