import React from 'react';
import { useLazyGetUrgentTasksQuery } from '../../../store/Services/dashboardService';
import { QueryParams } from '../../../interface/common';
import Tasks from './tasks';
import { useTranslation } from 'react-i18next';
import { SearchMyTaskQueryParams } from '../../../interface/dashboard';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';

const UrgentTasks: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const theme = useTheme();
  const [filterParams, setFilterParams] = React.useState({});
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [getUrgentTasks, { data, isLoading: tasksLoading, isFetching }] =
    useLazyGetUrgentTasksQuery();

  const getData = ({ page, rowsPerPage, sortBy, sortOrder }: QueryParams) => {
    void getUrgentTasks({
      ...filterParams,
      pageNo: page,
      size: rowsPerPage,
      order: sortOrder,
      orderBy: sortBy,
    });
  };

  const getFilteredData = ({ ...otherParams }: SearchMyTaskQueryParams) => {
    setFilterParams(otherParams);
    const apiParams = {
      ...otherParams,
      pageNo: 1,
      size: 100,
      order: 'asc,asc',
      orderBy: 'dueDate,sentBy',
    };
    void getUrgentTasks(apiParams);
    if (isMobile) {
      setIsModalOpen(false);
    }
  };

  return (
    <Tasks
      data={data}
      title={t('urgentTasks')}
      tasksLoading={tasksLoading}
      isFetching={isFetching}
      getData={getData}
      getFilteredData={getFilteredData}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  );
};

export default UrgentTasks;
