import Button from 'components/Button';
import { LeftArrowIcon, DocsIcon } from 'resources/icons';
// import TempImg from 'resources/img/landingPage/3dVideo.png';
// import Gif from 'resources/animation/gif1.gif';
// import Video from 'resources/animation/video.mp4';
import AptosLogo from 'resources/img/landingPage/aptos_logo.png';
import PythLogo from 'resources/img/landingPage/pyth_logo.png';
import GreenStarWith3lines from 'resources/img/landingPage/greenStarWith3lines.svg';
import StarWhite from 'resources/img/landingPage/starWhite.svg';
// import { SpriteAnimator } from 'react-sprite-animator';
import SpriteAnimator from 'react-responsive-spritesheet';
import SpriteSheet from 'resources/img/landingPage/spritesheet.png';
import LazyShow from './components/LazyShow';
// import Lottie from 'lottie-react';
// import animation from 'resources/animation/3dAnimation.json';

const MainSection = () => {
  const renderTradeStats = () => {
    return (
      <div className="flex text-gray_05 font-Rany mt-[274px] laptop:flex-col laptop:mt-0 laptop:gap-2">
        <div className="flex flex-col laptop:bg-gray_008 laptop:w-full laptop:py-4 laptop:flex-col-reverse laptop:gap-2">
          <div className="flex gap-2 laptop:justify-center">
            <div className="text-lg laptop:text-sm">24 Hour Trading Volume</div>
            <div className="text-color_main text-sm px-2 py-1 bg-black font-Furore laptop:text-xs">
              1.88%
            </div>
          </div>
          <div className="flex items-center gap-4 laptop:justify-center">
            <div className="font-Furore text-2xl text-white laptop:text-2xl">$625,026,328</div>
            <LeftArrowIcon className="fill-color_main -rotate-45" />
          </div>
        </div>
        <hr className="w-[1px] h-[60px] bg-gray_05 mx-6 border-0 block laptop:hidden" />
        <div className="flex flex-col laptop:bg-gray_008 laptop:w-full laptop:py-4 laptop:flex-col-reverse laptop:gap-2">
          <div className="flex gap-2 laptop:justify-center">
            <div className="text-lg laptop:text-sm">24 Hour Trading Volume</div>
            <div className="text-color_minor text-sm px-2 py-1 bg-black font-Furore laptop:text-xs">
              1.88%
            </div>
          </div>
          <div className="flex items-center gap-4 laptop:justify-center">
            <div className="font-Furore text-2xl text-white laptop:text-2xl">$625,026,328</div>
            <LeftArrowIcon className="fill-color_minor rotate-45" />
          </div>
        </div>
      </div>
    );
  };

  const renderPoweredBy = () => (
    <div className="text-gray_05 flex items-center mt-[84px] laptop:mt-16 laptop:justify-center laptop:mb-5">
      <div className="flex gap-2">
        Built on <img width={62} height={20} src={AptosLogo} alt="aptos" />
      </div>
      <hr className="w-[1px] h-[12px] bg-gray_05 mx-2 border-0" />
      <div className="flex gap-2">
        Powered by <img width={62} height={20} src={PythLogo} alt="pyth" />
      </div>
    </div>
  );

  return (
    <div className="flex gap-12 pt-[126px] px-20 justify-between bg-main bg-cover bg-no-repeat bg-center laptop:flex-col laptop:px-4 laptop:justify-center laptop:text-center laptop:gap-0">
      <div className="absolute top-[110px] right-[309px] desktop:block laptop:hidden">
        <img src={StarWhite} alt="" />
      </div>
      <div className="w-1/3 laptop:w-full grow relative pt-[140px] pb-16 laptop:pt-16 laptop:pb-8">
        <div className="absolute -top-4 -right-[84px] desktop:block laptop:hidden">
          <img src={GreenStarWith3lines} alt="" />
        </div>
        <hr className="border-0 w-[1px] h-full absolute top-0 right-0 bg-gray_02 desktop:block laptop:hidden" />
        <LazyShow>
          <div className="text-4xl laptop:text-2xl text-white font-Furore uppercase leading-[60px]">
            PROACTIVE LIQUIDITY <br /> MATTERS
          </div>
          <div className="text-lg text-gray_05 mt-8 laptop:text-sm">
            Proactive AMMS with your Single-token liquity
          </div>
          <div className="flex gap-6 mt-16 laptop:gap-4">
            <Button className="bg-launch_btn py-[18px] px-6 laptop:grow text-black font-Furore text-base rounded-none gap-2 hover:opacity-90 laptop:text-sm laptop:py-[14px]">
              LAUNCH APP
              <LeftArrowIcon className="laptop:w-[18px] laptop:h-[18px]" />
            </Button>
            <Button className="border-[1px] py-[18px] px-6 laptop:grow border-color_main text-color_main font-Furore text-base rounded-none gap-2 hover:bg-gray_02 laptop:text-sm laptop:py-[14px]">
              READ DOCS
              <DocsIcon className="laptop:w-[18px] laptop:h-[18px]" />
            </Button>
          </div>
          <div className="block laptop:hidden">
            {renderTradeStats()}
            {renderPoweredBy()}
          </div>
        </LazyShow>
      </div>
      <div className="w-1/3 laptop:w-full grow pt-[140px] laptop:pt-0">
        {/* <Lottie className="w-full h-full" animationData={animation} /> */}
        {/* <video
          className="w-full h-full"
          src="/video/animation.mp4"
          autoPlay={true}
          loop={true}
          playsInline
          muted
          preload="auto"
        /> */}
        {/* <img
          className="w-full h-full object-contain object-top hidden laptop:block"
          src={TempImg}
          alt=""
        /> */}
        {/* <SpriteAnimator
          className="block laptop:hidden"
          sprite={SpriteSheet}
          width={800}
          height={800}
          frameCount={182}
          wrapAfter={6}
          direction="horizontal"
          fps={60}
        /> */}
        <SpriteAnimator
          // className="block laptop:hidden"
          image={SpriteSheet}
          widthFrame={800}
          heightFrame={800}
          steps={91}
          fps={60}
          autoplay
          loop
        />
      </div>
      <div className="hidden laptop:block">
        {renderTradeStats()}
        {renderPoweredBy()}
      </div>
    </div>
  );
};

export default MainSection;
