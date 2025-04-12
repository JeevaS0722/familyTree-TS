import React, { ReactElement, useEffect } from 'react';
import { useLazyGetDashboardActionsQuery } from '../../store/Services/dashboardService';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import ActionsPage from './actions';
import { useAppSelector } from '../../store/hooks';

const ActionsLayout: React.FC = () => {
  const [getAction, { isLoading: actionsLoading }] =
    useLazyGetDashboardActionsQuery();
  const { layout } = useAppSelector(state => state.dashboard);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    void getAction('');
  }, []);

  const MobileActionTabLoader = (): ReactElement[] => {
    const components: ReactElement[] = layout.actions.map(action => (
      <Grid
        key={action.actionName}
        item
        container
        justifyContent="center"
        md={1}
        sm={3}
        xs={6}
      >
        <Skeleton variant="rectangular" height="30px" width="100px" />
      </Grid>
    ));

    return components;
  };

  const ActionsLoader = (): ReactElement[] => {
    const components: ReactElement[] = [];
    if (isMobile && layout.actions[0]) {
      return layout.actions[0].data.map(action => (
        <Grid item key={action} xs={12} md={3} sm={6}>
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="100%"
            height="170px"
          />
        </Grid>
      ));
    } else if (layout) {
      layout.actions.forEach(action => {
        const actionComponents = action.data.map(actionItem => (
          <Grid item mt={2} key={actionItem}>
            <Skeleton
              animation="wave"
              variant="rectangular"
              width="100%"
              height="100px"
            />
          </Grid>
        ));

        components.push(
          <Grid key={action.actionName} item xs={12} md={3} sm={6}>
            <Typography
              sx={{
                textAlign: 'center',
                borderBottom: '1px solid #fff',
                lineHeight: '0.1em',
              }}
            >
              <Box
                component="span"
                sx={{
                  padding: '0 10px',
                  backgroundColor: '#10141F',
                }}
              >
                {action.actionName}
              </Box>
            </Typography>
            {actionComponents}
          </Grid>
        );
      });
    }

    return components;
  };

  return (
    <>
      {actionsLoading ? (
        <Grid
          container
          justifyContent={'center'}
          sx={{ marginTop: '0px' }}
          spacing={2}
        >
          {isMobile && <MobileActionTabLoader />}
          <ActionsLoader />
        </Grid>
      ) : (
        <>
          <ActionsPage />
        </>
      )}
    </>
  );
};

export default ActionsLayout;
