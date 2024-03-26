import Routes from 'App.routes';
import { BrowserRouter } from 'react-router-dom';

import PageLayout from 'components/PageLayout';
import { GlobalSettingProvider } from 'contexts/GlobalSettingProvider';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <GlobalSettingProvider>
        <PageLayout>
          <Routes />
        </PageLayout>
      </GlobalSettingProvider>
    </BrowserRouter>
  );
};

export default App;
