import { Image } from 'antd';
import PixelButton from 'components/PixelButton';
import { FC, ReactNode } from 'react';
import { LuckyRedeemBorderInnerIcon, LuckyRedeemBorderOuterIcon } from 'resources/icons';

type LuckyShopProps = {
  children?: ReactNode;
  text?: string;
};

const LuckyShopWrapper: FC<LuckyShopProps> = ({ children, text }) => {
  return (
    <div className="relative mb-20 flex flex-col items-center">
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

const Redeem: FC = () => {
  return (
    <LuckyShopWrapper text="Wise choice!  Good luck and win some juicy prizes!">
      <div className="absolute -bottom-[130px]">
        <div className="relative h-[171px] w-[407px] overflow-hidden p-1">
          <LuckyRedeemBorderOuterIcon className="absolute inset-0" />
          <LuckyRedeemBorderInnerIcon className="absolute inset-1" />
          <div className="flex w-full flex-col items-center gap-y-8 bg-white py-[18px]">
            <h3 className="w-[266px] text-center font-pd text-2xl leading-none text-[#6B001E]">
              Your <b className="font-pgb text-[#FF8D00]">LUCKY COW lottery card</b> is ready
            </h3>
            <PixelButton width={286} height={38} color="#000" className="bg-[#FFC700] text-black">
              Redeem now
            </PixelButton>
          </div>
        </div>
      </div>
    </LuckyShopWrapper>
  );
};

export { Redeem };
