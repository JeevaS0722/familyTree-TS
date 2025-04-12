import React, { ReactElement, useState } from 'react';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import Typography from '@mui/material/Typography';
import ReactECharts from 'echarts-for-react';
import { useAppSelector } from '../../store/hooks';

const colour = ['rgba(40, 150, 255, 0.75)', 'rgba(60, 190, 125, 0.75)'];
const hoverColour = ['rgba(40, 150, 255, 1)', 'rgba(60, 190, 125, 1)'];

const MetricsPage: React.FC = () => {
  const metrics = useAppSelector(state => state.dashboard.metrics);
  const [active, setActive] = useState<number>(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (index: number) => {
    setActive(index);
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ marginTop: '0px' }}
      justifyContent="center"
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
              id={`${metric.metricName.split(' ').join('-')}-chip`}
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
                  id={`${metric.metricName.split(' ').join('-')}-chip-label`}
                >
                  {metric.metricName}
                </Typography>
              }
            />
          </Grid>
        ))}
      {metrics.map<ReactElement>((metric, index) => {
        if (isMobile && active !== index) {
          return <React.Fragment key={metric.metricName} />;
        }
        // Suppose these arrays come from your metric:
        const labelsArray = metric.data.map(m => m.firstName || m.fullName);
        const valuesArray = metric.data.map(m => m.count);

        // 1) Check if there’s any actual data (non-zero) or at least 1 item
        const hasData =
          labelsArray.length > 0 && valuesArray.some(v => v !== 0);

        // 2) Provide fallback category and value if no data
        const fallbackCategory = [' ']; // a single blank label
        const fallbackValue = [0]; // 0 value so the bar is invisible

        // 3) Decide which arrays to use
        const xCategories = hasData ? labelsArray : fallbackCategory;
        const yValues = hasData ? valuesArray : fallbackValue;

        // 4) If you want a fallback max if no data
        const realMaxVal = Math.max(...valuesArray, 0);
        const fallbackMax = 6; // or whatever suits your blank chart
        const yMax = hasData ? realMaxVal : fallbackMax;

        const option = {
          // Dark background like your old chart
          backgroundColor: '#252830',

          grid: {
            left: 10, // enough space for y-axis labels
            right: 10,
            top: 30, // space for legend
            bottom: 10,
            containLabel: true,
          },

          xAxis: {
            type: 'category',
            data: xCategories,
            boundaryGap: true, // bar won't flush left edge
            axisLine: {
              // White axis line
              lineStyle: { color: '#21242b' },
            },
            axisTick: {
              // Hide ticks or style them
              show: false,
            },
            splitLine: {
              // Hide vertical grid lines
              show: false,
            },
            axisLabel: {
              color: '#595a5b',
              fontSize: 12,
              interval: 0,
            },
          },

          yAxis: {
            type: 'value',
            min: 0,
            max: yMax, // fallback if no data
            axisLine: {
              lineStyle: { color: '#21242b' }, // White axis line
            },
            axisTick: {
              show: false,
            },
            // Faint horizontal grid lines
            splitLine: {
              show: true,
              lineStyle: { color: '#21242b' },
            },
            axisLabel: {
              color: '#595a5b',
              fontSize: 12,
              interval: 0,
              formatter: value => (value % 2 === 0 ? value : ''),
            },
          },

          tooltip: {
            trigger: 'item',
            // Dark background, white text
            backgroundColor: '#2F2F3A',
            textStyle: { color: '#FFF' },
            borderWidth: 0,
            borderRadius: 4,
            formatter: params => {
              return `
                <div style="padding: 1px; font-size: 12px;">
                  <!-- First line: bold item name -->
                  <div style="font-weight: bold; margin-bottom: 2px;">
                    ${params.name}
                  </div>
                  <!-- Second line: color box + series name & value -->
                  <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: ${params.color}; margin-right: 6px;"></div>
                    <div>
                      ${params.seriesName}: ${params.value}
                    </div>
                  </div>
                </div>
              `;
            },
          },

          // Legend at top center, always shown
          legend: {
            show: true,
            top: 0,
            left: 'center',
            textStyle: { color: '#595a5b' },
            data: [metric.metricName],
          },

          series: [
            {
              name: metric.metricName,
              type: 'bar',
              data: yValues,
              itemStyle: {
                color: colour[index % 2],
              },
              z: 9,
              emphasis: {
                itemStyle: {
                  color: hoverColour[index % 2],
                },
              },
            },
          ],
        };

        return (
          <Grid item key={metric.metricName} xs={12} md={3} sm={6}>
            <Card
              id={metric.metricName.split(' ').join('-')}
              sx={{
                padding: '10px',
                backgroundColor: '#252830',
                cursor: 'pointer',
              }}
            >
              <ReactECharts
                option={option}
                style={{ width: '100%', height: '150px' }}
              />
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default MetricsPage;
