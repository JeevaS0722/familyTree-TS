import React, { useState, useEffect } from 'react';
import { useRouteError } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import ListSubheader from '@mui/material/ListSubheader';
import Button from '@mui/material/Button';
import { RefreshOutlined } from '@mui/icons-material';
import { errorType } from '../../interface/error';
import OverlayLoader from '../../component/common/OverlayLoader';

const NetworkError = React.lazy(
  () => import(/* webpackChunkName: "routes" */ './NetworkError')
);

const ErrorBoundaryFallback: React.FC = () => {
  const error = useRouteError() as { message: string };
  const { t } = useTranslation('errors');
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState<errorType>({
    unexpectedError: false,
    networkError: false,
    newVersion: false,
  });
  const version = useSelector(
    (state: {
      app: {
        version: string;
      };
    }) => state.app.version
  );

  const checkOffline = () => {
    try {
      void fetch('/assets/favicon.png', {
        method: 'HEAD',
        cache: 'no-store',
      })
        .then(res => {
          if (!res.ok) {
            setErrorType({
              networkError: true,
            });
          } else {
            setErrorType({
              unexpectedError: true,
            });
          }
          setLoading(false);
        })
        .catch(() => {
          setErrorType({
            networkError: true,
          });
          setLoading(false);
        });
    } catch (error) {
      setErrorType({
        networkError: true,
      });
    }
  };

  useEffect(() => {
    if (
      error?.message &&
      (error?.message.includes('Loading chunk') ||
        error?.message.includes('ChunkLoadError'))
    ) {
      void fetch(`${process.env.REACT_APP_API_BASE_URL}/common/places?type=7`, {
        cache: 'no-store',
      })
        .then(response => {
          const serverVersion = response.headers.get(
            'X-Filemaster-App-Version'
          );
          if (serverVersion) {
            if (version && version !== serverVersion) {
              // Versions mismatch
              setErrorType({ newVersion: true });
            } else {
              checkOffline();
            }
          } else {
            checkOffline();
          }
        })
        .catch(() => {
          checkOffline();
        });
    } else {
      checkOffline();
    }
  }, [error, version]);

  if (loading) {
    return <OverlayLoader open />;
  }

  if (
    !errorType.networkError &&
    !errorType.unexpectedError &&
    !errorType.newVersion
  ) {
    return false;
  }

  if (errorType.networkError) {
    return <NetworkError />;
  }

  if (errorType.newVersion) {
    return (
      <Container
        fixed
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Grid container>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#ccc' }}>
              {t('newVersion')}
            </Typography>
          </Grid>
          <Grid item xs={12} mt={2} sx={{ textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
              sx={{
                whiteSpace: 'nowrap',
                '&:disabled': {
                  opacity: 0.2,
                  cursor: 'not-allowed',
                  borderColor: '#1997c6',
                  color: '#fff',
                },
              }}
            >
              <RefreshOutlined sx={{ marginRight: '5px', fontSize: '20px' }} />
              {t('reload')}
            </Button>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (errorType.unexpectedError) {
    return (
      <Container
        fixed
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              display: 'block',
              textAlign: 'center',
              width: 'fit-content',
            }}
          >
            <ListSubheader
              sx={{
                cursor: 'pointer',
                backgroundColor: 'transparent',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              id="dashboard-link"
            >
              <img src="/assets/favicon.png" alt="logo" className="wlogo" />
              <Typography
                sx={{ color: '#fff', marginLeft: '5px' }}
                variant="h5"
              >
                {t('title')}
              </Typography>
            </ListSubheader>
          </Grid>
          <Grid
            item
            xs={12}
            mt={1}
            sx={{
              display: 'block',
              textAlign: 'center',
              width: 'fit-content',
            }}
          >
            <Typography sx={{ color: '#ccc' }} variant="h6">
              {t('error')}
            </Typography>
          </Grid>
          <Grid container item mt={1} xs={12} justifyContent={'center'}>
            <Grid item xs={12} md={3} sm={6}>
              <Typography
                sx={{
                  color: '#fff',
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                {t('errorMessage')}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            mt={2}
            sx={{
              display: 'block',
              textAlign: 'center',
              width: 'fit-content',
            }}
          >
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
              sx={{
                whiteSpace: 'nowrap',
                '&:disabled': {
                  opacity: 0.2,
                  cursor: 'not-allowed',
                  borderColor: '#1997c6',
                  color: '#fff',
                },
              }}
            >
              <RefreshOutlined sx={{ marginRight: '5px', fontSize: '20px' }} />
              {t('reload')}
            </Button>
          </Grid>
        </Grid>
      </Container>
    );
  }
};

export default ErrorBoundaryFallback;
