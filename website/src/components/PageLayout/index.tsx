import classNames from 'classnames';
import { useMemo } from 'react';

import { Layout } from 'components/Antd';
import useCurrentPage from 'hooks/useCurrentPage';

import { Footer, Header } from './components';
import AppPageDecorators from './components/AppPageDecorators';

const { Content } = Layout;

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPageName] = useCurrentPage();

  const layoutPadding = currentPageName === 'Home' ? '' : 'px-16 tablet:px-4';

  const appBgDecorators = useMemo(() => {
    if (!['Swap', 'Pools'].includes(currentPageName)) return null;
    return <AppPageDecorators />;
  }, [currentPageName]);

  return (
    <Layout className={classNames('page-background relative min-h-screen overflow-hidden ')}>
      {appBgDecorators}
      <Header />
      <Content className={classNames('relative flex justify-center', layoutPadding)}>
        {children}
      </Content>
      <Footer />
    </Layout>
  );
};

export default PageLayout;
