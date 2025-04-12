import React, { Suspense, useEffect } from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './layout/theme';
import {
  useLogoutMutation,
  useVerifySignedInQuery,
} from './store/Services/auth';
import { useAppDispatch } from './store/hooks';
import { setServerTimezone } from './store/Reducers/timezoneSliceReducer';
import { loginResponse } from './interface/user';
import OverlayLoader from './component/common/OverlayLoader';
import './App.css';
import { useOnlineStatus } from './hooks/useNavigatorOnline';
import './assets/images/logo.png';

const Router = React.lazy(
  () => import(/* webpackChunkName: "routes" */ './routes')
);

const NetworkError = React.lazy(
  () => import(/* webpackChunkName: "routes" */ './pages/Error/NetworkError')
);

function App(): JSX.Element {
  const { data, isLoading } = useVerifySignedInQuery('') as {
    data: loginResponse;
    isLoading: boolean;
  };
  const [, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (data && data.servertimezone) {
      dispatch(setServerTimezone(data.servertimezone));
    }
  }, [data, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<OverlayLoader open />}>
        <CssBaseline />
        <Box
          sx={{
            backgroundColor: theme.palette.background.default,
            minHeight: '100vh',
            pointerEvents: isLogoutLoading ? 'none' : 'auto',
          }}
        >
          {isOnline ? !isLoading && <Router /> : <NetworkError />}
        </Box>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
