import React, { ReactElement, useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import { useAppSelector } from '../../../store/hooks';
import Typography from '@mui/material/Typography';
import './metrics.css';

const colour = ['rgba(40, 150, 255, 0.75)', 'rgba(60, 190, 125, 0.75)'];

const MetricsPage: React.FC = () => {
  const metrics = useAppSelector(state => state.dashboard.metrics);
  const [active, setActive] = useState<number>(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State to handle the animated bar widths
  const [barWidths, setBarWidths] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const newBarWidths: { [key: string]: number } = {};
    metrics.forEach(metric => {
      const maxCount = Math.max(
        ...metric.data.map(metricValue => metricValue.count)
      );
      metric.data.forEach((metricValue, idx) => {
        const percentage = (metricValue.count / maxCount) * 100;
        newBarWidths[`${metric.metricName}-${idx}`] = percentage;
      });
    });
    // Delay to allow initial render before animation
    setTimeout(() => {
      setBarWidths(newBarWidths);
    }, 100);
  }, [metrics]);

  const handleChange = (index: number) => {
    setActive(index);
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ marginTop: '0px' }}
      justifyContent={'center'}
    >
      {isMobile &&
        metrics.map((metric, index) => (
          <Grid
            key={metric.metricName}
            item
            container
            sx={{ justifyContent: 'center' }}
            md={1}
            sm={3}
            xs={6}
          >
            <Chip
              onClick={() => handleChange(index)}
              id={metric.metricName?.split(' ')?.join('-') + '-chip'}
              sx={
                active === index
                  ? {
                      background: 'white',
                      ':focus': { background: 'white' },
                      color: 'black',
                    }
                  : {}
              }
              label={
                <Typography
                  sx={active === index ? { color: 'black' } : {}}
                  id={metric.metricName?.split(' ')?.join('-') + '-chip-label'}
                >
                  {metric.metricName}
                </Typography>
              }
            />
          </Grid>
        ))}
      {metrics.map<ReactElement>((metric, index) => {
        if (isMobile) {
          if (active !== index) {
            return <React.Fragment key={metric.metricName}></React.Fragment>;
          }
        }

        return (
          <Grid item key={metric.metricName} xs={12} md={3} sm={6}>
            <Card
              id={metric.metricName?.split(' ')?.join('-')}
              sx={{
                padding: '10px',
                backgroundColor: '#252830',
              }}
            >
              <Grid>
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{ color: '#fff' }}
                >
                  {metric.metricName}
                </Typography>
                <ul>
                  {metric.data.map((metricValue, idx) => {
                    const barWidth =
                      barWidths[`${metric.metricName}-${idx}`] || 0;
                    return (
                      <li key={idx}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={4}>
                            <Typography variant="body1" sx={{ color: '#fff' }}>
                              {metricValue.firstName || metricValue.fullName}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Grid
                              sx={{
                                width: '100%',
                                backgroundColor: '#e0e0e0',
                                borderRadius: '5px',
                                overflow: 'hidden',
                              }}
                            >
                              <Grid
                                sx={{
                                  height: '10px',
                                  width: `${barWidth}%`,
                                  backgroundColor: colour[index % 2],
                                  borderRadius: '5px',
                                  transition: 'width 1s ease-in-out',
                                }}
                              />
                            </Grid>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography
                              variant="body1"
                              align="right"
                              sx={{ color: '#fff' }}
                            >
                              {metricValue.count}
                            </Typography>
                          </Grid>
                        </Grid>
                      </li>
                    );
                  })}
                </ul>
              </Grid>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default MetricsPage;
