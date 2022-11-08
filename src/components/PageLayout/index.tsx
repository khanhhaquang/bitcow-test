import { Layout } from 'components/Antd';
import { useRef } from 'react';
// import { useDispatch } from 'react-redux';
// import commonAction from 'modules/common/actions';
import { Footer, Header } from './components';
// import { getLayoutHeight } from 'modules/common/reducer';
// import { useSelector } from 'react-redux';
import useCurrentPage from 'hooks/useCurrentPage';
import classNames from 'classnames';
// import { TRoute } from 'App.routes';
// import styles from './PageLayout.module.scss';

const { Content } = Layout;

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // const dispatch = useDispatch();
  // const contentHeight = useSelector(getLayoutHeight);

  // useEffect(() => {
  //   if (containerRef?.current && containerRef?.current?.clientHeight && !contentHeight)
  //     dispatch(commonAction.SET_LAYOUT_HEIGHT(containerRef?.current?.clientHeight));
  // }, [containerRef, contentHeight, dispatch]);

  const [currentPageName] = useCurrentPage();

  const layoutPadding = currentPageName === 'Home' ? '' : 'px-16';

  return (
    <Layout
      className={classNames(
        'relative min-h-screen bg-black bg-cover bg-no-repeat bg-center overflow-hidden',
        {
          'bg-primary': currentPageName === 'Home',
          'bg-secondary': currentPageName !== 'Home'
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
