/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { routes } from 'App.routes';
import cx from 'classnames';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

import { Drawer, Layout, Menu } from 'components/Antd';
import Button from 'components/Button';
// import ThemeToggler from 'components/ThemeToggler';
import WalletConnector from 'components/WalletConnector';
import useCurrentPage from 'hooks/useCurrentPage';
import { MenuIcon } from 'resources/icons';
import LogoBitCow from 'resources/img/logoBitCow.png';

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
            className="text-[24px] font-normal uppercase leading-none !text-bc-light group-hover:!text-bc-white tablet:font-Furore tablet:!text-color_text_2">
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
          {/*
          <ThemeToggler />
            */}
        </div>
      </div>
    ) : null;
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
              <img src={LogoBitCow} className="block h-auto w-12" alt="Logo" />
            </div>
            <div
              className={cx('block', {
                'tablet:hidden': currentPageName !== 'Home'
              })}>
              <img src={LogoBitCow} className="block h-auto w-[81px]" alt="Logo" />
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
