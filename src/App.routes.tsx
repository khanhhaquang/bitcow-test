import { Navigate, RouteObject, useRoutes } from 'react-router-dom';

import Pool from 'pages/Pool';
import Swap from 'pages/Swap';
// import Home from 'pages/Home';
// import Faucet from 'pages/Faucet';
// import { useSelector } from 'react-redux';
// import { getIsResourcesNotFound } from 'modules/common/reducer';
// import Stats from 'pages/Stats';

export type TRoute = RouteObject & {
  name: 'Home' | 'Pools' | 'Swap' | '404' | 'Faucet' | 'Stats';
  hidden?: boolean; //to hide the visibility in header menu
};

export const routes: TRoute[] = [
  // {
  //   path: '',
  //   name: 'Home',
  //   element: <Home />,
  //   hidden: true
  // },
  {
    path: 'swap',
    name: 'Swap',
    element: <Swap />
  },
  {
    path: 'pools',
    name: 'Pools',
    // hidden: true,
    element: <Pool />
  },
  // {
  //   path: 'stats',
  //   name: 'Stats',
  //   element: <Pool />
  // },
  // {
  //   path: 'stats',
  //   name: 'Stats',
  //   element: <Stats />
  // },
  {
    path: '*',
    name: '404',
    element: <Navigate replace to="/swap" />
  }
];

const Routes = () => {
  const activeRoutes = [...routes];
  // const isResourcesNotFound = useSelector(getIsResourcesNotFound);
  // const nav = useNavigate();
  // const location = useLocation();
  // if (isResourcesNotFound) {
  //   activeRoutes.forEach((r) => {
  //     if (['Swap', 'Faucet'].includes(r.name)) {
  //       r.hidden = true;
  //     }
  //   });
  //   setTimeout(() => {
  //     if (location.pathname !== '/') nav('/');
  //   });
  // }

  const elements = useRoutes(activeRoutes as RouteObject[]);
  return elements;
};

export default Routes;
