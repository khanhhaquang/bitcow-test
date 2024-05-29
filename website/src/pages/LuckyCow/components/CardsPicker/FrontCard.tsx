import classNames from 'classnames';
import { motion } from 'framer-motion';

import FrontCardImg from 'resources/img/lucky-draw/frontCard.jpeg';

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
}

const FrontCard = ({ zIndex, index, onSelectCard, status, marginRight }: FrontCardProps) => (
  <motion.div
    className={classNames(
      'h-[380px] w-[263px] rounded border-4 border-black bg-white bg-no-repeat hover:cursor-pointer',
      status === CardStatus.SELECTED && '!border-white'
    )}
    style={{
      zIndex,
      marginRight,
      boxShadow:
        '18px 18px 0px 0px rgba(0, 0, 0, 0.05), 12px 12px 0px 0px rgba(0, 0, 0, 0.10), 6px 6px 0px 0px rgba(0, 0, 0, 0.10)'
    }}
    initial={
      status === CardStatus.SELECTED && {
        transform: 'translateY(-40px)'
      }
    }
    whileHover={
      status === CardStatus.NOT_SELECT && {
        transform: 'translateY(-20px)',
        transition: {
          type: 'spring',
          bounce: 0.4,
          duration: 0.8
        }
      }
    }
    onClick={() => onSelectCard(index)}>
    <img src={FrontCardImg} className="h-full w-full hover:opacity-80" />
  </motion.div>
);

export default FrontCard;
