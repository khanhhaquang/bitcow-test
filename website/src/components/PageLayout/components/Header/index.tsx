/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { routes } from 'App.routes';
import cx from 'classnames';
import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Drawer, Layout, Menu } from 'components/Antd';
import Button from 'components/Button';
// import ThemeToggler from 'components/ThemeToggler';
import NetworkSelect from 'components/NetworkSelect';
import PixelButton from 'components/PixelButton';
import WalletConnector from 'components/WalletConnector';
import useCurrentPage from 'hooks/useCurrentPage';
import { MenuIcon } from 'resources/icons';
import LogoBitCow from 'resources/img/logoBitCow.png';

import styles from './Header.module.scss';

const { Header } = Layout;

const PageHeader: React.FC = () => {
  const [currentPageName] = useCurrentPage();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const nav = useNavigate();

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
            className="tablet: text-[24px] font-normal uppercase leading-none !text-bc-white-60 group-hover:!text-bc-white tablet:!text-color_text_2">
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
        <div className="relative flex h-full items-center justify-center pr-[40px]">
          {/*
          <img width={132} height={27} src="/images/bitSmiley.svg" alt="bitSmiley" />
            */}
          <div className="relative ml-9">
            <WalletConnector />
            <div className="absolute top-full">
              <NetworkSelect className="mt-3" />
            </div>
          </div>
          {/*
          <ThemeToggler />
            */}
        </div>
      </div>
    ) : (
      <PixelButton
        className="text-white"
        width={246}
        height={44}
        borderWidth={4}
        onClick={() => nav('/swap')}>
        <span className="text-2xl uppercase">Launch app</span>
      </PixelButton>
    );
  };

  const renderMobileMenu = () => {
    return (
      <div className="flex h-full flex-col justify-between bg-whiteBg">
        <div className="flex flex-col items-start">
          <Link
            to="/"
            onClick={() => setIsSideMenuOpen(false)}
            className={cx('mb-24 flex h-full items-center justify-center')}>
            <div className={cx('block w-[109px]')}>
              <img src={LogoBitCow} className="block h-full w-full" alt="Logo" />
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
        {/*
        <ThemeToggler />
            */}
      </div>
    );
  };

  return (
    <Header className={cx('z-10 h-[140px] w-full bg-transparent px-0 pt-12 tablet:pt-0')}>
      <div className={cx('relative flex h-full items-center justify-between px-20')}>
        <Link to="/" className={cx('flex h-full items-center justify-center hover:-rotate-12')}>
          <div
            className={cx('hidden', {
              'tablet:block': currentPageName !== 'Home'
            })}>
            <img src={LogoBitCow} className="block h-auto w-12" alt="Logo" />
          </div>
          <div
            className={cx('block', {
              'tablet:hidden': currentPageName !== 'Home'
            })}>
            <img src={LogoBitCow} className="block h-auto w-[81px]" alt="Logo" />
          </div>
        </Link>
        {/* Desktop */}
        <div
          className={cx('block tablet:hidden', {
            grow: currentPageName !== 'Home'
          })}>
          {renderDesktop()}
        </div>
        {/* Mobile - non home page */}
        {currentPageName !== 'Home' && (
          <div className="hidden h-full items-center gap-x-2 tablet:flex">
            <WalletConnector />
            <Button className="h-8 w-8" variant="icon" onClick={() => setIsSideMenuOpen(true)}>
              <MenuIcon />
            </Button>
          </div>
        )}
        {/* Mobile - home page */}
        {currentPageName === 'Home' && (
          <div className="hidden h-full items-center tablet:flex">
            <PixelButton width={246} height={44} borderWidth={4} onClick={() => nav('/swap')}>
              <span className="text-2xl uppercase text-white">Launch app</span>
            </PixelButton>
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
        {renderMobileMenu()}
        {/* <SideMenu
          currentPageName={currentPageName}
          onRouteSelected={() => setIsSideMenuOpen(false)}
        /> */}
      </Drawer>
    </Header>
  );
};

export default PageHeader;
