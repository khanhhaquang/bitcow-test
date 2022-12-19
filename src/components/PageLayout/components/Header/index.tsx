/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { routes } from 'App.routes';
import cx from 'classnames';
import { useCallback, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { Drawer, Layout, Menu } from 'components/Antd';
import Button from 'components/Button';
import ThemeToggler from 'components/ThemeToggler';
import WalletConnector from 'components/WalletConnector';
import useCurrentPage from 'hooks/useCurrentPage';
import { LeftArrowIcon, LogoIcon, LogoMobileIcon, MenuIcon } from 'resources/icons';
import LogoImg from 'resources/img/logo.png';
import LogoBlackImg from 'resources/img/logoBlack.png';

import styles from './Header.module.scss';
import { StarWhiteIcon } from 'resources/icons/landingPage';

const { Header } = Layout;

const PageHeader: React.FC = () => {
  const [currentPageName] = useCurrentPage();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const renderNavItems = useCallback(() => {
    return routes.map(({ name, path, hidden }) => {
      if (path === '*' || hidden) return null;
      return (
        <Menu.Item
          key={name}
          onClick={() => setIsSideMenuOpen(false)}
          className={'group !bg-transparent'}>
          <Link
            to={path || '/'}
            className="bold text-base font-medium !text-color_text_1 group-hover:!text-color_main tablet:font-Furore tablet:!text-color_text_2">
            {name}
          </Link>
        </Menu.Item>
      );
    });
  }, []);

  const renderDesktop = () => {
    return currentPageName !== 'Home' ? (
      <div className="flex w-full items-center">
        <div className="h-full grow">
          <Menu
            mode="horizontal"
            theme="dark"
            className={cx(
              styles.menu,
              'flex h-full w-full min-w-[200px] justify-center !bg-transparent'
            )}
            selectedKeys={[currentPageName]}>
            {renderNavItems()}
          </Menu>
        </div>
        <div className="flex h-full items-center justify-center gap-4 px-20">
          <div className="flex h-10 w-[158px] cursor-pointer items-center justify-center">
            {<WalletConnector />}
          </div>
          <ThemeToggler />
        </div>
      </div>
    ) : (
      <NavLink
        to="swap"
        className="relative ml-auto flex h-full items-center justify-end border-l-[1px] border-color_border bg-transparent px-20 font-Furore text-2xl text-color_main hover:text-color_main">
        {'Launch App'}
        <div className="absolute -left-4 -bottom-4 desktop:block tablet:hidden">
          {/* <img src={StarWhite} alt="" /> */}
          <StarWhiteIcon className="z-10 fill-color_main dark:fill-[#D9D9D9]" />
        </div>
      </NavLink>
    );
  };

  const rednerMobileMenu = () => {
    return (
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col items-start">
          <Link
            to="/"
            onClick={() => setIsSideMenuOpen(false)}
            className={cx('mb-24 flex h-full items-center justify-center')}>
            <div className={cx('block w-[109px]')}>
              <img src={LogoImg} className="hidden h-full w-full dark:block" alt="Logo" />
              <img src={LogoBlackImg} className="block h-full w-full dark:hidden" alt="Logo" />
            </div>
          </Link>
          <Menu
            mode="vertical"
            theme="dark"
            className={cx(
              styles.menu,
              'flex h-full w-full flex-col justify-center !bg-transparent'
            )}
            selectedKeys={[currentPageName]}>
            {renderNavItems()}
          </Menu>
        </div>
        <ThemeToggler />
      </div>
    );
  };

  return (
    <Header
      className={cx('z-30 h-[72px] w-full bg-transparent px-0 tablet:h-[64px]', {
        'absolute top-0 z-10 h-[126px] bg-transparent tablet:h-[64px]': currentPageName === 'Home'
      })}>
      <div
        className={cx(
          'relative top-0 left-0 mx-auto flex h-full items-center  tablet:border-b-[1px] tablet:border-color_border tablet:px-4',
          {
            'tablet:justify-between': currentPageName !== 'Home',
            'tablet:justify-center': currentPageName === 'Home'
          }
        )}>
        <div className={cx('h-full pl-[60px] tablet:pl-0')}>
          <Link to="/" className={cx('flex h-full items-center justify-center hover:-rotate-12')}>
            <div
              className={cx('hidden', {
                'tablet:block': currentPageName !== 'Home'
              })}>
              <LogoMobileIcon className="w-8" />
            </div>
            <div
              className={cx('block', {
                'tablet:hidden': currentPageName !== 'Home'
              })}>
              <LogoIcon
                height={30}
                width={currentPageName !== 'Home' ? 150 : 174}
                className="fill-black dark:fill-white"
              />
            </div>
          </Link>
        </div>
        {/* Desktop */}
        <div
          className={cx('block tablet:hidden', {
            grow: currentPageName !== 'Home',
            'ml-auto h-full': currentPageName === 'Home'
          })}>
          {renderDesktop()}
        </div>
        {/* Mobile - Home Page */}
        {currentPageName === 'Home' && (
          <div className="fixed bottom-0 left-0 z-30 hidden w-full tablet:block">
            <NavLink
              to="swap"
              className="flex w-full items-center justify-center gap-2 bg-color_main py-[18px] font-Furore text-base !text-white">
              {'Launch App'}
              <LeftArrowIcon className="fill-white" width={24} height={24} />
            </NavLink>
          </div>
        )}
        {/* Mobile - non home page */}
        {currentPageName !== 'Home' && (
          <div className="hidden items-center gap-2 tablet:flex">
            <div className="h-8">
              <WalletConnector />
            </div>
            <Button className="h-8 w-8" variant="icon" onClick={() => setIsSideMenuOpen(true)}>
              <MenuIcon />
            </Button>
          </div>
        )}
      </div>
      <Drawer
        open={isSideMenuOpen}
        className={cx(styles.drawer, 'hidden tablet:block')}
        closable={false}
        placement="right"
        width="212px"
        onClose={() => setIsSideMenuOpen(false)}>
        {rednerMobileMenu()}
        {/* <SideMenu
          currentPageName={currentPageName}
          onRouteSelected={() => setIsSideMenuOpen(false)}
        /> */}
      </Drawer>
    </Header>
  );
};

export default PageHeader;
