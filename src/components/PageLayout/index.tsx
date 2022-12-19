import classNames from 'classnames';
import { useRef } from 'react';

import { Layout } from 'components/Antd';
import useCurrentPage from 'hooks/useCurrentPage';

import { Footer, Header } from './components';

const { Content } = Layout;

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentPageName] = useCurrentPage();

  const layoutPadding = currentPageName === 'Home' ? '' : 'px-16 tablet:px-4';

  return (
    <Layout
      className={classNames(
        'relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat',
        {
          'bg-white bg-landingBgWhite dark:bg-black dark:!bg-landingBgDark tablet:!bg-none tablet:dark:!bg-none':
            currentPageName === 'Home',
          'bg-whiteBg dark:bg-black dark:!bg-darkDesktopBg dark:tablet:!bg-darkBg':
            currentPageName !== 'Home'
        }
      )}>
      <Header />
      <Content className={classNames('relative', layoutPadding)}>
        <div ref={containerRef} className="relative z-10">
          {children}
        </div>
      </Content>
      {currentPageName !== 'Home' && <Footer />}
    </Layout>
  );
};

export default PageLayout;
