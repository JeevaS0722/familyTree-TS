/* eslint-disable complexity */
import React from 'react';
import Grid from '@mui/material/Grid';
import './style.css';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import {
  Chip,
  CircularProgress,
  createTheme,
  IconButton,
  Skeleton,
  Button,
} from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';
import ListIcon from '@mui/icons-material/List';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { severity } from '../../../../interface/snackbar';
import Tooltip from '@mui/material/Tooltip';
import { open } from '../../../../store/Reducers/snackbar';
import { TableColumns, TableData } from '../../../../interface/common';
import { Table } from '../../../../component/Table';
import {
  useGetAllNewWellCountMutation,
  useUpdateGoalMutation,
} from '../../../../store/Services/dashboardService';
import { useLogoutMutation } from '../../../../store/Services/auth';
import {
  GoalsSectionProps,
  UpdateGoalRequest,
} from '../../../../interface/draftDue';
import { departments } from '../../../../utils/GeneralUtil';
import ReactECharts from 'echarts-for-react';
import {
  setTableVisibleColumns,
  setColumnOrder,
} from '../../../../store/Reducers/tableReducer';
import { customHeaderEditFormatter } from '../../../../component/Table/utils/headerUtils';

const customTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1380,
      xl: 1536,
    },
  },
});

export interface SectionRendererProps {
  section: 'newWells' | 'offers' | 'deals';
  viewMode: 'list' | 'bar';
  data: TableData[];
  columns: TableColumns[];
  count: number;
  initialLoading: boolean;
  loading: boolean;
  onCellValueChanged: (event: any) => Promise<void>;
  onHeaderValueChange: (
    field: string,
    newValue: string,
    oldValue: string,
    visibleColumns: Array<string>,
    columnOrder: Array<string>
  ) => void;
  handleViewModeToggle: (
    mode: 'list' | 'bar',
    section: 'newWells' | 'offers' | 'deals'
  ) => void;
  handleOpenChartModal: (section: 'newWells' | 'offers' | 'deals') => void;
  getTableRowBackgroundColor: () => string;
  currentYearField: string;
  hiddenMonths: string[];
  onLegendClick: (month: string) => void;
  onResetLegends: () => void;
}

const isUserAuthorized = (department: string) =>
  department === departments[0] || department === departments[5];

const updateGoalData = async (
  section: 'newWells' | 'offers' | 'deals',
  payload: UpdateGoalRequest,
  updateGoal: any,
  getAllWellCount: any,
  dispatch: (action: ReturnType<typeof open>) => void,
  setData: any,
  previousData: any,
  transformGoalCountData: (apiData: any) => TableData[],
  successMessage: string
) => {
  const result = await updateGoal(payload).unwrap();
  if (result.success) {
    dispatch(open({ severity: severity.success, message: successMessage }));
    const refreshedData = await getAllWellCount().unwrap();
    if (refreshedData.success && refreshedData.data) {
      const sectionKey =
        section === 'newWells'
          ? 'WellCountDetails'
          : `${section.charAt(0).toUpperCase() + section.slice(1)}CountDetails`;
      setData((prev: any) => ({
        ...prev,
        [section]: {
          ...prev[section],
          data: transformGoalCountData(
            refreshedData.data[sectionKey as keyof typeof refreshedData.data]
          ),
          headers: (
            refreshedData.data[
              sectionKey as keyof typeof refreshedData.data
            ] as Array<{ year: string; goal?: string }>
          ).reduce(
            (
              acc: { [key: string]: string },
              entry: { year: string; goal?: string }
            ) => {
              const goalValue = !entry?.goal ? '0' : entry.goal;
              acc[`${entry.year} - ${goalValue}`] = goalValue;
              return acc;
            },
            {}
          ),
        },
      }));
    }
  } else {
    throw new Error('API returned unsuccessful response');
  }
};

const transformTableDataToChartData = (
  tableData: TableData[],
  columns: TableColumns[]
) => {
  const chartFields = columns
    .filter(col => col.field !== 'month')
    .map(col => col.field);
  const chartData = chartFields.map(field => {
    const dataPoint: { [key: string]: any } = { name: field };
    tableData.forEach(row => {
      dataPoint[row.month] = row[field] !== null ? Number(row[field]) : 0;
    });
    return dataPoint;
  });
  return chartData;
};

const MONTH_COLORS = [
  '#1f77b4', // blue
  '#ff7f0e', // orange
  '#2ca02c', // green
  '#d62728', // red
  '#9467bd', // purple
  '#8c564b', // brown
  '#e377c2', // pink
  '#17becf', // cyan
  '#bcbd22', // yellow-green
  '#7b4173', // deep purple
  '#aec7e8', // light blue
  '#ffbb78', // light orange
];

const monthColorMap: { [month: string]: string } = {
  January: '#1f77b4', // blue
  February: '#ff7f0e', // orange
  March: '#2ca02c', // green
  April: '#d62728', // red
  May: '#9467bd', // purple
  June: '#8c564b', // brown
  July: '#e377c2', // pink
  August: '#17becf', // cyan
  September: '#bcbd22', // yellow-green
  October: '#7b4173', // deep purple
  November: '#aec7e8', // light blue
  December: '#ffbb78', // light orange
};

