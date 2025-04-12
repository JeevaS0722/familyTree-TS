import React, { useState } from 'react';
import { useLazyGetMyTasksQuery } from '../../../store/Services/dashboardService';
import { QueryParams } from '../../../interface/common';
import Tasks from './tasks';
import { useTranslation } from 'react-i18next';
import { SearchMyTaskQueryParams } from '../../../interface/dashboard';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';

const MyTasks: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [filterParams, setFilterParams] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [getMyTasks, { data, isLoading: tasksLoading, isFetching }] =
    useLazyGetMyTasksQuery();

  const getData = ({ page, rowsPerPage, sortBy, sortOrder }: QueryParams) => {
    void getMyTasks({
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
    void getMyTasks(apiParams);
    if (isMobile) {
      setIsModalOpen(false);
    }
  };

  return (
    <Tasks
      data={data}
      title={t('myTasks')}
      tasksLoading={tasksLoading}
      isFetching={isFetching}
      getData={getData}
      getFilteredData={getFilteredData}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  );
};

export default MyTasks;
