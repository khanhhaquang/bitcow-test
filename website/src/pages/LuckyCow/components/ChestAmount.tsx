import imageNextTime from 'resources/img/nextTime.svg';
// import imageChestAmount from 'resources/img/chestAmount.svg';
import { Image } from 'antd';
import { cn } from 'utils/cn';
import styles from './LuckyCard.module.scss';

interface TProps {
  amount: number;
}

const ChestAmount: React.FC<TProps> = ({ amount }) => {
  const value = '$' + amount;
  return (
    <div>
      {amount > 0 ? (
        <div
          className={cn(
            styles.doubleStrokeText,
            'flex justify-center font-pdb text-[12px] leading-none'
          )}
          data-storke={value}>
          {/* <Image src={imageChestAmount} width={39} height={43} /> */}
          {value}
        </div>
      ) : (
        <Image src={imageNextTime} width={51} height={34} />
      )}
    </div>
  );
};

export default ChestAmount;
