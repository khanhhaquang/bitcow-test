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
            className="bold font-Furore text-lg !text-color_text_1 group-hover:!text-color_main tablet:!text-color_text_2">
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
          <div className="flex h-full cursor-pointer items-center justify-center">
            {<WalletConnector />}
          </div>
          <ThemeToggler />
        </div>
      </div>
    ) : (
      <NavLink
        to="swap"
        className="ml-auto flex h-full items-center justify-end border-l-[1px] border-gray_02 bg-transparent px-20 font-Furore text-2xl text-color_main hover:text-color_main">
        {'Launch App'}
      </NavLink>
    );
  };

  const rednerMobileMenu = () => {
    return (
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col items-start">
          <Link to="/" className={cx('mb-24 flex h-full items-center justify-center')}>
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
      <div className="relative top-0 left-0 mx-auto flex h-full items-center tablet:justify-between tablet:px-4">
        <div
          className={cx('h-full pl-[60px] tablet:pl-0', {
            'pl-20': currentPageName === 'Home'
          })}>
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
              <LogoIcon className="w-[120px] fill-black dark:fill-white" />
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
          <div className="fixed bottom-0 z-30 hidden w-full tablet:block">
            <NavLink
              to="swap"
              className="flex w-full items-center justify-center gap-2 bg-color_main py-5 font-Furore text-base !text-black">
              {'Launch App'}
              <LeftArrowIcon className="fill-black" width={24} height={24} />
            </NavLink>
          </div>
        )}
        {/* Mobile - non home page */}
        <div className="hidden items-center gap-2 tablet:flex">
          <div className="h-8">
            <WalletConnector />
          </div>
          <Button className="h-8 w-8" variant="icon" onClick={() => setIsSideMenuOpen(true)}>
            <MenuIcon />
          </Button>
        </div>
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
