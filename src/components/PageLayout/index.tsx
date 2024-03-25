import classNames from 'classnames';

import { Layout } from 'components/Antd';
import useCurrentPage from 'hooks/useCurrentPage';

import { Footer, Header } from './components';

const { Content } = Layout;

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPageName] = useCurrentPage();

  const layoutPadding = currentPageName === 'Home' ? '' : 'px-16 tablet:px-4';

  return (
    <Layout
      className={classNames(
        'relative min-h-screen overflow-hidden bg-whiteBg bg-cover bg-center bg-no-repeat'
      )}>
      <Header />
      <Content className={classNames('relative flex justify-center', layoutPadding)}>
        {children}
      </Content>
      <Footer />
    </Layout>
  );
};

export default PageLayout;
