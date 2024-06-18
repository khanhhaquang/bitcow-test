import classNames from 'classnames';
import { useMemo } from 'react';

import { Layout } from 'components/Antd';
import useCurrentPage from 'hooks/useCurrentPage';

import { Footer, Header } from './components';
import AppPageDecorators from './components/AppPageDecorators';
import LuckyCowDecorator from './components/LuckyCowDecorator';
import LuckyResultHighlight from './components/LuckyCowResultHighlight';

const { Content } = Layout;

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPageName] = useCurrentPage();

  const layoutPadding = currentPageName === 'Home' ? '' : 'px-16 tablet:px-4';
  const isLuckyCowPage = currentPageName === 'Lucky Cow';

  const appBgDecorators = useMemo(() => {
    if (!['Swap', 'Pools', 'Campaign'].includes(currentPageName)) return null;
    return <AppPageDecorators />;
  }, [currentPageName]);

  const luckyCowDecorator = useMemo(() => {
    if (!isLuckyCowPage) return null;
    return <LuckyCowDecorator />;
  }, [currentPageName]);

  return (
    <Layout
      className={classNames(
        'relative min-h-screen overflow-hidden',
        isLuckyCowPage ? 'overflow-y-auto bg-lucky-cow pb-[60px] pt-10' : 'page-background'
      )}>
      {isLuckyCowPage && <LuckyResultHighlight direction="leftToRight" classNames="top-0" />}
      {isLuckyCowPage && <LuckyResultHighlight direction="rightToLeft" classNames="bottom-0" />}
      {luckyCowDecorator}
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
