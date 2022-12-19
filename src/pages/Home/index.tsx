import { Fragment } from 'react';
import SpriteAnimator from 'react-responsive-spritesheet';
import { NavLink } from 'react-router-dom';

import { Theme } from 'contexts/GlobalSettingProvider';
import useGlobalSetting from 'hooks/useGlobalSetting';
import { LeftArrowIcon, DocsIcon } from 'resources/icons';
import AptosLogo from 'resources/img/landingPage/aptos_logo.png';
import AptosLogoWhite from 'resources/img/landingPage/aptos_logo_white.png';
import ObricRedStartWith3lines from 'resources/img/landingPage/obricRedStartWith3lines.svg';
import OrangeStarWith3lines from 'resources/img/landingPage/orangeStarWith3lines.svg';
import PythLogo from 'resources/img/landingPage/pyth_logo.png';
import PythLogoWhite from 'resources/img/landingPage/pyth_logo_white.png';
import SpriteSheetDark from 'resources/img/landingPage/spritesheetDark.png';
import SpriteSheetWhite from 'resources/img/landingPage/spritesheetWhite.png';

import LazyShow from './components/LazyShow';

const Home = () => {
  const { theme } = useGlobalSetting();
  const renderTradeStats = () => {
    return (
      <div className="mt-[270px] flex font-Rany text-color_text_2 tablet:mt-0 tablet:flex-col tablet:gap-2">
        <div className="flex flex-col tablet:w-full tablet:flex-col-reverse tablet:gap-2 tablet:bg-gray_008 tablet:py-4">
          <div className="flex gap-2 tablet:justify-center">
            <div className="text-lg font-light tablet:text-sm">24 Hour Trading Volume</div>
            <div className="bg-color_bg_hover px-2 py-1 font-Furore text-sm text-color_minor tablet:text-xs">
              1.88%
            </div>
          </div>
          <div className="flex items-center gap-4 tablet:justify-center">
            <div className="font-Furore text-2xl text-color_text_1 tablet:text-2xl">
              $625,026,328
            </div>
            <LeftArrowIcon className="-rotate-45 fill-color_minor" />
          </div>
        </div>
        <hr className="mx-6 block h-[60px] w-[1px] border-0 bg-color_disabled tablet:hidden" />
        <div className="flex flex-col tablet:w-full tablet:flex-col-reverse tablet:gap-2 tablet:bg-gray_008 tablet:py-4">
          <div className="flex gap-2 tablet:justify-center">
            <div className="text-lg font-light tablet:text-sm">24 Hour Trading Volume</div>
            <div className="bg-color_bg_hover px-2 py-1 font-Furore text-sm text-color_main tablet:text-xs">
              1.88%
            </div>
          </div>
          <div className="flex items-center gap-4 tablet:justify-center">
            <div className="font-Furore text-2xl text-color_text_1 tablet:text-2xl">
              $625,026,328
            </div>
            <LeftArrowIcon className="rotate-45 fill-color_main" />
          </div>
        </div>
      </div>
    );
  };

  const renderPoweredBy = () => (
    <div className="mt-[84px] flex items-center text-color_text_2 tablet:mt-16 tablet:mb-5 tablet:justify-center">
      <div className="flex gap-2">
        Built on{' '}
        <img
          width={62}
          height={20}
          src={theme === Theme.Dark ? AptosLogo : AptosLogoWhite}
          alt="aptos"
        />
      </div>
      <hr className="mx-2 h-[12px] w-[1px] border-0 bg-color_disabled" />
      <div className="flex gap-2">
        Powered by{' '}
        <img
          width={62}
          height={20}
          src={theme === Theme.Dark ? PythLogo : PythLogoWhite}
          alt="pyth"
        />
      </div>
    </div>
  );

  return (
    <Fragment>
      <hr className="absolute left-0 top-[126px] block w-full border-color_border tablet:hidden" />
      <div className="flex justify-between gap-12 bg-cover bg-center bg-no-repeat px-20 pt-[126px] tablet:flex-col tablet:justify-center tablet:gap-0 tablet:px-4 tablet:pb-20 tablet:pt-16 tablet:text-center">
        {/* <div className="absolute top-[110px] right-[309px] desktop:block tablet:hidden">
          <StarWhiteIcon className="z-10 fill-color_main dark:fill-[#D9D9D9]" />
        </div> */}
        <div className="relative w-1/3 grow pt-[140px] pb-16 tablet:w-full tablet:pt-[60px] tablet:pb-8">
          <div className="absolute -top-4 -right-[84px] z-10 desktop:block tablet:hidden">
            <img src={OrangeStarWith3lines} alt="" className="hidden dark:block" />
            <img src={ObricRedStartWith3lines} alt="" className="block dark:hidden" />
          </div>
          <hr className="absolute top-0 right-0 h-full w-[1px] border-0 bg-color_border desktop:block tablet:hidden" />
          <LazyShow>
            <div className="font-Furore text-5xl uppercase leading-[60px] text-color_text_1 tablet:text-2xl tablet:leading-7">
              SMART LIQUIDITY <br /> MATTERS
            </div>
            <div className="mt-8 text-lg text-color_text_2 tablet:mt-4 tablet:text-sm">
              Proactive AMMS with your Single-token liquity
            </div>
            <div className="mt-16 flex gap-6 tablet:mt-8 tablet:gap-4">
              <NavLink
                to="swap"
                className="flex items-center gap-2 rounded-none bg-color_main py-[18px] px-6 font-Furore text-base leading-4 text-white hover:text-white hover:opacity-90 tablet:grow tablet:py-[14px] tablet:px-5 tablet:text-sm tablet:leading-3">
                LAUNCH APP
                <LeftArrowIcon className="fill-white tablet:h-[18px] tablet:w-[18px]" />
              </NavLink>
              <NavLink
                to="swap"
                className="flex items-center gap-2 rounded-none border-[1px] border-color_main py-[18px] px-6 font-Furore text-base text-color_main hover:bg-gray_02 hover:text-color_main tablet:grow tablet:px-5 tablet:py-[14px] tablet:text-sm tablet:leading-3">
                READ DOCS
                <DocsIcon className="fill-color_main tablet:h-[18px] tablet:w-[18px]" />
              </NavLink>
            </div>
            <div className="block tablet:hidden">
              {renderTradeStats()}
              {renderPoweredBy()}
            </div>
          </LazyShow>
        </div>
        <div className="w-1/3 grow pt-[140px] tablet:w-full tablet:pt-0">
          <SpriteAnimator
            image={theme === Theme.Dark ? SpriteSheetDark : SpriteSheetWhite}
            widthFrame={800}
            heightFrame={800}
            steps={theme === Theme.Dark ? 91 : 92}
            fps={60}
            autoplay
            loop
          />
        </div>
        <div className="hidden tablet:block">
          {renderTradeStats()}
          {renderPoweredBy()}
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
