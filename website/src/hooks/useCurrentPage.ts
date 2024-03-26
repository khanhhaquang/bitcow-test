import { routes, TRoute } from 'App.routes';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const useCurrentPage = () => {
  const { pathname } = useLocation();
  const [selectedKey, setSelectedKey] = useState<TRoute['name']>('Home');

  const rootPath = pathname.split('/')[1];
  const pageName = routes?.find((r) => r?.path === rootPath)?.name || routes[0].name;
  if (pageName !== selectedKey) {
    setSelectedKey(pageName);
  }

  return [selectedKey];
};

export default useCurrentPage;
