import { Fragment, useMemo } from 'react';
// import SpriteAnimator from 'react-responsive-spritesheet';
import { NavLink } from 'react-router-dom';

import Footer from 'components/PageLayout/components/Footer';
import { numberGroupFormat } from 'components/PositiveFloatNumInput/numberFormats';
import usePools from 'hooks/usePools';
import { DocsIcon, LeftArrowIcon } from 'resources/icons';
import image from 'resources/img/landingPage/img.png';

import LazyShow from './components/LazyShow';

const Home = () => {
  const { getTotalPoolsTVL, getTotalPoolsVolume } = usePools();

  const tvl = useMemo(() => {
    const val = getTotalPoolsTVL();
    return val ? `$${numberGroupFormat(val)}` : '-';
  }, [getTotalPoolsTVL]);

  const vol24hr = useMemo(() => {
    const val = getTotalPoolsVolume();
    return val ? `$${numberGroupFormat(val)}` : '-';
  }, [getTotalPoolsVolume]);

  const renderTradeStats = () => {
    return (
      <div className="mt-[200px] flex font-Rany text-color_text_2 tablet:mt-0 tablet:flex-col tablet:gap-2">
        <div className="flex flex-col tablet:w-full tablet:flex-col-reverse tablet:gap-2 tablet:bg-gray_008 tablet:py-4">
          <div className="flex gap-2 tablet:justify-center">
            <div className="text-lg font-light tablet:text-sm">Total Value Locked</div>
            {/* <div className="bg-color_bg_hover px-2 py-1 font-Furore text-sm text-color_minor tablet:text-xs">
              1.88%
            </div> */}
          </div>
          <div className="flex items-center gap-4 tablet:justify-center">
            <div className="font-Furore text-2xl text-color_text_1 tablet:text-2xl">{tvl}</div>
            {/* <LeftArrowIcon className="-rotate-45 fill-color_minor" /> */}
          </div>
        </div>
        <hr className="mx-6 block h-[60px] w-[1px] border-0 bg-color_disabled tablet:hidden" />
        <div className="flex flex-col tablet:w-full tablet:flex-col-reverse tablet:gap-2 tablet:bg-gray_008 tablet:py-4">
          <div className="flex gap-2 tablet:justify-center">
            <div className="text-lg font-light tablet:text-sm">24 Hour Volume</div>
            {/* <div className="bg-color_bg_hover px-2 py-1 font-Furore text-sm text-color_main tablet:text-xs">
              1.88%
            </div> */}
          </div>
          <div className="flex items-center gap-4 tablet:justify-center">
            <div className="font-Furore text-2xl text-color_text_1 tablet:text-2xl">{vol24hr}</div>
            {/* <LeftArrowIcon className="rotate-45 fill-color_main" /> */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <div className="flex justify-between gap-12 bg-cover bg-center bg-no-repeat px-20 pt-[126px] tablet:flex-col tablet:justify-center tablet:gap-0 tablet:px-4 tablet:pb-20 tablet:pt-16 tablet:text-center">
        <div className="relative w-1/3 grow pb-36 pt-[100px] tablet:w-full tablet:pt-[60px] tablet:pb-8">
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
              <a
                href="https://obricxyz.gitbook.io/smart/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-none border-[1px] border-color_main py-[18px] px-6 font-Furore text-base text-color_main hover:bg-gray_02 hover:text-color_main tablet:grow tablet:px-5 tablet:py-[14px] tablet:text-sm tablet:leading-3">
                READ DOCS
                <DocsIcon className="fill-color_main tablet:h-[18px] tablet:w-[18px]" />
              </a>
            </div>
            <div className="block tablet:hidden">
              {renderTradeStats()}
              {/* {renderPoweredBy()} */}
            </div>
          </LazyShow>
          <Footer className="absolute bottom-0 -left-20 block w-[100vw] tablet:hidden" />
        </div>
        <div className="w-1/2 grow pt-[80px] tablet:hidden">
          <img src={image} alt="" className="w-full object-contain" />
          {/* <SpriteAnimator
            image={theme === Theme.Dark ? SpriteSheetDark : SpriteSheetWhite}
            widthFrame={800}
            heightFrame={800}
            steps={theme === Theme.Dark ? 205 : 92}
            fps={60}
            autoplay
            loop
          /> */}
        </div>
        <div className="hidden tablet:block"> {renderTradeStats()} </div>
      </div>
    </Fragment>
  );
};

export default Home;
