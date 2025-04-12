import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
const OverlayLoader = lazy(
  () =>
    import(
      /* webpackChunkName: "overlayLoader" */ '../component/common/OverlayLoader'
    )
);

const LoginPage = lazy(
  () => import(/* webpackChunkName: "loginPage" */ '../pages/login/Login')
);

const ErrorBoundaryFallback = React.lazy(
  () =>
    import(
      /* webpackChunkName: "routes" */ '../pages/Error/ErrorBoundaryFallback'
    )
);

export const PublicRouter = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorBoundaryFallback />,
    element: (
      <Suspense fallback={<OverlayLoader open />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    errorElement: <ErrorBoundaryFallback />,
    element: <Navigate to="/" replace />,
  },
]);