const hoverColorMap: { [month: string]: string } = {
  January: '#1f77b4',
  February: '#ff7f0e',
  March: '#2ca02c',
  April: '#d62728',
  May: '#9467bd',
  June: '#8c564b',
  July: '#e377c2',
  August: '#17becf',
  September: '#bcbd22',
  October: '#7b4173',
  November: '#aec7e8',
  December: '#ffbb78',
};

const monthShortNames: { [key: string]: string } = {
  January: 'Jan',
  February: 'Feb',
  March: 'Mar',
  April: 'Apr',
  May: 'May',
  June: 'Jun',
  July: 'Jul',
  August: 'Aug',
  September: 'Sep',
  October: 'Oct',
  November: 'Nov',
  December: 'Dec',
};

interface CustomLegendProps {
  visibleMonths: string[];
  dimmedMonths: string[];
  onLegendClick: (month: string) => void;
}

const CustomLegend: React.FC<CustomLegendProps> = ({
  visibleMonths,
  dimmedMonths,
  onLegendClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: isMobile ? '10px' : '15px',
      }}
    >
      {visibleMonths.map(month => {
        const isDimmed = dimmedMonths.includes(month);
        return (
          <Box
            key={month}
            onClick={() => onLegendClick(month)}
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <Box
              sx={{
                width: 25,
                height: 15,
                backgroundColor: isDimmed
                  ? 'rgba(255,255,255,0.4)'
                  : monthColorMap[month] || 'rgba(40, 150, 255, 0.75)',
                mr: 1,
              }}
            />
            <Typography
              sx={{
                color: isDimmed ? 'rgba(255,255,255,0.5)' : '#FFF',
                fontSize: 16,
                textDecoration: isDimmed ? 'line-through' : 'none',
              }}
            >
              {monthShortNames[month] || month}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export const SectionRenderer: React.FC<SectionRendererProps> = ({
  section,
  viewMode,
  data,
  columns,
  count,
  initialLoading,
  loading,
  onCellValueChanged,
  handleViewModeToggle,
  handleOpenChartModal,
  getTableRowBackgroundColor,
  onHeaderValueChange,
  currentYearField,
  hiddenMonths,
  onLegendClick,
  onResetLegends,
}) => {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();
  const [, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const auth = useAppSelector(state => state.auth);
  const relevantYears = [currentYear, currentYear - 1, currentYear - 2];
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMeduimScreen = useMediaQuery(
    customTheme.breakpoints.between('md', 'lg')
  );
  const filteredColumns = columns.filter(col => {
    if (col.field === 'month') {
      return true;
    }
    const year = parseInt(col.field.split(' - ')[0]);
    return relevantYears.includes(year);
  });

  const fullChartData = transformTableDataToChartData(data, filteredColumns);

  const visibleMonths =
    fullChartData.length > 0
      ? Object.keys(fullChartData[0]).filter(
          key => key !== 'name' && !hiddenMonths.includes(key)
        )
      : [];
  const allMonths =
    fullChartData.length > 0
      ? Object.keys(fullChartData[0]).filter(key => key !== 'name')
      : [];

  const filteredFullChartData = fullChartData.map((item: any) => {
    const newItem: any = { name: item.name };
    visibleMonths.forEach(key => {
      newItem[key] = item[key];
    });
    return newItem;
  });

  const allValues = filteredFullChartData.flatMap((obj: any) =>
    visibleMonths.map(key => obj[key])
  );
  const maxVal = Math.max(...allValues, 0);

  const onToggleClick = (mode: 'list' | 'bar') => {
    handleViewModeToggle(mode, section);
  };

  const handleHeaderValueChanged = (params: {
    colId: string;
    oldValue: string;
    newValue: string;
    visibleColumns: string[];
    columnOrder: string[];
  }) => {
    const field = params.colId;
    onHeaderValueChange(
      field,
      params.newValue,
      params.oldValue,
      params.visibleColumns,
      params.columnOrder
    );
  };

  if (initialLoading || isLogoutLoading || !auth.isLoggedIn) {
    return (
      <Box sx={{ width: '100%' }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={450}
          sx={{ bgcolor: '#252830' }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        position: 'relative',
      }}
    >
      {viewMode === 'bar' && (
        <Button
          variant="outlined"
          color="primary"
          onClick={onResetLegends}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            whiteSpace: 'nowrap',
            zIndex: 1000,
            minWidth: '60px',
          }}
        >
          Reset
        </Button>
      )}
      <Box sx={{ width: '100%', flex: '1 1 auto' }}>
        {viewMode === 'list' ? (
          data.length > 0 && columns.length > 0 ? (
            <Table
              tableId={section}
              key={`${section}_${isMeduimScreen}`}
              data={data.length > 0 ? data : []}
              count={count}
              columns={columns}
              initialLoading={initialLoading}
              loading={loading}
              onCellValueChanged={onCellValueChanged}
              onHeaderValueChanged={handleHeaderValueChanged}
              isWithoutPagination={true}
              getTableRowBackgroundColor={getTableRowBackgroundColor}
              getTextColor={'white'}
              headerEditMode="partial"
              fixedColumns={[`${section}_month`]}
              defaultPinnedColumns={
                isMeduimScreen ? [] : [`${section}_${currentYearField}`]
              }
              headerEditFormatter={customHeaderEditFormatter}
              height="400px"
            />
          ) : (
            <Box sx={{ width: '100%' }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={450}
                sx={{ bgcolor: '#252830' }}
              />
            </Box>
          )
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '400px',
              border: '1px solid #FFF',
              backgroundColor: '#10141F',
              position: 'relative',
              marginTop: '50px',
              padding: '40px 10px 10px 10px',
            }}
          >
            {isMobile ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'absolute',
                  top: 8,
                  left: 0,
                  right: 0,
                  zIndex: 3,
                  px: 1,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: '#FFFFFF',
                    flex: 1,
                    textAlign: 'center',
                    position: 'static',
                  }}
                >
                  {section === 'newWells'
                    ? 'New Wells'
                    : section === 'offers'
                      ? 'Offers'
                      : 'Deals'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tooltip title="View Fullscreen" placement="bottom">
                    <IconButton
                      onClick={() => handleOpenChartModal(section)}
                      sx={{
                        color: '#FFF',
                        zIndex: 3,
                        position: 'static',
                      }}
                    >
                      <FullscreenIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ) : (
              <>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#FFFFFF',
                    position: 'absolute',
                    top: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 3,
                  }}
                >
                  {section === 'newWells'
                    ? 'New Wells'
                    : section === 'offers'
                      ? 'Offers'
                      : 'Deals'}
                </Typography>
                <Tooltip title="View Fullscreen" placement="bottom">
                  <IconButton
                    onClick={() => handleOpenChartModal(section)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 48,
                      color: '#FFF',
                      zIndex: 3,
                    }}
                  >
                    <FullscreenIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            <Box
              sx={{
                position: 'absolute',
                bottom: 10,
                zIndex: 2,
                backgroundColor: '#10141F',
              }}
            >
              <CustomLegend
                visibleMonths={allMonths}
                dimmedMonths={hiddenMonths}
                onLegendClick={onLegendClick}
              />
            </Box>

            <ReactECharts
              key={hiddenMonths.join(',')}
              option={{
                tooltip: {
                  trigger: 'item',
                  formatter: (params: any) => {
                    return `
          <div style="background: white; padding: 10px; border-radius: 5px; text-align: center; color: white;">
            <div style="font-size: 18px; font-weight: bold; color: black; margin-bottom: 8px;">
              ${params.name}
            </div>
            <div style="display: flex; align-items: center; justify-content: center;">
              <div style="width: 12px; height: 12px; background-color: ${params.color}; margin-right: 8px;"></div>
              <div style="font-size: 16px; color: black;">
                ${params.seriesName}: ${params.value}
              </div>
            </div>
          </div>
        `;
                  },
                },
                grid: {
                  left: '5%',
                  right: '5%',
                  top: 20,
                  bottom: isMobile ? 180 : 140,
                  containLabel: true,
                },
                xAxis: {
                  type: 'category',
                  data: filteredFullChartData.map((item: any) => item.name),
                  axisLabel: {
                    color: '#FFF',
                  },
                  axisLine: { lineStyle: { color: '#FFF' } },
                },
                yAxis: {
                  type: 'value',
                  min: 0,
                  max: maxVal,
                  axisLabel: { color: '#FFF' },
                  axisLine: { lineStyle: { color: '#FFF' } },
                },
                series: visibleMonths.map(month => ({
                  name: month,
                  type: 'bar',
                  data: filteredFullChartData.map(
                    (item: any) => item[month] ?? 0
                  ),
                  itemStyle: {
                    color: monthColorMap[month] || '#1f77b4',
                  },
                  barMaxWidth: 50,
                })),
              }}
              style={{ width: '100%', height: 400 }}
            />
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          zIndex: 1000,
          marginTop: 0,
          marginBottom: 0,
        }}
      >
        <Tooltip title="List View" placement="bottom">
          <Box
            onClick={() => onToggleClick('list')}
            sx={{
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              p: 1,
              backgroundColor: viewMode === 'list' ? '#252830' : 'transparent',
              border: '1px solid rgb(240, 241, 242)',
              borderRight: 'none',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: viewMode === 'list' ? '#252830' : '#000000',
              },
              zIndex: 1001,
            }}
          >
            <ListIcon
              sx={{
                fontSize: '20px',
                color: viewMode === 'list' ? '#1976d2' : '#FFF',
              }}
            />
          </Box>
        </Tooltip>
        <Tooltip title="Bar Chart View" placement="bottom">
          <Box
            onClick={() => onToggleClick('bar')}
            sx={{
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              p: 1,
              backgroundColor: viewMode === 'bar' ? '#252830' : 'transparent',
              border: '1px solid rgb(240, 241, 242)',
              borderLeft: 'none',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: viewMode === 'bar' ? '#252830' : '#000000',
              },
              zIndex: 1001,
            }}
          >
            <BarChartIcon
              sx={{
                fontSize: '20px',
                color: viewMode === 'bar' ? '#1976d2' : '#FFF',
              }}
            />
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};

