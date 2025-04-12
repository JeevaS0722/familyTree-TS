import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { PrivateRouter } from './privateRoutes';
import { PublicRouter } from './publicRoutes';

function AppRouter(): JSX.Element {
  const auth = useAppSelector(state => state.auth);

  const router = auth.isLoggedIn ? PrivateRouter : PublicRouter;

  return <RouterProvider router={router} />;
}

export default AppRouter;
