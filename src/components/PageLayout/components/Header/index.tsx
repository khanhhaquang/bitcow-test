/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Layout, Menu } from 'components/Antd';
import WalletConnector from 'components/WalletConnector';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { routes, TRoute } from 'App.routes';
import { LeftArrowIcon, LogoIcon, LogoMobileIcon } from 'resources/icons';
import cx from 'classnames';
import styles from './Header.module.scss';
import useCurrentPage from 'hooks/useCurrentPage';
import classNames from 'classnames';
// import { CloseIcon, MenuIcon } from 'resources/icons';
// import { Drawer } from 'antd';
import { Fragment, useCallback, useState } from 'react';
import Button from 'components/Button';
// import { useSelector } from 'react-redux';
// import { getIsResourcesNotFound } from 'modules/common/reducer';

const { Header } = Layout;

interface ISideMenuProps {
  currentPageName: TRoute['name'];
  onRouteSelected: () => void;
}

const PageHeader: React.FC = () => {
  const [currentPageName] = useCurrentPage();

  const renderNavItems = useCallback(() => {
    return routes.map(({ name, path, hidden }) => {
      if (path === '*' || hidden) return null;
      return (
        <Menu.Item key={name}>
          <Link to={path || '/'} className="text-lg bold font-Furore">
            {name}
          </Link>
        </Menu.Item>
      );
    });
  }, []);

  const renderDesktop = () => {
    return currentPageName !== 'Home' ? (
      <div className="flex items-center w-full">
        <div className="grow h-full">
          <Menu
            mode="horizontal"
            theme="dark"
            className={cx(
              styles.menu,
              'flex justify-start h-full min-w-[200px] w-full !bg-transparent mobile:hidden'
            )}
            selectedKeys={[currentPageName]}>
            {renderNavItems()}
          </Menu>
        </div>
        <div className="px-20 justify-center h-full flex items-center cursor-pointer">
          {<WalletConnector />}
        </div>
      </div>
    ) : (
      <NavLink
        to="swap"
        className="font-Furore text-2xl px-20 border-l-[1px] border-gray_02 ml-auto h-full flex justify-end items-center text-color_main hover:text-color_main bg-transparent">
        {'Launch App'}
      </NavLink>
    );
  };

  return (
    <Header
      className={classNames('w-full h-[62px] bg-black border-gray_02 border-b-[1px] px-0 z-30', {
        'desktop:h-[126px] laptop:h-[64px] bg-transparent absolute top-0 z-10':
          currentPageName === 'Home'
      })}>
      <div className="mx-auto h-full top-0 left-0 flex items-center relative laptop:justify-center">
        <div
          className={classNames('h-full desktop:pl-[60px] laptop:pl-0', {
            'desktop:pl-20': currentPageName === 'Home'
          })}>
          <Link to="/" className={classNames('h-full flex items-center justify-center')}>
            <div
              className={classNames('desktop:hidden', {
                'laptop:block': currentPageName !== 'Home'
              })}>
              <LogoMobileIcon className="w-[120px]" />
            </div>
            <div
              className={classNames('desktop:block', {
                'laptop:hidden': currentPageName !== 'Home'
              })}>
              <LogoIcon className="w-[120px]" />
            </div>
          </Link>
        </div>
        <div
          className={classNames('desktop:block laptop:hidden', {
            grow: currentPageName !== 'Home',
            'h-full ml-auto': currentPageName === 'Home'
          })}>
          {renderDesktop()}
        </div>
        {currentPageName === 'Home' && (
          <div className="hidden laptop:block fixed bottom-0 w-full z-30">
            <NavLink
              to="swap"
              className="font-Furore text-base py-5 w-full flex gap-2 justify-center items-center bg-color_main !text-black">
              {'Launch App'}
              <LeftArrowIcon className="fill-black" width={24} height={24} />
            </NavLink>
          </div>
        )}
      </div>
    </Header>
  );
};

export default PageHeader;
