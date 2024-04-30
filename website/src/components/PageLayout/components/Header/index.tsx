/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { routes } from 'App.routes';
import { useMemo, useState } from 'react';
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
import { cn } from 'utils/cn';

import styles from './Header.module.scss';

const { Header } = Layout;

const PageHeader: React.FC = () => {
  const [currentPageName] = useCurrentPage();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const nav = useNavigate();

  const navItems = useMemo(() => {
    return routes.map(({ name, path, hidden }) => {
      if (path === '*' || hidden) return null;
      return (
        <Menu.Item
          key={name}
          onClick={() => setIsSideMenuOpen(false)}
          className={'group !bg-transparent'}>
          <Link
            to={path || '/'}
            className="font-micro text-2xl uppercase leading-none !text-bc-white-60 group-hover:!text-bc-white tablet:!text-color_text_2">
            {name}
          </Link>
        </Menu.Item>
      );
    });
  }, []);

  const isLandingPage = useMemo(() => currentPageName === 'Home', [currentPageName]);

  const renderDesktop = () => {
    if (isLandingPage) {
      return (
        <PixelButton
          className="font-micro text-2xl uppercase"
          width={246}
          height={44}
          borderWidth={4}
          onClick={() => nav('/swap')}>
          Launch app
        </PixelButton>
      );
    }

    return (
      <div className="relative flex w-full grow items-center justify-end pr-10">
        <WalletConnector />
        <div className="absolute top-full">
          <NetworkSelect className="mt-3" />
        </div>
      </div>
    );
  };

  const renderMobileMenu = () => {
    return (
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col items-start">
          <Link
            to="/"
            onClick={() => setIsSideMenuOpen(false)}
            className={'mb-20 flex h-full items-center justify-center'}>
            <img width={80} height={80} src={LogoBitCow} alt="Logo" />
          </Link>
          <Menu
            mode="vertical"
            theme="dark"
            className={cn(
              styles.menu,
              'flex h-full w-full flex-col justify-center gap-8 !bg-transparent'
            )}
            selectedKeys={[currentPageName]}>
            {navItems}
          </Menu>
        </div>
        {/*
        <ThemeToggler />
            */}
      </div>
    );
  };

  return (
    <Header className={'z-10 h-[140px] w-full bg-transparent px-0 pt-12 tablet:pt-0'}>
      <div className={'relative flex h-full items-center justify-between px-20 tablet:px-12'}>
        <Link to="/" className={'flex h-full items-center justify-center hover:-rotate-12'}>
          <div
            className={cn('hidden', {
              'tablet:block': !isLandingPage
            })}>
            <img src={LogoBitCow} className="block h-auto w-12" alt="Logo" />
          </div>
          <div
            className={cn('block', {
              'tablet:hidden': !isLandingPage
            })}>
            <img src={LogoBitCow} className="block h-auto w-[81px]" alt="Logo" />
          </div>
        </Link>
        {/* Desktop */}
        {!isLandingPage && (
          <div className="absolute left-1/2 z-10 flex h-full grow -translate-x-1/2 items-center tablet:hidden">
            <Menu
              mode="horizontal"
              theme="dark"
              className={cn(
                styles.menu,
                'flex h-fit w-full min-w-[200px] items-center justify-center gap-x-4 !bg-transparent'
              )}
              selectedKeys={[currentPageName]}>
              {navItems}
            </Menu>
          </div>
        )}
        <div
          className={cn('block tablet:hidden', {
            grow: !isLandingPage
          })}>
          {renderDesktop()}
        </div>
        {/* Mobile - non home page */}
        {!isLandingPage && (
          <div className="hidden h-full items-center gap-x-2 tablet:flex">
            <WalletConnector />
            <Button className="h-8 w-8" variant="icon" onClick={() => setIsSideMenuOpen(true)}>
              <MenuIcon />
            </Button>
          </div>
        )}
        {/* Mobile - home page */}
        {isLandingPage && (
          <div className="hidden h-full items-center tablet:flex">
            <PixelButton
              className="font-micro text-2xl uppercase"
              width={246}
              height={44}
              borderWidth={4}
              onClick={() => nav('/swap')}>
              Launch app
            </PixelButton>
          </div>
        )}
      </div>
      <Drawer
        open={isSideMenuOpen}
        className={cn(styles.drawer, 'hidden tablet:block')}
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
