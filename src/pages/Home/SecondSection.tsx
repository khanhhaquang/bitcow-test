/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  LeftArrowIcon,
  PoolPageActiveIcon,
  PoolPageIcon,
  StarIcon,
  StatsPageActiveIcon,
  StatsPageIcon,
  SwapPageActiveIcon,
  SwapPageIcon
} from 'resources/icons';
import Lottie from 'lottie-react';
import testAnimation01 from 'resources/animation/01.json';
import testAnimation02 from 'resources/animation/02.json';
import cx from 'classnames';
import testAnimation03 from 'resources/animation/03.json';
import Illustration from 'resources/img/landingPage/illustration.svg';
import MobileIllustration from 'resources/img/landingPage/mobileIllustration.svg';
import GreenStarWith4lines from 'resources/img/landingPage/greenStarWith4lines.svg';
import GreenStarWith3lines from 'resources/img/landingPage/greenStarWith3lines.svg';
import WhiteStar from 'resources/img/landingPage/whiteStar.svg';
import MobileStarIllustration from 'resources/img/landingPage/mobileStarIllustration.svg';
import StarBg from 'resources/img/landingPage/starBg.svg';
import SeesawBg from 'resources/img/landingPage/seesaw.svg';
import StarlineBg from 'resources/img/landingPage/starLine.svg';
import { Fragment, useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PeckShieldLogo from 'resources/img/landingPage/peckShieldLogo.png';
import { Menu } from 'components/Antd';
import styles from './Home.module.scss';

const SecondSection = () => {
  const navigate = useNavigate();
  const [currentPageName, setCurrentPageName] = useState('swap');
  const animRef1 = useRef();
  const animRef2 = useRef();
  const animRef3 = useRef();
  const pageContainerRef = useRef<HTMLDivElement>();
  const renderPageBoxes = useCallback(() => {
    const pages = [
      {
        title: 'swap',
        desc: 'Swap quickly and cheaply, BasiQ Protocol leverages Aptos infrastructure to enable ultimate trading experience.',
        icon: <SwapPageIcon />,
        activeIcon: <SwapPageActiveIcon />,
        url: '/swap'
      },
      {
        title: 'POOLS',
        desc: 'Provide liquidity, and return LP token, share  the pool transaction fees.',
        icon: <PoolPageIcon />,
        activeIcon: <PoolPageActiveIcon />,
        url: '/pools'
      },
      {
        title: 'STATS',
        desc: 'View  the recent  datas and change of BasiQ.',
        icon: <StatsPageIcon />,
        activeIcon: <StatsPageActiveIcon />,
        url: '/swap'
      }
    ];

    return pages.map(({ title, desc, icon, activeIcon, url }) => {
      return (
        <div
          className="pageItem w-full group p-[1px] bg-[#272A2C] hover:bg-boxBorder bg-cover bg-no-repeat text-white fill-white hover:fill-color_main cursor-pointer"
          onClick={() => navigate(url)}
          key={title}>
          <div className="w-full h-full flex flex-col justify-between bg-black">
            <div className="p-8 pb-14 flex flex-col laptop:px-6 laptop:pb-6">
              <div className="flex w-full justify-between">
                <div className="font-Furore text-3xl laptop:text-base">{title}</div>
                <div
                  className={cx('w-8 h-8 block group-hover:hidden', {
                    'laptop:block': currentPageName !== title.toLowerCase(),
                    'laptop:hidden': currentPageName === title.toLowerCase()
                  })}>
                  {icon}
                </div>
                <div
                  className={cx('w-8 h-8 hidden group-hover:block', {
                    'laptop:block': currentPageName === title.toLowerCase(),
                    'laptop:hidden': currentPageName !== title.toLowerCase()
                  })}>
                  {activeIcon}
                </div>
              </div>
              <div className="text-lg leading-6 mt-4 laptop:text-xs">{desc}</div>
            </div>
            <div className="flex w-full justify-between px-8 py-6 border-t-[1px] border-[#272A2C] laptop:px-6 laptop:py-5">
              <div className="uppercase font-Furore text-lg laptop:text-sm">Enter</div>
              <LeftArrowIcon className="laptop:w-[18px] laptop:h-[18px]" />
            </div>
          </div>
        </div>
      );
    });
  }, [currentPageName, navigate]);

  const renderFeatures = useCallback(() => {
    const features = [
      {
        name: 'Proactive Liquidity',
        desc: 'Unlike traditional passive AMMs such as constant-product or stable-curve pools, Instead, BasicQ use an external oracle to provide the current “fair price”, and to make sure that liquidity providers won’t be exploited by arb bots that are trying to trade at an unfair price.',
        animation: testAnimation01,
        ref: animRef1
      },
      {
        name: 'Single-token liquidity',
        desc: 'Unlike traditional passive AMMs such as constant-product or stable-curve pools, Instead, BasicQ use an external oracle to provide the current “fair price”, and to make sure that liquidity providers won’t be exploited by arb bots that are trying to trade at an unfair price.',
        animation: testAnimation02,
        ref: animRef2
      },
      {
        name: 'Fair launch',
        desc: 'Unlike traditional passive AMMs such as constant-product or stable-curve pools, Instead, BasicQ use an external oracle to provide the current “fair price”, and to make sure that liquidity providers won’t be exploited by arb bots that are trying to trade at an unfair price.',
        animation: testAnimation03,
        ref: animRef3
      }
    ];
    return features.map(({ name, desc, animation, ref }) => {
      return (
        <div
          className="group relative flex bg-box bg-cover bg-no-repeat bg-center p-8 justify-between gap-6 w-[300px] hover:w-[780px] h-[351px] overflow-hidden ease-in-out transition-all duration-500 laptop:w-full laptop:flex-col-reverse laptop:h-[430px] laptop:p-6 laptop:mt-12"
          key={name}
          onMouseEnter={() => (ref.current as any).play()}
          onMouseLeave={() => (ref.current as any).pause()}>
          <div className="flex flex-col gap-5 duration-500 ease-in-out laptop:gap-4 laptop:text-center">
            <div className="text-color_main text-3xl duration-500 ease-in-out laptop:text-base">
              {name}
            </div>
            <div className="text-xl text-gray_05 mb-8 opacity-0 w-0 group-hover:w-[390px] group-hover:opacity-100 duration-500 ease-in-out laptop:text-xs laptop:opacity-100 laptop:w-full laptop:mb-0">
              {desc}
            </div>
          </div>
          <Lottie
            className="min-w-[208px] min-h-[218px] max-w-[208px] max-h-[218px] absolute bottom-5 -right-16 group-hover:right-10 duration-500 ease-in-out laptop:static laptop:min-w-[150px] laptop:min-h-[150px]"
            animationData={animation}
            lottieRef={ref}
            autoplay={false}
          />
        </div>
      );
    });
  }, []);

  const onClickNav = useCallback(
    (name, index) => {
      if (pageContainerRef.current) {
        setCurrentPageName(name);
        const pageItem = pageContainerRef.current.querySelectorAll('.pageItem');
        pageContainerRef.current.scroll({
          left:
            pageContainerRef.current.scrollLeft + pageItem[index].getBoundingClientRect().left - 16,
          behavior: 'smooth'
        });
        // pageContainerRef.current.scrollLeft += pageItem[index].getBoundingClientRect().left - 16;
        console.log('MEMEMEM>>>', pageItem, pageItem[index].getBoundingClientRect());
      }
    },
    [pageContainerRef]
  );

  const renderNavItems = useCallback(() => {
    return [{ name: 'swap' }, { name: 'pools' }, { name: 'stats' }].map(({ name }, index) => {
      return (
        <Menu.Item key={name} onClick={() => onClickNav(name, index)}>
          <div className="text-lg bold link">{name}</div>
        </Menu.Item>
      );
    });
  }, [onClickNav]);

  return (
    <Fragment>
      <div className="text-white flex pt-[240px] flex-col px-20 relative laptop:px-4 laptop:pt-28">
        <div className="flex gap-2 items-end">
          <div className="text-2xl laptop:text-sm">Reduce Loss</div>
          <StarIcon className="w-[46px] h-[46px] laptop:w-6 laptop:h-6" />
        </div>
        <div className="flex mt-6">
          <div className="uppercase font-Furore text-[28px] block laptop:hidden">
            proactive、single-token liquidity to
            <br /> improve capital efficiency and
            <br /> reduce impermanent loss
          </div>
          <div className="absolute top-0 right-[138px] w-[1px] h-[82.5px] bg-gray_02 laptop:hidden"></div>
          <div className="absolute top-[82.5px] right-0 laptop:hidden flex items-center">
            <img className="" src={GreenStarWith4lines} alt="" />
            <div className="w-[54px] border-b-[1px] border-gray_02"></div>
          </div>
          <div className="absolute top-[250px] right-[137px] w-[1px] h-[790px] bg-gray_02 laptop:hidden"></div>
          <img className="absolute top-[350px] right-[137px] laptop:hidden" src={SeesawBg} alt="" />
          <div className="absolute top-[1040px] left-0 w-[100vw] desktop:flex laptop:hidden items-center">
            <div className="w-full grow border-b-[1px] border-gray_02">
              <img
                className="absolute top-4 left-1/2 transform -translate-x-1/2"
                src={GreenStarWith3lines}
                alt=""
              />
              <hr className="w-[1px] h-[170px] bg-gray_02 absolute left-1/2 transform -translate-x-1/2 top-10" />
            </div>
            <div className="m-4 grow w-8 h-8 max-w-[32px]">
              <img className="" src={WhiteStar} alt="" />
            </div>
            <div className="grow -right-20 min-w-[107px] border-b-[1px] border-gray_02"></div>
          </div>
          <div className="laptop:flex hidden flex-col relative">
            <div className="uppercase font-Furore text-2xl">
              proactive、single-token liquidity to improve capital efficiency and reduce impermanent
              loss
            </div>
            <div className="absolute -left-4 -bottom-40 w-full flex gap-6 justify-between">
              <img className="scale-x-[-1]" src={MobileStarIllustration} alt="" />
              <img className="absolute top-5 -right-[30px]" src={MobileIllustration} alt="" />
            </div>
            <img className="absolute -top-40 -right-4" src={MobileStarIllustration} alt="" />
          </div>
        </div>
        <div className="flex mt-[150px] gap-6 relative z-10 laptop:grid laptop:grid-cols-[250px_250px_250px] laptop:overflow-x-scroll scrollbar-none">
          {renderFeatures()}
        </div>
        <div className="pt-[224px] flex justify-between items-center relative laptop:pt-[270px]">
          <div className="hidden laptop:flex absolute top-0 -left-4 w-full gap-6">
            <img className="scale-x-[-1]" src={MobileStarIllustration} alt="" />
            <img className="absolute top-[60px] -right-[120px]" src={Illustration} alt="" />
          </div>
          <div className="block laptop:hidden">
            <img src={Illustration} width={400} alt="" />
          </div>
          <div className="flex text-white text-right flex-col gap-6 laptop:text-left">
            <div className="flex items-end justify-end laptop:flex-row-reverse">
              <StarIcon className="laptop:w-6 laptop:h-6" />
              <div className="text-2xl laptop:text-sm">Defi on APTOS</div>
            </div>
            <div className="font-Furore text-[28px] laptop:text-2xl">
              A suite of functions powering
              <br /> the DeFi on Aptos
            </div>
          </div>
        </div>
        <Menu
          mode="horizontal"
          theme="dark"
          className={cx(
            styles.menu,
            'hidden laptop:flex justify-start h-full min-w-[200px] w-full !bg-transparent mobile:hidden mt-[60px] mb-10'
          )}
          selectedKeys={[currentPageName]}>
          {renderNavItems()}
        </Menu>
        <div
          ref={pageContainerRef}
          className="flex mt-[130px] gap-6 laptop:grid laptop:grid-cols-[303px_303px_303px] laptop:mt-0 laptop:gap-4 overflow-x-scroll no-scrollbar">
          {renderPageBoxes()}
        </div>
        <div className="flex justify-between w-full mt-[200px] laptop:mt-[106px] laptop:flex-col">
          <div className="flex flex-col gap-4">
            <div className="flex items-end gap-2 laptop:items-baseline">
              <div className="font-Furore text-[28px] text-white laptop:text-2xl">Audited By</div>
              <StarIcon className="laptop:w-8 laptop:h-8" />
            </div>
            <img className="w-[124px] h-[26px]" src={PeckShieldLogo} alt="pech shield" />
          </div>
          <div className="flex gap-6 laptop:gap-4 laptop:mt-[60px] laptop:flex-wrap">
            <div className="group cursor-pointer w-[420px] h-[118px] bg-auditBox bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center gap-4 laptop:w-[343px] laptop:bg-auditBoxMobile laptop:h-[102px]">
              <div className="text-white text-2xl laptop:text-base">Pools Security Audit</div>
              <div className="flex gap-2 justify-center w-full items-center">
                <div className="text-color_main font-Furore text-lg">READ</div>
                <LeftArrowIcon className="hidden group-hover:block fill-color_main laptop:block" />
              </div>
            </div>
            <div className="group cursor-pointer w-[420px] h-[118px] bg-auditBox bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center gap-4 laptop:w-[343px] laptop:bg-auditBoxMobile laptop:h-[102px]">
              <div className="text-white text-2xl laptop:text-base">AMM Program Security Audit</div>
              <div className="flex gap-2 justify-center w-full items-center">
                <div className="text-color_main font-Furore text-lg">READ</div>
                <LeftArrowIcon className="hidden group-hover:block fill-color_main laptop:block" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-dotBg bg-cover bg-no-repeat bg-center w-full h-[100px] mt-40 laptop:mt-[60px] laptop:h-[118px]" />
    </Fragment>
  );
};

export default SecondSection;
