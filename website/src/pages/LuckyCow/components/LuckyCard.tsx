import { useRef } from 'react';
import Card from 'components/Card';
import ScratchCard from './ScratchCard';
import imageScratchChest from 'resources/img/scratchChest.webp';
import imageScratchToken from 'resources/img/scratchToken.webp';
import imageScratchAmount from 'resources/img/scratchAmount.webp';
import imageLuckyToken from 'resources/img/luckyCardToken.webp';
import imageLuckyAmount from 'resources/img/luckyCardAmount.webp';
import imageLuckyTitle from 'resources/img/luckyCardTitle.webp';
import imageLuckyTop from 'resources/img/luckyCardBgTop.webp';
import imageLuckyLeft from 'resources/img/luckyCardBgLeft.webp';
import imageLuckyRight from 'resources/img/luckyCardBgRight.webp';
import cornerTopLeft from 'resources/img/cornerTopLeft.svg';
import cornerTopRight from 'resources/img/cornerTopRight.svg';
import cornerBottomLeft from 'resources/img/cornerBottomLeft.svg';
import cornerBottomRight from 'resources/img/cornerBottomRight.svg';
import imageNextTime from 'resources/img/nextTime.webp';
import imageJackpot from 'resources/img/jackpot.webp';
import { Image } from 'antd';
import styles from './LuckyCard.module.scss';
import { cn } from 'utils/cn';

interface TProps {
  disabled?: boolean;
  revealed?: boolean;
}

const LuckyCard: React.FC<TProps> = ({ disabled, revealed }) => {
  const cardRef = useRef<ScratchCard>(null);
  const finishPercent = 70;
  const fadeOutOnComplete = true;
  const brushSize = 10;

  const chestList = [1000, 1000, 0, 0];
  const tokenList = [
    'USDT',
    'USDT',
    'USDT',
    'USDT',
    'USDT',
    'USDT',
    'USDT',
    'USDT',
    'USDT',
    'USDT'
  ];
  const amountList = [20, 200, 20, 20, 20, 20, 20, 20, 200, 20];

  return (
    <Card className="dark-stroke-white table:w-full relative flex w-[414px] flex-col gap-y-9 bg-bc-swap bg-cover bg-no-repeat fill-color_text_1 stroke-none text-color_text_1 shadow-bc-swap backdrop-blur-[15px] dark:bg-color_bg_input tablet:w-full tablet:p-4 tablet:pt-5">
      <div className="relative h-[600px] w-[414px] border-[3px] border-black bg-[#FD8900]">
        <img
          src={imageLuckyTop}
          alt="loading"
          width={345}
          height={84}
          className="absolute top-[78px] left-1/2 -ml-[166px]"
        />
        <img src={imageLuckyLeft} width={138} height={132} className="absolute bottom-0 left-0" />
        <img src={imageLuckyRight} width={132} height={130} className="absolute bottom-0 right-0" />
        <div className="absolute flex h-full w-full flex-col">
          <div className="mb-[59px] flex justify-center">
            <Image src={imageLuckyTitle} width={342} height={94} />
          </div>
          <div className="flex justify-center gap-x-5">
            {chestList.map((value, index) => (
              <ScratchCard
                key={`scratch-chest-${index}`}
                ref={cardRef}
                width={70}
                height={57}
                image={imageScratchChest}
                brushSize={brushSize}
                disabled={disabled}
                revealed={revealed}
                fadeOutOnComplete={fadeOutOnComplete}
                finishPercent={finishPercent}
                onComplete={() => console.log('complete', index)}>
                <div className="flex h-full w-full items-center justify-center">
                  {value > 0 ? (
                    <Image src={imageJackpot} width={58} height={39} />
                  ) : (
                    <Image src={imageNextTime} width={51} height={34} />
                  )}
                </div>
              </ScratchCard>
            ))}
          </div>
          <div className="relative mx-3 my-3 flex flex-col justify-center bg-white/10 py-2">
            <div className="absolute top-0 left-0">
              <Image src={cornerTopLeft} width={16} height={16} />
            </div>
            <div className="absolute top-0 right-0">
              <Image src={cornerTopRight} width={16} height={16} />
            </div>
            <div className="absolute bottom-0 left-0 h-[16px]">
              <Image src={cornerBottomLeft} width={16} height={16} />
            </div>
            <div className="absolute bottom-0 right-0 h-[16px]">
              <Image src={cornerBottomRight} width={16} height={16} />
            </div>

            <div className="flex justify-center">
              <Image src={imageLuckyToken} width={103} height={36} />
            </div>
            <div className="mt-3 flex justify-center">
              <div className="grid w-[330px] grid-cols-5 gap-x-2 gap-y-1">
                {tokenList.map((value, index) => (
                  <ScratchCard
                    key={`scratch-token-${index}`}
                    ref={cardRef}
                    width={60}
                    height={26}
                    image={imageScratchToken}
                    brushSize={brushSize}
                    disabled={disabled}
                    revealed={revealed}
                    fadeOutOnComplete={fadeOutOnComplete}
                    finishPercent={finishPercent}
                    onComplete={() => console.log('complete', index)}>
                    <div className="flex h-full w-full items-center justify-center">
                      <Image src={'https://bitcow.xyz/images/bitusd.svg'} width={13} height={13} />
                      <div className="ml-1 h-[13px] text-sm leading-none">{value}</div>
                    </div>
                  </ScratchCard>
                ))}
              </div>
            </div>
            <div className="mt-3 flex justify-center text-center font-pd text-sm leading-none text-amber-900">
              The token that appears the most times
              <br /> will be the one you receive
            </div>
          </div>
          <div className="flex flex-col justify-center px-3">
            <div className="flex justify-center">
              <Image src={imageLuckyAmount} width={103} height={36} />
            </div>
            <div className="mt-3 flex justify-center">
              <div className="grid w-[302px] grid-cols-5 place-content-center gap-x-3 gap-y-1">
                {amountList.map((value, index) => (
                  <ScratchCard
                    key={`scratch-amount-${index}`}
                    ref={cardRef}
                    width={48}
                    height={45}
                    image={imageScratchAmount}
                    disabled={disabled}
                    revealed={revealed}
                    brushSize={brushSize}
                    fadeOutOnComplete={fadeOutOnComplete}
                    finishPercent={finishPercent}
                    onComplete={() => console.log('complete', index)}>
                    <div
                      className={cn(
                        styles.strokeText,
                        'flex justify-center font-pdb text-[22px] leading-none'
                      )}
                      data-storke={value}>
                      {value}
                    </div>
                  </ScratchCard>
                ))}
              </div>
            </div>
            <div className="mt-3 flex justify-center text-center font-pd text-sm leading-none text-amber-900">
              The largest number here will be the <br />
              token amount you receive
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LuckyCard;
