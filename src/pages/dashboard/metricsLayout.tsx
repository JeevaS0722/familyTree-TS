import React, { ReactElement, useEffect, useState } from 'react';
import { useLazyGetDashboardMetricsQuery } from '../../store/Services/dashboardService';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import { useAppSelector } from '../../store/hooks';
import {
  detectBrowserAndOS,
  PlatformInfo,
} from '../../utils/detectBrowserAndOS';
import MetricsPage from './metrics';

const MetricsPageOldDevice = React.lazy(
  () =>
    import(
      /* webpackChunkName: "metricsOldDevice" */ './metricsOldDevice/metricsOldDevice'
    )
);

const MetricsLayout: React.FC = () => {
  const [getMetrics, { isLoading: metricsLoading }] =
    useLazyGetDashboardMetricsQuery();
  const { layout } = useAppSelector(state => state.dashboard);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State to store detected platform information
  const [platform, setPlatform] = useState<PlatformInfo | null>(null);

  useEffect(() => {
    void getMetrics('', false);
    const detectedPlatform = detectBrowserAndOS();
    setPlatform(detectedPlatform);
  }, [getMetrics]);

  const MobileMetricTabLoader = (): ReactElement[] => {
    const components: ReactElement[] = layout.metrics.map(metric => (
      <Grid
        key={metric}
        item
        container
        sx={{ justifyContent: 'center' }}
        md={1}
        sm={3}
        xs={6}
      >
        <Skeleton variant="rectangular" height="30px" width="100px" />
      </Grid>
    ));

    return components;
  };

  const MetricsLoader = (): ReactElement[] => {
    if (isMobile && layout.metrics[0]) {
      return [
        <Grid item key={layout.metrics[0]} xs={12} md={3} sm={6}>
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="100%"
            height="170px"
          />
        </Grid>,
      ];
    } else {
      const components: ReactElement[] = layout.metrics.map(metric => (
        <Grid item key={metric} xs={12} md={3} sm={6}>
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="100%"
            height="170px"
          />
        </Grid>
      ));
      return components;
    }
  };

  // Function to determine whether to render old device metrics
  const shouldRenderOldDeviceMetrics = (): boolean => {
    if (!platform) {
      return true;
    }

    const { os, browser } = platform;
    const osName = os.name.toLowerCase();
    const osVersion = parseFloat(os.version);
    const browserName = browser.name.toLowerCase();
    const browserVersion = parseFloat(browser.version);

    // Render old device metrics if:
    // - Safari version below 15
    // OR
    // - iOS version below 15
    return (
      (browserName.toLowerCase() === 'safari' && browserVersion < 15) ||
      (osName.toLowerCase() === 'ios' && osVersion < 15)
    );
  };

  return (
    <>
      {metricsLoading ? (
        <Grid
          container
          justifyContent={'center'}
          sx={{ marginTop: '0px' }}
          spacing={2}
        >
          {isMobile && <MobileMetricTabLoader />}
          <MetricsLoader />
        </Grid>
      ) : (
        <>
          {shouldRenderOldDeviceMetrics() ? (
            <MetricsPageOldDevice />
          ) : (
            <MetricsPage />
          )}
        </>
      )}
    </>
  );
};

export default MetricsLayout;
