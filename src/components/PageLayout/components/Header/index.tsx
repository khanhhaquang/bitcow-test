/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { routes, TRoute } from 'App.routes';
import cx from 'classnames';
import { useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { Layout, Menu } from 'components/Antd';
import WalletConnector from 'components/WalletConnector';
import useCurrentPage from 'hooks/useCurrentPage';
import { LeftArrowIcon, LogoIcon, LogoMobileIcon } from 'resources/icons';

import styles from './Header.module.scss';

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
          <Link to={path || '/'} className="bold font-Furore text-lg">
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
              'mobile:hidden flex h-full w-full min-w-[200px] justify-center !bg-transparent'
            )}
            selectedKeys={[currentPageName]}>
            {renderNavItems()}
          </Menu>
        </div>
        <div className="flex h-full cursor-pointer items-center justify-center px-20">
          {<WalletConnector />}
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

  return (
    <Header
      className={cx('z-30 h-[62px] w-full border-b-[1px] border-gray_02 bg-black px-0', {
        'absolute top-0 z-10 bg-transparent desktop:h-[126px] laptop:h-[64px]':
          currentPageName === 'Home'
      })}>
      <div className="relative top-0 left-0 mx-auto flex h-full items-center laptop:justify-center">
        <div
          className={cx('h-full desktop:pl-[60px] laptop:pl-0', {
            'desktop:pl-20': currentPageName === 'Home'
          })}>
          <Link to="/" className={cx('flex h-full items-center justify-center')}>
            <div
              className={cx('desktop:hidden', {
                'laptop:block': currentPageName !== 'Home'
              })}>
              <LogoMobileIcon className="w-[120px]" />
            </div>
            <div
              className={cx('desktop:block', {
                'laptop:hidden': currentPageName !== 'Home'
              })}>
              <LogoIcon className="w-[120px]" />
            </div>
          </Link>
        </div>
        <div
          className={cx('desktop:block laptop:hidden', {
            grow: currentPageName !== 'Home',
            'ml-auto h-full': currentPageName === 'Home'
          })}>
          {renderDesktop()}
        </div>
        {currentPageName === 'Home' && (
          <div className="fixed bottom-0 z-30 hidden w-full laptop:block">
            <NavLink
              to="swap"
              className="flex w-full items-center justify-center gap-2 bg-color_main py-5 font-Furore text-base !text-black">
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
