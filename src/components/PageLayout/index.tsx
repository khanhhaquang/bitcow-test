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
          'bg-primary': currentPageName === 'Home',
          'bg-whiteBg dark:bg-black dark:bg-darkBg tablet:!bg-none': currentPageName !== 'Home'
        }
      )}>
      <Header />
      <Content className={classNames('relative', layoutPadding)}>
        <div ref={containerRef} className="relative z-10">
          {children}
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default PageLayout;
