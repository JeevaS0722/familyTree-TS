import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { TableColumns } from '../../../interface/common';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { open } from '../../../store/Reducers/snackbar';
import { severity } from '../../../interface/snackbar';
import {
  useGetUserListQuery,
  useGetUserQuery,
} from '../../../store/Services/userService';
import { Link } from 'react-router-dom';
import { TasksProps } from '../../../interface/dashboard';
import { useCompleteTaskMutation } from '../../../store/Services/taskService';
import parse from 'html-react-parser';
import { nl2br } from '../../../utils/GeneralUtil';
import DOMPurify from 'dompurify';
import useDateTime from '../../../hooks/useDateTime';
import CommonModal from '../../../component/commonModal/CommonModal';
import {
  makeTaskPriority,
  taskTypeDead,
  taskTypes,
} from '../../../utils/constants';
import { User } from '../../../interface/user';
import FilterListIcon from '@mui/icons-material/FilterList';
import Badge from '@mui/material/Badge';
import CustomModel from '../../../component/common/CustomModal';
import NewTable from '../../../component/Table';

const TableContainer = styled('div')<{ isModalOpen: boolean }>(
  ({ isModalOpen }) => ({
    width: isModalOpen ? '73%' : '100%',
    float: 'right',
    padding: '16px',
  })
);
const MyTasks: React.FC<TasksProps> = ({
  data,
  tasksLoading,
  getData,
  isFetching,
  title,
  getFilteredData,
  isModalOpen,
  setIsModalOpen,
}) => {
  const { t } = useTranslation('dashboard');
  const { formatDateTime } = useDateTime();
  const { isLoading } = useGetUserQuery('');
  const [infoOpen, setInfoOpen] = React.useState(false);
  const handleInfoOpen = () => setInfoOpen(true);
  const handleInfoClose = () => setInfoOpen(false);
  const user = useAppSelector(state => state.user);
  const [completeTask] = useCompleteTaskMutation();
  const [refreshList, setRefreshList] = useState<boolean>(false);
  const [completeTaskId, setCompleteTaskId] = useState<number | null>(null);
  const { data: userData } = useGetUserListQuery();
  const [dropDownValue, setDropDownValue] = useState<{ users: Array<object> }>({
    users: [],
  });
  useEffect(() => {
    if (userData && userData.data && userData.data) {
      setDropDownValue(prevState => ({
        ...prevState,
        users: userData?.data?.map((user: User) => ({
          label: user.userId,
          value: user.fullName,
          id: user.userId,
        })),
      }));
    }
  }, [userData]);
  const handleTaskComplete = async (taskId: number) => {
    try {
      setCompleteTaskId(taskId);
      const response = await completeTask({ taskId });
      setCompleteTaskId(null);
      if ('data' in response) {
        if (response?.data?.success) {
          setRefreshList(!refreshList);
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
        }
      }
    } catch (error) {
      setCompleteTaskId(null);
      return error;
    }
  };
  const getColumns = (): TableColumns[] => {
    if (
      user.department === 'Buyer' ||
      user.department === 'BuyerResearch' ||
      user.department === 'BuyerAsst' ||
      title === t('researchTasks')
    ) {
      if (
        title ===
        (user.teamMateId ? user.teamMateId + ' ' : '') + t('Tasks')
      ) {
        return [
          {
            headerName: t('priority'),
            field: 'priority',
            sortable: true,
            type: 'dropdown',
            options: makeTaskPriority,
            filterable: title !== t('urgentTasks'),
            condition: '',
          },
          {
            headerName: t('createdDate'),
            field: 'createDate',
            type: 'date',
            condition: 'and',
            sortable: true,
            cellRenderer: params => {
              const createDate = params.data?.createDate as
                | string
                | undefined
                | null;
              return createDate ? formatDateTime(createDate) : '';
            },
            filterable: true,
            width: 200,
          },
          {
            headerName: t('dueDate'),
            field: 'dueDate',
            type: 'date',
            condition: 'and',
            sortable: true,
            cellRenderer: params => {
              const dueDate = params.data?.dueDate as string | undefined | null;
              return dueDate ? formatDateTime(dueDate) : '';
            },
            filterable: true,
            width: 200,
          },
          {
            headerName: t('requestedBy'),
            field: 'sentBy',
            sortable: true,
            filterable: true,
            options: dropDownValue.users,
            type: 'dropdown',
            condition: 'and',
          },
          {
            headerName: t('buyer'),
            field: 'buyer',
            sortable: true,
            filterable: true,
            options: dropDownValue.users,
            type: 'dropdown',
            condition: 'and',
          },
          {
            headerName: t('typeOfTask'),
            field: 'taskType',
            filterable: true,
            options: taskTypes,
            type: 'dropdown',
            cellRenderer: params => {
              const toLink = `/edittask/${params.data.taskId}?isFileView=${!params.data.contactId}&isDeedView=${params.data.isDeedAssociated}&isContactView=${!params.data.isDeedAssociated && params.data.contactId}&fileId=${params.data.fileId}&contactId=${params.data.contactId}&deedId=${params.data.isDeedAssociated ? (Array.isArray(params.data.deedId) ? params.data.deedId[0] : params.data.deedId) : ''}`;
              return (
                <Link
                  key={String(params.data.taskId)}
                  id="editTaskLink"
                  to={toLink}
                  onClick={event =>
                    handleEditClick(
                      event,
                      String(params.data?.fileStatus),
                      String(params.data?.taskType)
                    )
                  }
                  className="hover-link"
                >
                  {params.data.taskType}
                </Link>
              );
            },
            sortable: true,
            condition: 'and',
          },
          {
            headerName: t('notes'),
            field: 'notes',
            sortable: true,
            filterable: true,
            condition: 'and',
            type: 'textArea',
            width: 300,
          },
          {
            headerName: `${t('fileName')}`,
            field: 'fileName',
            cellRenderer: params => (
              <Link
                key={String(params.data.fileId)}
                id="fileNameLink"
                to={'/editfile/' + params.data.fileId}
                className="hover-link"
              >
                {params.data.fileName}
              </Link>
            ),
            sortable: true,
            filterable: true,
            condition: 'and',
            width: 400,
          },
          {
            headerName: t('contactName'),
            field: 'contactName',
            cellRenderer: params => (
              <Link
                key={String(params.data.contactId)}
                id="contactNameLink"
                to={'/editcontact/' + params.data.contactId}
                state={{ fileId: params.data.fileId }}
                className="hover-link"
              >
                {params.data.contactName}
              </Link>
            ),
            sortable: true,
            filterable: true,
            condition: 'and',
            width: 400,
          },
          {
            headerName: t('deed'),
            field: 'deed',
            filterable: false,
            cellRenderer: params => (
              <>
                {Array.isArray(params.data.deedId) &&
                  params.data.deedId.map(id => (
                    <Grid container key={id} mt={1}>
                      <Link
                        key={id}
                        id="deedLink"
                        to={'/editdeed/' + id}
                        className="hover-link"
                      >
                        {params.data.isDeedAssociated
                          ? t('viewDeed')
                          : t('viewDeedReturned')}
                      </Link>
                    </Grid>
                  ))}
              </>
            ),
            sortable: false,
            type: 'checkbox',
            condition: 'and',
          },
          {
            headerName: t('visit'),
            field: 'visit',
            sortable: true,
            filterable: true,
            type: 'checkbox',
            condition: 'and',
          },
          {
            headerName: t('totalFileValue'),
            field: 'totalFileValue',
            sortable: true,
            filterable: true,
            type: 'amount',
            condition: 'and',
          },
          {
            headerName: t('markComplete'),
            field: 'markComplete',
            cellRenderer: params => (
              <Button
                onClick={() => {
                  const taskId = params.data.taskId as unknown as number;
                  void handleTaskComplete(taskId);
                }}
                id="completeButton"
                disabled={params.data.taskId === completeTaskId}
                variant="outlined"
              >
                {t('complete')}
              </Button>
            ),
            sortable: false,
            filterable: false,
            condition: 'and',
          },
        ];
      }
      return [
        {
          headerName: t('priority'),
          field: 'priority',
          sortable: true,
          type: 'dropdown',
          options: makeTaskPriority,
          filterable: title !== t('urgentTasks'),
          condition: '',
        },
        {
          headerName: t('createdDate'),
          field: 'createDate',
          type: 'date',
          condition: 'and',
          sortable: true,
          cellRenderer: params => {
            const createDate = params.data?.createDate as
              | string
              | undefined
              | null;
            return createDate ? formatDateTime(createDate) : '';
          },
          filterable: true,
          width: 200,
        },
        {
          headerName: t('dueDate'),
          field: 'dueDate',
          type: 'date',
          sortable: true,
          cellRenderer: params => {
            const dueDate = params.data?.dueDate as string | undefined | null;
            return dueDate ? formatDateTime(dueDate) : '';
          },
          filterable: true,
          condition: 'and',
          width: 200,
        },
        {
          headerName: t('requestedBy'),
          field: 'sentBy',
          sortable: true,
          filterable: true,
          options: dropDownValue.users,
          type: 'dropdown',
          condition: 'and',
        },
        {
          headerName: t('buyer'),
          field: 'buyer',
          sortable: true,
          filterable: true,
          options: dropDownValue.users,
          type: 'dropdown',
          condition: 'and',
        },
        {
          headerName: t('typeOfTask'),
          field: 'taskType',
          filterable: true,
          options: taskTypes,
          type: 'dropdown',
          cellRenderer: params => {
            const toLink = `/edittask/${params.data.taskId}?isFileView=${!params.data.contactId}&isDeedView=${params.data.isDeedAssociated}&isContactView=${!params.data.isDeedAssociated && params.data.contactId}&fileId=${params.data.fileId}&contactId=${params.data.contactId}&deedId=${params.data.isDeedAssociated ? (Array.isArray(params.data.deedId) ? params.data.deedId[0] : params.data.deedId) : ''}`;
            return (
              <Link
                key={String(params.data.taskId)}
                id="editTaskLink"
                to={toLink}
                onClick={event =>
                  handleEditClick(
                    event,
                    String(params.data?.fileStatus),
                    String(params.data?.taskType)
                  )
                }
                className="hover-link"
              >
                {params.data.taskType}
              </Link>
            );
          },
          sortable: true,
          condition: 'and',
        },
        {
          headerName: t('notes'),
          field: 'notes',
          filterable: true,
          cellRenderer: params => {
            return params.data.notes
              ? parse(
                  DOMPurify.sanitize(nl2br(String(params.data.notes || '')), {
                    USE_PROFILES: { html: true },
                  })
                )
              : '';
          },
          sortable: true,
          condition: 'and',
          type: 'textArea',
          width: 300,
        },
        {
          headerName: `${t('fileName')}`,
          field: 'fileName',
          cellRenderer: params => (
            <Link
              key={String(params.data.fileId)}
              id="fileNameLink"
              to={'/editfile/' + params.data.fileId}
              className="hover-link"
            >
              {params.data.fileName}
            </Link>
          ),
          sortable: true,
          filterable: true,
          condition: 'and',
          width: 400,
        },
        {
          headerName: t('contactName'),
          field: 'contactName',
          cellRenderer: params => (
            <Link
              key={String(params.data.contactId)}
              id="contactNameLink"
              to={'/editcontact/' + params.data.contactId}
              state={{ fileId: params.data.fileId }}
              className="hover-link"
            >
              {params.data.contactName}
            </Link>
          ),
          sortable: true,
          filterable: true,
          condition: 'and',
          width: 400,
        },
        {
          headerName: t('deed'),
          field: 'deed',
          filterable: false,
          type: 'checkbox',
          condition: 'and',
          cellRenderer: params => (
            <>
              {Array.isArray(params.data.deedId) &&
                params.data.deedId.map(id => (
                  <Grid container key={id} mt={1}>
                    <Link
                      key={id}
                      id="deedLink"
                      to={'/editdeed/' + id}
                      className="hover-link"
                    >
                      {params.data.isDeedAssociated
                        ? t('viewDeed')
                        : t('viewDeedReturned')}
                    </Link>
                  </Grid>
                ))}
            </>
          ),
          sortable: false,
        },
        {
          headerName: t('visit'),
          field: 'visit',
          sortable: true,
          filterable: true,
          type: 'checkbox',
          condition: 'and',
        },
        {
          headerName: t('totalFileValue'),
          field: 'totalFileValue',
          sortable: true,
          filterable: true,
          type: 'amount',
          condition: 'and',
        },
        {
          headerName: t('county'),
          field: 'county',
          sortable: true,
          filterable: true,
          condition: 'and',
          width: 200,
        },
        {
          headerName: t('state'),
          field: 'state',
          sortable: true,
          filterable: true,
          type: 'dropdown',
          condition: 'and',
        },
        {
          headerName: t('markComplete'),
          field: 'markComplete',
          cellRenderer: params => (
            <Button
              onClick={() => {
                const taskId = params.data.taskId as unknown as number;
                void handleTaskComplete(taskId);
              }}
              id="completeButton"
              disabled={params.data.taskId === completeTaskId}
              variant="outlined"
            >
              {t('complete')}
            </Button>
          ),
          sortable: false,
          filterable: false,
          condition: 'and',
        },
      ];
    } else if (
      user.department === 'Division Orders' ||
      user.department === 'Revenue'
    ) {
      return [
        {
          headerName: t('priority'),
          field: 'priority',
          sortable: true,
          type: 'dropdown',
          options: makeTaskPriority,
          filterable: title !== t('urgentTasks'),
          condition: '',
        },
        {
          headerName: t('createdDate'),
          field: 'createDate',
          type: 'date',
          condition: 'and',
          sortable: true,
          cellRenderer: params => {
            const createDate = params.data?.createDate as
              | string
              | undefined
              | null;
            return createDate ? formatDateTime(createDate) : '';
          },
          filterable: true,
          width: 200,
        },
        {
          headerName: t('typeOfTask'),
          field: 'taskType',
          filterable: true,
          options: taskTypes,
          type: 'dropdown',
          cellRenderer: params => (
            <Link
              key={String(params.data.taskId)}
              id="editTaskLink"
              className="hover-link"
              onClick={event =>
                handleEditClick(
                  event,
                  String(params.data?.fileStatus),
                  String(params.data?.taskType)
                )
              }
              to={`/edittask/${params.data.taskId}?isFileView=${!params.data.contactId}&isDeedView=${params.data.isDeedAssociated}&isContactView=${!params.data.isDeedAssociated && params.data.contactId}&fileId=${params.data.fileId}&contactId=${params.data.contactId}&deedId=${params.data.isDeedAssociated ? (Array.isArray(params.data.deedId) ? params.data.deedId[0] : params.data.deedId) : ''}`}
            >
              {params.data.taskType}
            </Link>
          ),
          sortable: true,
          condition: 'and',
        },
        {
          headerName: `${t('fileName')}`,
          field: 'fileName',
          cellRenderer: params => (
            <Link
              key={String(params.data.fileId)}
              id="fileNameLink"
              to={'/editfile/' + params.data.fileId}
              className="hover-link"
            >
              {params.data.fileName}
            </Link>
          ),
          sortable: true,
          filterable: true,
          condition: 'and',
          width: 400,
        },
        {
          headerName: t('contactName'),
          field: 'contactName',
          cellRenderer: params => (
            <Link
              key={String(params.data.contactId)}
              id="contactNameLink"
              to={'/editcontact/' + params.data.contactId}
              state={{ fileId: params.data.fileId }}
              className="hover-link"
            >
              {params.data.contactName}
            </Link>
          ),
          sortable: true,
          filterable: true,
          condition: 'and',
        },
        {
          headerName: t('contactCounty'),
          field: 'county',
          sortable: true,
          filterable: true,
          condition: 'and',
          width: 200,
        },
        {
          headerName: t('contactState'),
          field: 'state',
          sortable: true,
          filterable: true,
          type: 'dropdown',
          condition: 'and',
        },
        {
          headerName: t('deed'),
          field: 'deed',
          filterable: false,
          type: 'checkbox',
          condition: 'and',
          cellRenderer: params => (
            <>
              {Array.isArray(params.data.deedId) &&
                params.data.deedId.map(id => (
                  <Grid container key={id} mt={1}>
                    <Link
                      key={id}
                      id="deedLink"
                      to={'/editdeed/' + id}
                      className="hover-link"
                    >
                      {params.data.isDeedAssociated
                        ? t('viewDeed')
                        : t('viewDeedReturned')}
                    </Link>
                  </Grid>
                ))}
            </>
          ),
          sortable: false,
        },
        {
          headerName: t('dueDate'),
          field: 'dueDate',
          type: 'date',
          sortable: true,
          cellRenderer: params => {
            const dueDate = params.data?.dueDate as string | undefined | null;
            return dueDate ? formatDateTime(dueDate) : '';
          },
          filterable: true,
          condition: 'and',
        },
        {
          headerName: t('requestedBy'),
          field: 'sentBy',
          sortable: true,
          filterable: true,
          options: dropDownValue.users,
          type: 'dropdown',
          condition: 'and',
        },
        {
          headerName: t('notes'),
          field: 'notes',
          cellRenderer: params => {
            return params.data.notes
              ? parse(
                  DOMPurify.sanitize(nl2br(String(params.data.notes)), {
                    USE_PROFILES: { html: true },
                  })
                )
              : '';
          },
          sortable: true,
          filterable: true,
          condition: 'and',
          type: 'textArea',
          width: 300,
        },
        {
          headerName: t('markComplete'),
          field: 'markComplete',
          cellRenderer: params => (
            <Button
              onClick={() => {
                const taskId = params.data.taskId as unknown as number;
                void handleTaskComplete(taskId);
              }}
              id="completeButton"
              disabled={params.data.taskId === completeTaskId}
              variant="outlined"
            >
              {t('complete')}
            </Button>
          ),
          sortable: false,
          filterable: false,
          condition: 'and',
        },
      ];
    } else {
      return [
        {
          headerName: t('dueDate'),
          field: 'dueDate',
          type: 'date',
          sortable: true,
          cellRenderer: params => {
            const dueDate = params.data?.dueDate as string | undefined | null;
            return dueDate ? formatDateTime(dueDate) : '';
          },
          filterable: true,
          condition: '',
        },
        {
          headerName: t('createdDate'),
          field: 'createDate',
          type: 'date',
          condition: 'and',
          sortable: true,
          cellRenderer: params => {
            const createDate = params.data?.createDate as
              | string
              | undefined
              | null;
            return createDate ? formatDateTime(createDate) : '';
          },
          filterable: true,
          width: 200,
        },
        {
          headerName: t('requestedBy'),
          field: 'sentBy',
          sortable: true,
          filterable: true,
          options: dropDownValue.users,
          type: 'dropdown',
          condition: 'and',
        },
        {
          headerName: t('typeOfTask'),
          field: 'taskType',
          options: taskTypes,
          type: 'dropdown',
          cellRenderer: params => (
            <Link
              key={String(params.data.taskId)}
              id="editTaskLink"
              to={'/edittask/' + params.data.taskId}
              className="hover-link"
              onClick={event =>
                handleEditClick(
                  event,
                  String(params.data?.fileStatus),
                  String(params.data?.taskType)
                )
              }
            >
              {params.data.taskType}
            </Link>
          ),
          sortable: true,
          filterable: true,
          condition: 'and',
        },
        {
          headerName: t('notes'),
          field: 'notes',
          cellRenderer: params => {
            return params.data.notes
              ? parse(
                  DOMPurify.sanitize(nl2br(String(params.data.notes)), {
                    USE_PROFILES: { html: true },
                  })
                )
              : '';
          },
          sortable: true,
          filterable: true,
          condition: 'and',
          type: 'textArea',
          width: 300,
        },
        {
          headerName: `${t('fileName')}`,
          field: 'fileName',
          cellRenderer: params => (
            <Link
              key={String(params.data.fileId)}
              id="fileNameLink"
              to={'/editfile/' + params.data.fileId}
              className="hover-link"
            >
              {params.data.fileName}
            </Link>
          ),
          sortable: true,
          filterable: true,
          condition: 'and',
          width: 400,
        },
        {
          headerName: t('contactName'),
          field: 'contactName',
          cellRenderer: params => (
            <Link
              key={String(params.data.contactId)}
              id="contactNameLink"
              to={'/editcontact/' + params.data.contactId}
              state={{ fileId: params.data.fileId }}
              className="hover-link"
            >
              {params.data.contactName}
            </Link>
          ),
          sortable: true,
          filterable: true,
          condition: 'and',
          width: 400,
        },
        {
          headerName: t('deed'),
          field: 'deed',
          filterable: false,
          type: 'checkbox',
          condition: 'and',
          cellRenderer: params => (
            <>
              {Array.isArray(params.data.deedId) &&
                params.data.deedId.map(id => (
                  <Grid container key={id} mt={1}>
                    <Link
                      key={id}
                      id="deedLink"
                      to={'/editdeed/' + id}
                      className="hover-link"
                    >
                      {t('viewDeedReturned')}
                    </Link>
                  </Grid>
                ))}
            </>
          ),
          sortable: false,
        },
        {
          headerName: t('payee'),
          field: 'payee',
          sortable: true,
          filterable: true,
          condition: 'and',
        },
        {
          headerName: t('address'),
          field: 'address',
          sortable: true,
          filterable: true,
          condition: 'and',
          type: 'textArea',
        },
        {
          headerName: t('city'),
          field: 'city',
          sortable: true,
          filterable: true,
          condition: 'and',
        },
        {
          headerName: t('state'),
          field: 'state',
          sortable: true,
          filterable: true,
          type: 'dropdown',
          condition: 'and',
        },
        {
          headerName: t('zip'),
          field: 'zip',
          sortable: true,
          filterable: true,
          condition: 'and',
        },
        {
          headerName: t('amount'),
          field: 'amount',
          sortable: true,
          filterable: true,
          type: 'amount',
          condition: 'and',
        },
        {
          headerName: t('markComplete'),
          field: 'markComplete',
          filterable: false,
          cellRenderer: params => (
            <Button
              onClick={() => {
                const taskId = params.data.taskId as unknown as number;
                void handleTaskComplete(taskId);
              }}
              id="completeButton"
              disabled={params.data.taskId === completeTaskId}
              variant="outlined"
            >
              {t('complete')}
            </Button>
          ),
          sortable: false,
          condition: 'and',
        },
      ];
    }
  };
  const handleEditClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    fileStatus: string,
    taskType: string
  ) => {
    if (
      fileStatus.toLowerCase() === 'dead' &&
      taskType.toLowerCase().includes('dead')
    ) {
      event.preventDefault();
      handleInfoOpen();
    }
  };

  const getInitialSortBy = () => {
    if (
      user.department === 'Buyer' ||
      user.department === 'BuyerResearch' ||
      user.department === 'BuyerAsst' ||
      title === t('researchTasks')
    ) {
      return 'priority,dueDate';
    } else if (
      user.department === 'Division Orders' ||
      user.department === 'Revenue'
    ) {
      return 'priority,taskType';
    } else {
      return 'dueDate,sentBy';
    }
  };

  const dispatch = useAppDispatch();

  const clearTask = () => {
    setCompleteTaskId(null);
  };

  useEffect(() => {
    if (completeTaskId && !isFetching) {
      clearTask();
    }
  }, [isFetching]);

  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleFilterChange = (count: number) => {
    setActiveFilterCount(count);
  };
  const handleToggleModal = () => {
    setIsModalOpen(prevState => !prevState);
  };
  const columns = getColumns();

  return (
    <Container fixed>
      <TableContainer isModalOpen={isModalOpen}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Typography sx={{ color: 'white', pt: 2 }} variant="h6" id="title">
              {`${title} (${data && 'data' in data ? data.data.count : 0} ${t('tasks')})`}
              <Button
                type="submit"
                id="search-modal-toggle"
                variant="outlined"
                sx={{
                  my: '2rem',
                  marginLeft: '10px',
                  '&:disabled': {
                    opacity: 0.2,
                    cursor: 'not-allowed',
                    backgroundColor: '#1997c6',
                    color: '#fff',
                  },
                }}
                onClick={handleToggleModal}
                endIcon={
                  <Badge
                    badgeContent={activeFilterCount}
                    color="primary"
                    sx={{ '& .MuiBadge-badge': { backgroundColor: '#3f51b5' } }}
                  >
                    <FilterListIcon />
                  </Badge>
                }
              >
                Search
              </Button>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <NewTable
              key="taskId"
              tableId="Tasks"
              data={data && 'data' in data ? data.data.records : []}
              count={data && 'data' in data ? data.data.count : 0}
              initialLoading={tasksLoading}
              tableLoading={isLoading}
              columns={getColumns()}
              initialSortBy={getInitialSortBy()}
              initialSortOrder={'asc,asc'}
              getData={getData}
              loading={isFetching}
              message={data && 'data' in data ? data.message : ''}
              refreshList={refreshList}
            />
          </Grid>
        </Grid>
      </TableContainer>
      <CommonModal
        isOpen={isModalOpen}
        handleClose={handleCloseModal}
        title="Filter"
        columns={columns}
        onFilterChange={handleFilterChange}
        getFilteredDataTrigger={getFilteredData}
      />
      <CustomModel
        open={infoOpen}
        handleClose={handleInfoClose}
        modalHeader="Info"
        modalTitle={taskTypeDead}
      />
    </Container>
  );
};

export default MyTasks;
