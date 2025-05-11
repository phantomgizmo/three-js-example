import { useRoutes } from 'react-router-dom';

import Simulation from '@/pages/simulation';
const AppRouter = () => {
  const publicRoutes = [
    {
      path: '/simulation',
      element: <Simulation></Simulation>
    }
  ];

  const routes = useRoutes([...publicRoutes]);

  return routes;
};

export default AppRouter;
