import React, { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NavBar from './navbar';
import { getCurrentYear } from '../utils/GeneralUtil';

const CustomSnackbar = React.lazy(
  () =>
    import(/* webpackChunkName: "snackbar" */ '../component/common/snackbar')
);

const Layout = (): JSX.Element => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
  }, [pathname]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#10141F',
        color: 'white',
      }}
    >
      <CustomSnackbar />
      <NavBar />
      <Box
        sx={{
          flexGrow: 1,
          marginTop: { xs: '100px', md: '55px' },
        }}
      >
        <Outlet />
      </Box>
      <Box sx={{ p: 1, textAlign: 'center' }}>
        <Typography variant="body2" color="white">
          © {getCurrentYear()} Enerlex, Inc
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
