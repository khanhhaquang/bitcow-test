import { BrowserRouter } from 'react-router-dom';
import PageLayout from 'components/PageLayout';
import Routes from 'App.routes';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <PageLayout>
        <Routes />
      </PageLayout>
    </BrowserRouter>
  );
};

export default App;
