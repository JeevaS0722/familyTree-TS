import React from 'react';
import { useLazyGetTeamMateTasksQuery } from '../../../store/Services/dashboardService';
import { QueryParams } from '../../../interface/common';
import Tasks from './tasks';
import { useTranslation } from 'react-i18next';
import { useGetUserQuery } from '../../../store/Services/userService';
import { useAppSelector } from '../../../store/hooks';
import { SearchMyTaskQueryParams } from '../../../interface/dashboard';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';

const TeamMateTasks: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const [filterParams, setFilterParams] = React.useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [getTeamMateTasks, { data, isLoading: tasksLoading, isFetching }] =
    useLazyGetTeamMateTasksQuery();
  useGetUserQuery('');
  const user = useAppSelector(state => state.user);

  const getData = ({ page, rowsPerPage, sortBy, sortOrder }: QueryParams) => {
    void getTeamMateTasks({
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
    void getTeamMateTasks(apiParams);
    if (isMobile) {
      setIsModalOpen(false);
    }
  };

  return (
    <Tasks
      data={data}
      title={(user.teamMateId ? user.teamMateId + ' ' : '') + t('Tasks')}
      tasksLoading={tasksLoading}
      isFetching={isFetching}
      getData={getData}
      getFilteredData={getFilteredData}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  );
};

export default TeamMateTasks;
