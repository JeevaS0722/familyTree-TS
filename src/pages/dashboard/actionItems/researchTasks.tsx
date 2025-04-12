import React from 'react';
import { useLazyGetResearchTasksQuery } from '../../../store/Services/dashboardService';
import { QueryParams } from '../../../interface/common';
import Tasks from './tasks';
import { useTranslation } from 'react-i18next';
import { SearchMyTaskQueryParams } from '../../../interface/dashboard';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';

const ResearchTasks: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const theme = useTheme();
  const [filterParams, setFilterParams] = React.useState({});
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [getResearchTasks, { data, isLoading: tasksLoading, isFetching }] =
    useLazyGetResearchTasksQuery();

  const getData = ({ page, rowsPerPage, sortBy, sortOrder }: QueryParams) => {
    void getResearchTasks({
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
    void getResearchTasks(apiParams);
    if (isMobile) {
      setIsModalOpen(false);
    }
  };

  return (
    <Tasks
      data={data}
      title={t('researchTasks')}
      tasksLoading={tasksLoading}
      isFetching={isFetching}
      getData={getData}
      getFilteredData={getFilteredData}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  );
};

export default ResearchTasks;