const GoalsSection: React.FC<GoalsSectionProps> = ({
  active = 0,
  section,
  handleChange,
  isMobileOrTablet,
}) => {
  const [viewModes, setViewModes] = React.useState<{
    newWells: 'list' | 'bar';
    offers: 'list' | 'bar';
    deals: 'list' | 'bar';
  }>({
    newWells: 'list',
    offers: 'list',
    deals: 'list',
  });
  const [hiddenMonthsBySection, setHiddenMonthsBySection] = React.useState<{
    newWells: string[];
    offers: string[];
    deals: string[];
  }>({
    newWells: [],
    offers: [],
    deals: [],
  });
  const [isSectionSwitchLoading, setIsSectionSwitchLoading] =
    React.useState(false);
  const [data, setData] = React.useState<{
    newWells: {
      data: TableData[];
      headers: { [key: string]: string };
      viewMode: 'list' | 'bar';
    };
    offers: {
      data: TableData[];
      headers: { [key: string]: string };
      viewMode: 'list' | 'bar';
    };
    deals: {
      data: TableData[];
      headers: { [key: string]: string };
      viewMode: 'list' | 'bar';
    };
  }>({
    newWells: { data: [], headers: {}, viewMode: 'list' },
    offers: { data: [], headers: {}, viewMode: 'list' },
    deals: { data: [], headers: {}, viewMode: 'list' },
  });
  const [isChartModalOpen, setIsChartModalOpen] = React.useState(false);
  const [activeChartSection, setActiveChartSection] = React.useState<
    'newWells' | 'offers' | 'deals' | null
  >(null);
  const [isGoalCountLoading, setIsGoalCountLoading] = React.useState(true);
  const [chipActions, setChipActions] = React.useState<
    { actionName: string }[]
  >([]);
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const [getAllWellCount] = useGetAllNewWellCountMutation();
  const [updateGoal] = useUpdateGoalMutation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const transformGoalCountData = (apiData: any): TableData[] => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const dataArray = Array.isArray(apiData) ? apiData : [apiData];
    const yearData: {
      [year: string]: { goal: string } & { [month: string]: number };
    } = {};

    dataArray.forEach(entry => {
      const yearKey = entry.year ?? new Date().getFullYear().toString();
      const goalValue = !entry?.goal ? '0' : entry.goal;
      if (!yearData[yearKey]) {
        yearData[yearKey] = { goal: goalValue };
        months.forEach(month => {
          const monthKey = month.toLowerCase();
          yearData[yearKey][monthKey] =
            entry[monthKey] === null ? 0 : (entry[monthKey] ?? 0);
        });
      }
    });

    const result = months.map((month, index) => {
      const row: TableData = { id: index + 1, month };
      Object.keys(yearData).forEach(year => {
        const yearGoalKey = `${year} - ${yearData[year].goal}`;
        const value = yearData[year][month.toLowerCase()];
        row[yearGoalKey] = value;
      });
      return row;
    });
    return result;
  };

  const fetchCombinedData = async () => {
    setIsGoalCountLoading(true);
    try {
      const result = await getAllWellCount().unwrap();
      if (result.success && result.data) {
        setData(prev => ({
          ...prev,
          newWells: {
            ...prev.newWells,
            data: transformGoalCountData(result.data.WellCountDetails || []),
            headers: (result.data.WellCountDetails || []).reduce(
              (acc: { [key: string]: string }, entry: any) => {
                const year = !entry?.year ? '0' : entry.year;
                const goal = !entry?.goal ? '0' : entry.goal;
                acc[`${year} - ${goal}`] = goal.toString();
                return acc;
              },
              {}
            ),
          },
          offers: {
            ...prev.offers,
            data: transformGoalCountData(result.data.OffersCountDetails || []),
            headers: (result.data.OffersCountDetails || []).reduce(
              (acc: { [key: string]: string }, entry: any) => {
                const year = !entry?.year ? '0' : entry.year;
                const goal = !entry?.goal ? '0' : entry.goal;
                acc[`${year} - ${goal}`] = goal.toString();
                return acc;
              },
              {}
            ),
          },
          deals: {
            ...prev.deals,
            data: transformGoalCountData(result.data.DealsCountDetails || []),
            headers: (result.data.DealsCountDetails || []).reduce(
              (acc: { [key: string]: string }, entry: any) => {
                const year = !entry?.year ? '0' : entry.year;
                const goal = !entry?.goal ? '0' : entry.goal;
                acc[`${year} - ${goal}`] = goal.toString();
                return acc;
              },
              {}
            ),
          },
        }));
        setChipActions(result.data.chipActions || []);
      } else {
        setData(prev => ({
          ...prev,
          newWells: { ...prev.newWells, data: [], headers: {} },
          offers: { ...prev.offers, data: [], headers: {} },
          deals: { ...prev.deals, data: [], headers: {} },
        }));
        setChipActions([]);
      }
    } catch (error) {
      dispatch(
        open({
          severity: severity.error,
          message: 'Failed to load initial data.',
        })
      );
    } finally {
      setIsGoalCountLoading(false);
    }
  };

  React.useEffect(() => {
    void fetchCombinedData();
  }, [getAllWellCount]);

  const handleViewModeToggle = (
    mode: 'list' | 'bar',
    section: 'newWells' | 'offers' | 'deals'
  ) => {
    setViewModes(prev => {
      const newViewModes = { ...prev, [section]: mode };
      return newViewModes;
    });

    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        viewMode: mode,
      },
    }));

    if (isMobile || isTablet) {
      const newActive =
        section === 'newWells' ? 1 : section === 'offers' ? 2 : 3;
      handleChange && handleChange(newActive);
    } else {
      const newActive =
        section === 'newWells' ? 0 : section === 'offers' ? 1 : 2;
      handleChange && handleChange(newActive);
    }
  };

  const handleCellEdit = async (
    event: any,
    section: 'newWells' | 'offers' | 'deals'
  ) => {
    if (
      !isUserAuthorized(user.department || '') ||
      event.newValue === event.oldValue
    ) {
      return;
    }

    const {
      data: rowData,
      colDef,
      newValue,
      oldValue,
    } = event as {
      data: { month: string; [key: string]: any };
      colDef: { field: string };
      newValue: string | number | null;
      oldValue?: string | number | null;
    };

    if (!rowData) {
      await handleHeaderEdit(event, section);
      return;
    }
    const integerRegex = /^-?\d+$/;
    const value = event?.newValue || 0;
    if (
      (typeof value === 'string' && !integerRegex.test(value)) ||
      (typeof value === 'number' && !Number.isInteger(value)) ||
      String(value).includes('.')
    ) {
      setData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          data: prev[section].data.map(r =>
            r.id === event.data.id
              ? { ...r, [event.colDef.field]: event.oldValue }
              : r
          ),
        },
      }));
      return;
    }

    const [yearStr, goalStr] = colDef.field.split(' - ');
    const year = Number(yearStr);
    const goal = goalStr === '' ? '' : goalStr;
    const month =
      typeof rowData.month === 'string' ? rowData.month.toLowerCase() : '';
    const previousData = JSON.parse(JSON.stringify(data[section].data));
    const previousValue =
      oldValue !== undefined
        ? oldValue
        : (previousData.find((r: any) => r.id === rowData.id)?.[colDef.field] ??
          null);

    if (!rowData.month) {
      return;
    }

    const updatedRowWithLoading = { ...rowData, [colDef.field]: 'LOADING' };
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        data: prev[section].data.map(r =>
          r.id === rowData.id ? updatedRowWithLoading : r
        ),
      },
    }));

    const updatePayload: UpdateGoalRequest = {
      year,
      goal,
      section: section === 'newWells' ? 'well' : section,
      [month]: newValue === '' ? null : Number(newValue),
    };

    try {
      await updateGoalData(
        section,
        updatePayload,
        updateGoal,
        getAllWellCount,
        dispatch,
        setData,
        previousData,
        transformGoalCountData,
        `${section.charAt(0).toUpperCase() + section.slice(1)} goal updated successfully`
      );
    } catch (error) {
      setData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          data: prev[section].data.map(r =>
            r.id === rowData.id ? { ...r, [colDef.field]: previousValue } : r
          ),
        },
      }));
    }
  };

  const handleHeaderEdit = async (
    event: any,
    section: 'newWells' | 'offers' | 'deals'
  ) => {
    const {
      fileId,
      colId,
      newValue: newHeaderValue,
      visibleColumns,
      columnOrder,
      oldValue,
    } = event;
    const field =
      fileId || colId || event.colDef?.field || event.colDef?.colId || '';
    if (!field) {
      return;
    }

    const [year, oldGoal] = oldValue.split(' - ').map(part => part.trim());

    const newGoalValue =
      newHeaderValue === null || newHeaderValue === undefined
        ? '0'
        : newHeaderValue.includes(' - ')
          ? newHeaderValue.split(' - ')[1]?.trim() || '0'
          : newHeaderValue.trim() === year
            ? '0'
            : newHeaderValue.trim() || '0';

    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        headers: { ...prev[section].headers, [oldValue]: 'LOADING' },
      },
    }));

    const updatePayload: UpdateGoalRequest = {
      year: Number(year),
      goal: newGoalValue,
      section: section === 'newWells' ? 'well' : section,
    };

    try {
      await updateGoalData(
        section,
        updatePayload,
        updateGoal,
        getAllWellCount,
        dispatch,
        setData,
        null,
        transformGoalCountData,
        `${section.charAt(0).toUpperCase() + section.slice(1)} goal updated successfully`
      );
      const newVisibleColumns = visibleColumns.filter(c => c !== colId);
      const columnNewOrder = columnOrder.map(c => {
        if (c === colId) {
          return `${section}_${year} - ${newGoalValue}`;
        }
        return c;
      });
      dispatch(
        setColumnOrder({
          tableId: section,
          columns: [...columnNewOrder],
        })
      );
      dispatch(
        setTableVisibleColumns({
          tableId: section,
          columns: [
            ...newVisibleColumns,
            `${section}_${year} - ${newGoalValue}`,
          ],
        })
      );
    } catch (error) {
      const revertedValue = `${year} - 0`;
      setData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          headers: { ...prev[section].headers, [colId]: revertedValue },
        },
      }));
    }
  };

  const generateColumns = (section: 'newWells' | 'offers' | 'deals') => {
    const sortedYearGoals = Object.keys(data[section].headers).sort(
      (a, b) => Number(b.split(' - ')[0]) - Number(a.split(' - ')[0])
    );
    const customCellRenderer = (params: any) => {
      if (params.value === 'LOADING') {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: '40px',
              overflow: 'visible',
              position: 'relative',
            }}
          >
            <CircularProgress size={20} sx={{ color: '#FFF' }} />
          </Box>
        );
      }
      return params.value !== undefined && params.value !== null
        ? params.value.toString()
        : '';
    };

    const columns: TableColumns[] = [
      {
        headerName: 'Goal',
        field: 'month',
        colId: `${section}_month`,
        width: 140,
        sortable: false,
        pinned: 'left',
        cellStyle: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          whiteSpace: 'normal',
          minHeight: '40px',
        },
      },
      ...sortedYearGoals.map(yearGoal => {
        return {
          headerName: yearGoal,
          field: yearGoal,
          colId: `${section}_${yearGoal}`,
          width: 140,
          editable: isUserAuthorized(user.department || ''),
          sortable: false,
          headerEdit: isUserAuthorized(user.department || ''),
          headerEditMode: 'partial',
          cellRenderer: customCellRenderer,
          cellEditor: 'agNumberCellEditor',
          cellEditorParams: {
            precision: 0,
          },
          cellStyle: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'normal',
            minHeight: '40px',
          },
          valueFormatter: (params: any) =>
            params.value === 'LOADING'
              ? ''
              : params.value !== undefined && params.value !== null
                ? params.value.toString()
                : '',
        };
      }),
    ];

    const currentYear = new Date().getFullYear().toString();
    const currentYearField =
      columns.find(col => col.field.startsWith(currentYear))?.field ||
      `${currentYear} - '0'`;
    return { columns, currentYearField };
  };

  const sectionColumns = React.useMemo(() => {
    return {
      newWells: generateColumns('newWells'),
      offers: generateColumns('offers'),
      deals: generateColumns('deals'),
    };
  }, [
    data.newWells.headers,
    data.offers.headers,
    data.deals.headers,
    user.department,
  ]);

  const handleOpenChartModal = (section: 'newWells' | 'offers' | 'deals') => {
    setActiveChartSection(section);
    setIsChartModalOpen(true);
  };

  const handleCloseChartModal = () => {
    setIsChartModalOpen(false);
    setActiveChartSection(null);
  };

  const handleLegendClick = (
    month: string,
    section: 'newWells' | 'offers' | 'deals'
  ) => {
    setHiddenMonthsBySection(prev => ({
      ...prev,
      [section]: prev[section].includes(month)
        ? prev[section].filter(m => m !== month)
        : [...prev[section], month],
    }));
  };

  const handleResetLegends = (section: 'newWells' | 'offers' | 'deals') => {
    setHiddenMonthsBySection(prev => ({
      ...prev,
      [section]: [],
    }));
  };

  interface FullscreenChartModalProps {
    hiddenMonths: string[];
    onLegendClick: (month: string) => void;
    onResetLegends: () => void;
    data: {
      [key: string]: {
        data: TableData[];
      };
    };
    activeChartSection: 'newWells' | 'offers' | 'deals' | null;
    sectionColumns: {
      [key: string]: {
        columns: TableColumns[];
      };
    };
    isChartModalOpen: boolean;
    handleCloseChartModal: () => void;
  }

  const FullscreenChartModal: React.FC<FullscreenChartModalProps> = ({
    hiddenMonths,
    onLegendClick,
    onResetLegends,
    data,
    activeChartSection,
    sectionColumns,
    isChartModalOpen,
    handleCloseChartModal,
  }) => {
    if (!activeChartSection) {
      return null;
    }
    const fullChartData = transformTableDataToChartData(
      data[activeChartSection].data,
      sectionColumns[activeChartSection].columns
    );
    const visibleMonths =
      fullChartData.length > 0
        ? Object.keys(fullChartData[0]).filter(
            key => key !== 'name' && !hiddenMonths.includes(key)
          )
        : [];
    const allMonths =
      fullChartData.length > 0
        ? Object.keys(fullChartData[0]).filter(key => key !== 'name')
        : [];

    const filteredFullChartData = fullChartData.map((item: any) => {
      const newItem: any = { name: item.name };
      visibleMonths.forEach(key => {
        newItem[key] = item[key];
      });
      return newItem;
    });

    const allValues = filteredFullChartData.flatMap((obj: any) =>
      visibleMonths.map(key => obj[key])
    );
    const maxVal = Math.max(...allValues, 0);

    const chartWidth = Math.max(filteredFullChartData.length * 200, 1000);
    const commonHeight = 'calc(100vh - 200px)';
    const gridTop = 20,
      gridBottom = 80;

    const leftOption = {
      grid: {
        left: isMobile ? 70 : 90,
        right: 0,
        top: 20,
        bottom: isMobile ? 60 : 80,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        data: ['Placeholder'],
        show: false,
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: maxVal,
        axisLine: {
          show: true,
          lineStyle: { color: '#FFF' },
        },
        axisTick: { show: true },
        axisLabel: {
          show: true,
          color: '#FFF',
        },
        splitLine: { show: false },
      },
      series: [
        {
          name: 'dummy',
          type: 'bar',
          data: [0],
          barWidth: '50%',
          itemStyle: { color: 'transparent' },
        },
      ],
      tooltip: { show: false },
    };

    const rightOption = {
      tooltip: {
        trigger: 'item',
        formatter: params => {
          return `
            <div style="background: white; padding: 10px; border-radius: 5px; text-align: center; color: white;">
              <div style="font-size: 18px; font-weight: bold; color: black; margin-bottom: 8px;">
                ${params.name}
              </div>
              <div style="display: flex; align-items: center; justify-content: center;">
                <div style="width: 12px; height: 12px; background-color: ${params.color}; margin-right: 8px;"></div>
                <div style="font-size: 16px; color: black;">
                  ${params.seriesName}: ${params.value}
                </div>
              </div>
            </div>
          `;
        },
      },
      grid: { left: 0, right: 20, top: gridTop, bottom: gridBottom },
      xAxis: {
        type: 'category',
        data: filteredFullChartData.map(item => item.name),
        axisTick: { alignWithLabel: true },
        axisLine: { lineStyle: { color: '#FFF' } },
        axisLabel: { color: '#FFF', interval: 0 },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: maxVal,
        axisLine: { lineStyle: { color: '#FFF' } },
        axisTick: { show: false },
        axisLabel: { color: '#FFF' },
      },
      series: visibleMonths.map(month => ({
        name: month,
        type: 'bar',
        data: filteredFullChartData.map(item => item[month]),
        itemStyle: { color: monthColorMap[month] },
        emphasis: {
          itemStyle: { color: hoverColorMap[month] },
        },
      })),
    };

    return (
      <Modal
        open={isChartModalOpen}
        onClose={handleCloseChartModal}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: '#10141F',
        }}
      >
        <Box
          sx={{
            width: '100vw',
            height: '100vh',
            position: 'relative',
            bgcolor: '#10141F',
            display: 'flex',
            flexDirection: 'column',
            p: '40px 10px 10px 10px',
            boxSizing: 'border-box',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'absolute',
              top: 8,
              left: 0,
              right: 0,
              zIndex: 3,
              justifyContent: 'space-between',
              px: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#FFF',
                flex: 1,
                textAlign: 'center',
              }}
            >
              {activeChartSection === 'newWells'
                ? 'New Wells'
                : activeChartSection === 'offers'
                  ? 'Offers'
                  : 'Deals'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={onResetLegends}
                sx={{
                  whiteSpace: 'nowrap',
                  marginLeft: '5px',
                }}
              >
                Reset
              </Button>
              <Tooltip title="Close Fullscreen">
                <IconButton
                  onClick={handleCloseChartModal}
                  sx={{
                    color: '#FFF',
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: 60,
              zIndex: 2,
              backgroundColor: '#10141F',
              textAlign: 'center',
              width: '100%',
            }}
          >
            <CustomLegend
              visibleMonths={allMonths}
              dimmedMonths={hiddenMonths}
              onLegendClick={onLegendClick}
            />
          </Box>
          <Box sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'row' }}>
            <Box sx={{ width: 100, overflow: 'hidden' }}>
              <ReactECharts
                option={leftOption}
                style={{ width: '100%', height: commonHeight }}
              />
            </Box>
            <Box
              sx={{
                width: isMobile ? `calc(100vw - 100px)` : `calc(100vw - 200px)`,
                overflowX: 'auto',
              }}
            >
              <ReactECharts
                option={rightOption}
                style={{ width: chartWidth, height: commonHeight }}
              />
            </Box>
          </Box>
        </Box>
      </Modal>
    );
  };

  let counter = 0;
  const getTableRowBackgroundColor = () => {
    counter++;
    return counter % 2 === 0 ? '#434857' : '#252830';
  };

  const RenderMobileTabletChips = () => (
    <Grid
      container
      item
      spacing={1}
      justifyContent="center"
      alignItems="center"
    >
      {isGoalCountLoading ? (
        chipActions.map((_, index) => (
          <Grid
            key={`skeleton-chip-${index}`}
            item
            container
            sx={{ justifyContent: 'center' }}
            md={1}
            sm={3}
            xs={6}
          >
            <Skeleton variant="rectangular" width={100} height={32} />
          </Grid>
        ))
      ) : (
        <>
          {chipActions.map((action, index) => (
            <Grid
              key={action.actionName}
              item
              container
              sx={{ justifyContent: 'center' }}
              md={1}
              sm={3}
              xs={6}
            >
              <Chip
                onClick={() => handleChange && handleChange(index)}
                id={action.actionName?.split(' ')?.join('-') + '-chip'}
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
                    sx={{ color: active === index ? 'black' : undefined }}
                  >
                    {action.actionName}
                  </Typography>
                }
              />
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );

  const RenderSectionContent = () => {
    const effectiveSection =
      section ||
      (active === 0 ? 'newWells' : active === 1 ? 'offers' : 'deals');
    const { columns, currentYearField } = sectionColumns[effectiveSection];

    const sectionProps: SectionRendererProps = {
      section: effectiveSection,
      viewMode: viewModes[effectiveSection],
      data: data[effectiveSection].data,
      columns,
      count: data[effectiveSection].data.length,
      initialLoading: isGoalCountLoading,
      loading: isSectionSwitchLoading,
      onCellValueChanged: event => handleCellEdit(event, effectiveSection),
      onHeaderValueChange: (
        field,
        newValue,
        oldValue,
        visibleColumns,
        columnOrder
      ) =>
        handleHeaderEdit(
          { colId: field, newValue, oldValue, visibleColumns, columnOrder },
          effectiveSection
        ),
      handleViewModeToggle,
      handleOpenChartModal,
      getTableRowBackgroundColor,
      currentYearField,
      hiddenMonths: hiddenMonthsBySection[effectiveSection],
      onLegendClick: (month: string) =>
        handleLegendClick(month, effectiveSection),
      onResetLegends: () => handleResetLegends(effectiveSection),
    };

    if (section) {
      return <SectionRenderer {...sectionProps} />;
    }

    const desktopChipActions = chipActions.filter(
      action =>
        action.actionName !== 'Drafts Due' &&
        action.actionName !== 'Title Failure'
    );
    const isLargeScreen = useMediaQuery('(min-width:1800px)');

    const handleChipClick = (index: number) => {
      setIsSectionSwitchLoading(true);
      handleChange && handleChange(index);
      setTimeout(() => setIsSectionSwitchLoading(false), 500);
    };

    return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {isGoalCountLoading ? (
          <>
            <Box
              sx={
                isLargeScreen
                  ? {
                      display: 'flex',
                      justifyContent: 'flex-start',
                      gap: 2,
                      padding: '20px 0 0 21px',
                    }
                  : {
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 2,
                      padding: '10px 0',
                      justifyContent: 'center',
                    }
              }
            >
              {desktopChipActions.map((_, index) => (
                <Skeleton
                  key={`skeleton-chip-${index}`}
                  variant="rectangular"
                  width={100}
                  height={32}
                />
              ))}
            </Box>
            <SectionRenderer {...sectionProps} />
          </>
        ) : isLargeScreen ? (
          <>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                gap: 2,
                display: 'flex',
                justifyContent: 'flex-start',
                zIndex: 1,
                padding: '20px 0 0 0',
              }}
            >
              {desktopChipActions.map((action, index) => (
                <Chip
                  key={action.actionName}
                  onClick={() => handleChipClick(index)}
                  id={action.actionName?.split(' ')?.join('-') + '-chip'}
                  sx={
                    active === index
                      ? {
                          background: 'white',
                          ':focus': { background: 'white' },
                          color: 'black',
                        }
                      : {
                          background: '#252830',
                          color: '#FFF',
                          '&:hover': { background: '#434857' },
                        }
                  }
                  label={
                    <Typography sx={active === index ? { color: 'black' } : {}}>
                      {action.actionName}
                    </Typography>
                  }
                />
              ))}
            </Box>
            <Box sx={{ width: '100%', mt: 0, paddingTop: '10px' }}>
              <SectionRenderer {...sectionProps} />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                padding: '10px 0',
                justifyContent: 'center',
                overflowX: 'auto',
                maxWidth: '100%',
              }}
            >
              {desktopChipActions.map((action, index) => (
                <Chip
                  key={action.actionName}
                  onClick={() => handleChipClick(index)}
                  id={action.actionName?.split(' ')?.join('-') + '-chip'}
                  sx={
                    active === index
                      ? {
                          background: 'white',
                          ':focus': { background: 'white' },
                          color: 'black',
                          minWidth: '100px',
                        }
                      : {
                          background: '#252830',
                          color: '#FFF',
                          '&:hover': { background: '#434857' },
                          minWidth: '100px',
                        }
                  }
                  label={
                    <Typography sx={active === index ? { color: 'black' } : {}}>
                      {action.actionName}
                    </Typography>
                  }
                />
              ))}
            </Box>
            <Box sx={{ width: '100%' }}>
              <SectionRenderer {...sectionProps} />
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <>
      {isMobileOrTablet && !section && RenderMobileTabletChips()}
      {(!isMobileOrTablet || section) && RenderSectionContent()}
      <FullscreenChartModal
        hiddenMonths={
          activeChartSection ? hiddenMonthsBySection[activeChartSection] : []
        }
        onLegendClick={(month: string) =>
          activeChartSection && handleLegendClick(month, activeChartSection)
        }
        onResetLegends={() =>
          activeChartSection && handleResetLegends(activeChartSection)
        }
        data={data}
        activeChartSection={activeChartSection}
        sectionColumns={sectionColumns}
        isChartModalOpen={isChartModalOpen}
        handleCloseChartModal={handleCloseChartModal}
      />
    </>
  );
};

export default GoalsSection;
