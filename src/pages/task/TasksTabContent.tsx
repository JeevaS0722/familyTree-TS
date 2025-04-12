/* eslint-disable complexity */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../store/hooks';
import { useGetAllTasksQuery } from '../../store/Services/taskService';
import {
  QueryParamsForWithoutPagination,
  TableColumns,
} from '../../interface/common';
import { TasksTabContentProps } from '../../interface/task';
import useDateTime from '../../hooks/useDateTime';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useGetUserQuery } from '../../store/Services/userService';
import { departments, nl2br } from '../../utils/GeneralUtil';
import { departmentMap } from '../../utils/contact/utils';
import CustomModel from '../../component/common/CustomModal';
import { taskTypeDead } from '../../utils/constants';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import NewTable from '../../component/Table';

const TasksTabContent: React.FC<TasksTabContentProps> = ({
  contactId,
  fileId,
  deedId,
  from,
  city,
  fileStatus,
}) => {
  const { t } = useTranslation('task');
  useGetUserQuery('');
  const { department } = useAppSelector(state => state.user);
  const { formatDateTime } = useDateTime();
  const navigate = useNavigate();
  const [infoOpen, setInfoOpen] = React.useState(false);
  const handleInfoOpen = () => setInfoOpen(true);
  const handleInfoClose = () => setInfoOpen(false);
  const [queryParams, setQueryParams] = React.useState({
    contactId: contactId || '',
    fileId: from === 'fileView' ? fileId || '' : '',
    orderBy: 'priority,DateDue',
    order: 'asc,asc',
  });

  const {
    data,
    isLoading: TasksLoading,
    isFetching,
    isError: TasksLoadError,
  } = useGetAllTasksQuery(queryParams, { refetchOnMountOrArgChange: true });

  React.useEffect(() => {
    setQueryParams({
      contactId: contactId || '',
      fileId: from === 'fileView' ? fileId || '' : '',
      orderBy: 'priority,DateDue',
      order: 'asc,asc',
    });
  }, [contactId, fileId]);

  const getDataWithoutPagination = ({
    sortBy,
    sortOrder,
  }: QueryParamsForWithoutPagination) => {
    setQueryParams({
      contactId: contactId || '',
      fileId: from === 'fileView' ? fileId || '' : '',
      orderBy: sortBy || 'priority,DateDue',
      order: sortOrder || 'asc,acs',
    });
  };

  if (TasksLoadError) {
    return null;
  }

  const columns: TableColumns[] = [
    {
      headerName: t('priority'),
      field: 'priority',
      sortable: true,
      width: 200,
    },
    {
      headerName: t('createDate'),
      field: 'createDate',
      sortable: true,
      width: 250,
    },
    {
      headerName: t('dateDue'),
      field: 'DateDue',
      sortable: true,
      width: 250,
    },
    {
      headerName: t('taskType'),
      field: 'type',
      sortable: true,
      cellRenderer: params => {
        const userId = data?.userId || null;
        const isFileView = from === 'fileView';
        const isDeedView = from === 'deedView';
        const toLink = `/edittask/${params.data.taskID}?isFileView=${isFileView}&contactId=${contactId}&fileId=${fileId}&isDeedView=${isDeedView}&deedId=${deedId}`;
        let taskEditable = false;
        if (department === departments[0]) {
          taskEditable = true;
        } else if (
          params.data.type === 'Check Request' &&
          (department === departments[0] ||
            department === departments[5] ||
            department === departments[3])
        ) {
          taskEditable = true;
        } else if (department === departments[1]) {
          if (
            'ToUser' in params.data &&
            typeof params.data.ToUser === 'object' &&
            params.data.ToUser &&
            'department' in params.data.ToUser &&
            (params.data.ToUser?.department === departments[0] ||
              params.data.ToUser.department === departments[2])
          ) {
            taskEditable = true;
          } else if (
            params.data.toUserDept === departments[0] ||
            params.data.toUserDept === departments[2]
          ) {
            taskEditable = true;
          }
        } else if (department === departments[2]) {
          if (
            'ToUser' in params.data &&
            typeof params.data.ToUser === 'object' &&
            params.data.ToUser &&
            'department' in params.data.ToUser &&
            (params.data.ToUser?.department === departments[1] ||
              params.data.ToUser.department === departments[0])
          ) {
            taskEditable = true;
          } else if (
            params.data.toUserDept === departments[1] ||
            params.data.toUserDept === departments[0]
          ) {
            taskEditable = true;
          } else if (
            params.data?.toUserDept === departments[2] ||
            ('ToUser' in params.data &&
              typeof params.data?.ToUser === 'object' &&
              params.data?.ToUser &&
              'department' in params.data.ToUser &&
              params.data?.ToUser?.department === departments[2])
          ) {
            taskEditable = true;
          }
        }
        const handleEditClick = (
          event: React.MouseEvent<HTMLAnchorElement>
        ) => {
          if (
            typeof fileStatus === 'string' &&
            fileStatus.toLowerCase() === 'dead' &&
            typeof params.data.type === 'string' &&
            params.data.type.toLowerCase().includes('dead')
          ) {
            event.preventDefault();
            handleInfoOpen();
          }
        };

        return taskEditable ||
          params.data.createdBy === userId ||
          params.data.toUserID === userId ? (
          <Link
            key={String(params.data.taskID)}
            to={toLink}
            className="hover-link"
            onClick={handleEditClick}
          >
            {params.data?.type?.toString()}
          </Link>
        ) : (
          <span>{params.data?.type?.toString()}</span>
        );
      },
    },
    {
      headerName: t('createdBy'),
      field: 'fromUserID',
      sortable: true,
    },
    {
      headerName: t('assignTo'),
      field: 'toUserID',
      sortable: true,
      cellRenderer: params => {
        const toUserDept = params.data?.toUserDept;
        const toUser = params.data?.toUserID
          ? params.data?.toUserID
          : toUserDept
            ? `${departmentMap[String(toUserDept)] || toUserDept} Department`
            : '';
        return toUser.toString();
      },
    },
    {
      headerName: t('notes'),
      field: 'memo',
      cellRenderer: params => {
        return params.data.memo
          ? parse(
              DOMPurify.sanitize(nl2br(String(params.data.memo)), {
                USE_PROFILES: { html: true },
              })
            )
          : '';
      },
      width: 300,
      sortable: true,
    },
  ];
  if (from === 'fileView') {
    columns.splice(5, 0, {
      headerName: t('contact'),
      field: 'contactName',
      sortable: true,
      width: 300,
    });
  }

  const formattedData = data?.tasks?.map(task => ({
    ...task,
    createDate: task.createDate ? formatDateTime(task.createDate) : '',
    DateDue: task.dateDue ? formatDateTime(task.dateDue) : '',
  }));

  let counter = 0;
  const getTableRowBackgroundColor = () => {
    counter++;
    return counter % 2 === 0 ? '#434857' : '#252830';
  };

  const handleAddNewTask = () => {
    const isFileView = from === 'fileView';
    const isDeedView = from === 'deedView';
    const queryParams = new URLSearchParams({
      contactId: String(contactId),
      fileId: String(fileId),
      deedId: String(deedId),
      isFileView: String(isFileView),
      isDeedView: String(isDeedView),
      city: city || '',
    }).toString();
    navigate(`/task/makeTask?${queryParams}`);
  };

  return (
    <Grid item xs={12}>
      <Box
        sx={{
          display: 'flex',
          marginBottom: 3,
        }}
      >
        {(from !== 'fileView' || !!data?.count) && (
          <Typography color="white" ml={2} mr={4} id="taskCount">
            {t('taskCount')}: {data?.count || 0}
          </Typography>
        )}

        {from === 'fileView' && !!data?.count && (
          <Typography color="white" id="taskCreateInfo">
            {t('createTaskInfo')}
          </Typography>
        )}
        {(from === 'contactView' || from === 'deedView') && (
          <Button
            id="new-task-button"
            variant="outlined"
            onClick={handleAddNewTask}
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
            {t('maketask')}
          </Button>
        )}
      </Box>

      {!data?.count && isFetching && (
        <Typography
          color="white"
          ml={2}
          mb={2}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {t('loading')}
          <CircularProgress
            size={20}
            sx={{ color: 'white', marginLeft: '10px' }}
          />
        </Typography>
      )}
      {!data?.count && !isFetching && (
        <Box>
          <Typography color="white" ml={2} mb={2} id="noTaskFountMsg">
            {from === 'contactView'
              ? t('noTaskFoundContactView')
              : from === 'deedView'
                ? t('noTaskFoundDeedView')
                : t('noTaskFoundFileView')}
          </Typography>
        </Box>
      )}
      {!!data?.count && (
        <NewTable
          tableId="taskTable"
          data={formattedData || []}
          count={data && 'count' in data ? data?.count : 0}
          initialLoading={TasksLoading}
          columns={columns}
          initialSortBy="priority,DateDue"
          initialSortOrder="asc,asc"
          getDataWithoutPagination={getDataWithoutPagination}
          loading={isFetching}
          message={data && 'tasks' in data ? data.message : ''}
          id={
            from === 'contactView'
              ? Number(contactId)
              : from === 'deedView'
                ? Number(deedId)
                : Number(fileId)
          }
          getTableRowBackgroundColor={getTableRowBackgroundColor}
          getTextColor={'white'}
          isWithoutPagination={true}
        />
      )}
      <CustomModel
        open={infoOpen}
        handleClose={handleInfoClose}
        modalHeader="Info"
        modalTitle={taskTypeDead}
      />
    </Grid>
  );
};

export default TasksTabContent;
