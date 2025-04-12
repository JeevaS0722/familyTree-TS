/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  useCompleteEditTaskMutation,
  useDeleteTaskMutation,
  useGetTaskQuery,
  useMakeTaskMutation,
  useUpdateTaskMutation,
} from '../../store/Services/taskService';
import {
  CompleteEditTask,
  CreateTaskPayload,
  DropdownObjectForTypeOfTask,
  FormValues,
  UpdateTaskPayload,
} from '../../interface/task';
import { useGetUserListQuery as useGetAllUsersQuery } from '../../store/Services/userService';
import {
  makeNewTaskTypes,
  makeTaskPriority,
  makeTaskResults,
  makeTaskTypes,
  taskVisibleFields,
} from '../../utils/constants';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import { User } from '../../interface/user';
import { isMomentValidDate, removeEmptyFields } from '../../utils/GeneralUtil';
import CustomModel from '../../component/common/CustomModal';
import { setTabName } from '../../store/Reducers/tabReducer';
import useDateTime from '../../hooks/useDateTime';
import moment from 'moment';
import OverlayLoader from '../../component/common/OverlayLoader';
import EditTaskForm from './EditTaskForm';

const MakeTask: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { t } = useTranslation('task');
  const user = useAppSelector(state => state.user);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isFileView = queryParams.get('isFileView') === 'true';
  const isDeedView = queryParams.get('isDeedView') === 'true';
  const fileId = Number(queryParams.get('fileId'));
  const contactId = Number(queryParams.get('contactId'));
  const deedId = Number(queryParams.get('deedId'));
  const route = queryParams.get('route');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { formatDateTime } = useDateTime();
  const { data: userData } = useGetAllUsersQuery();
  const mode = taskId ? 'edit' : 'add';
  const initCity = queryParams.get('city');
  const [initialValues, setInitialValues] = useState({
    type: '',
    toUserID: user?.userId || '',
    dateDue: moment()
      .set({ hour: 8, minute: 0, second: 0 })
      .format('YYYY-MM-DD HH:mm:ss'),
    priority: 'Low',
    city: mode === 'add' ? initCity || '' : '',
    memo: '',
    result: '',
    NewTaskMemo: '',
    NewTaskToUser: user?.userId || '',
    NewTaskDueDateTime: moment()
      .set({ hour: 8, minute: 0, second: 0 })
      .format('YYYY-MM-DD HH:mm:ss'),
    NewTaskPriority: 'High',
  });
  const [errors, setErrors] = useState({});
  const [dropDownValue, setDropDownValue] =
    useState<DropdownObjectForTypeOfTask>({
      taskTypes: mode === 'add' ? makeNewTaskTypes : makeTaskTypes,
      resultTypes: makeTaskResults,
      priorityTypes: makeTaskPriority,
      users: [],
    });
  const [openModel, setOpenModel] = React.useState(false);
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => setOpenModel(false);

  const [createTask] = useMakeTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [completeEditTask] = useCompleteEditTaskMutation();

  const { data: taskData, isLoading: taskLoading } = useGetTaskQuery(
    { taskId: Number(taskId) },
    { skip: mode === 'add', refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (userData && userData.data && userData.data) {
      setDropDownValue(prevState => ({
        ...prevState,
        users: userData?.data?.map((user: User) => ({
          label: user.fullName,
          value: user.userId,
          id: user.userId,
        })),
      }));
    }
  }, [userData, mode, location]);

  useEffect(() => {
    if (taskData && taskData.tasks) {
      const {
        type,
        toUserID,
        dateDue,
        priority,
        city,
        memo,
      }: {
        type: string;
        toUserID: string;
        dateDue: string | undefined | null;
        priority: string;
        city: string;
        memo: string;
        result: string;
      } = taskData.tasks;
      setInitialValues({
        type: type || '',
        toUserID: toUserID || '',
        dateDue: formatDateTime(dateDue) || '',
        priority: priority || 'Low',
        city: city || '',
        memo: memo || '',
        result: '',
        NewTaskToUser: toUserID || '',
        NewTaskPriority: priority || 'High',
        NewTaskDueDateTime: moment()
          .set({ hour: 8, minute: 0, second: 0 })
          .format('YYYY-MM-DD HH:mm:ss'),
        NewTaskMemo: '',
      });
    } else if (user) {
      setInitialValues(prevState => ({
        ...prevState,
        toUserID: user?.userId || '',
      }));
    }
  }, [taskData, user, location]);

  // Setup initial field visibility
  const [fieldVisibility, setFieldVisibility] = useState({
    showCounty:
      taskVisibleFields.county.includes(initialValues.type) && mode !== 'edit',
    showDateDue: mode === 'edit' ? true : false,
    showResult: mode === 'edit' ? true : false,
  });

  // Handle form value changes
  const handleInputChange = (name: string, value: string) => {
    setInitialValues(prev => ({ ...prev, [name]: value }));
    // Determine visibility of fields based on task type
    if (name === 'type') {
      setFieldVisibility({
        showCounty: taskVisibleFields.county.includes(value) && mode !== 'edit',
        showDateDue:
          !taskVisibleFields.dateDue.includes(value) || mode === 'edit',
        showResult: mode === 'edit',
      });
    }
  };

  const validateForm = (values: FormValues) => {
    const errors: Partial<FormValues> = {};
    let hasError = false;
    if (!values.type) {
      errors.type = t('typeRequired');
      hasError = true;
    }

    if (!values.priority) {
      errors.priority = t('priorityRequired');
      hasError = true;
    }

    if (
      taskVisibleFields.newTaskField.includes(values?.result) &&
      values.NewTaskDueDateTime &&
      !isMomentValidDate(values.NewTaskDueDateTime)
    ) {
      errors.NewTaskDueDateTime = t('invalidDate');
      hasError = true;
    }

    if (values.dateDue && !isMomentValidDate(values.dateDue)) {
      errors.dateDue = t('invalidDate');
      hasError = true;
    }
    setErrors(errors);
    return hasError;
  };

  const handleNavigate = (action: string) => {
    if (route) {
      navigate(route, {
        state: {
          from: 'notes',
          action: action,
          id: taskId,
        },
      });
    } else if (isFileView) {
      navigate(`/editfile/${Number(fileId)}?tab=tasks`);
    } else if (isDeedView) {
      navigate(`/editdeed/${Number(deedId)}?tab=tasks`);
    } else {
      dispatch(setTabName({ tabName: 'tasks' }));
      navigate(`/editcontact/${Number(contactId)}?tab=tasks`);
    }
  };

  const onSubmit = async (values: FormValues) => {
    const type = values.action;
    delete values.action;
    const taskValues = removeEmptyFields<FormValues>(values) as FormValues;
    if (mode === 'add') {
      if (!validateForm(values)) {
        let taskDetails: CreateTaskPayload = {
          Type: taskValues.type,
          ToUserID: taskValues.toUserID,
          DateDue: fieldVisibility.showDateDue
            ? moment(taskValues.dateDue).format('YYYY-MM-DD HH:mm:ss')
            : '',
          Priority: taskValues.priority,
          City: taskValues.city,
          Memo: taskValues.memo,
          FileID: Number(fileId),
          ContactID: Number(contactId),
          DeedID: deedId ? Number(deedId) : undefined,
        };
        taskDetails = removeEmptyFields<CreateTaskPayload>(
          taskDetails
        ) as CreateTaskPayload;
        const response = await createTask(taskDetails);
        if ('data' in response) {
          if (response?.data?.success) {
            dispatch(
              open({
                severity: severity.success,
                message: response?.data?.message,
              })
            );
            handleNavigate('create');
          }
        }
      }
    } else {
      if (type === 'update') {
        if (!validateForm(values)) {
          const taskDetails: UpdateTaskPayload = {
            Type: taskValues.type,
            DateDue: moment(taskValues.dateDue).format('YYYY-MM-DD HH:mm:ss'),
            Priority: taskValues.priority,
            Memo: taskValues.memo,
            TaskId: Number(taskId),
          };
          const response = await updateTask({ ...taskDetails });
          if ('data' in response && response?.data?.success) {
            dispatch(
              open({
                severity: severity.success,
                message: response?.data?.message,
              })
            );
            if (route) {
              navigate(route, {
                state: {
                  from: 'notes',
                  action: 'update',
                  id: taskId,
                },
              });
            } else if (isFileView) {
              navigate(
                `/editfile/${Number(taskData?.tasks?.FileID)}?tab=tasks`
              );
            } else if (isDeedView) {
              navigate(`/editdeed/${Number(deedId)}?tab=tasks`);
            } else {
              dispatch(setTabName({ tabName: 'tasks' }));
              navigate(
                `/editcontact/${Number(taskData?.tasks?.ContactID)}?tab=tasks`
              );
            }
          }
        }
      } else {
        if (!validateForm(values)) {
          let taskDetails: CompleteEditTask = {
            Type: taskValues.type,
            DateDue: moment(taskValues.dateDue).format('YYYY-MM-DD HH:mm:ss'),
            Priority: taskValues.priority,
            Memo: taskValues.memo,
            Result: taskValues.result,
            NewTaskToUser: taskVisibleFields.newTaskField.includes(
              taskValues.result
            )
              ? taskValues.NewTaskToUser
              : '',
            NewTaskDueDateTime:
              taskVisibleFields.newTaskField.includes(taskValues.result) &&
              taskValues.NewTaskDueDateTime
                ? moment(taskValues.NewTaskDueDateTime).format(
                    'YYYY-MM-DD HH:mm:ss'
                  )
                : '',
            NewTaskMemo:
              taskValues.result &&
              !taskVisibleFields.newTaskMemo.includes(taskValues.result)
                ? taskValues.NewTaskMemo
                : '',
            NewTaskPriority: taskVisibleFields.newTaskField.includes(
              taskValues.result
            )
              ? taskValues.NewTaskPriority
              : '',
            TaskId: Number(taskId),
          };
          taskDetails = removeEmptyFields<CompleteEditTask>(
            taskDetails
          ) as CompleteEditTask;
          const response = await completeEditTask(taskDetails);
          if ('data' in response && response?.data?.success) {
            dispatch(
              open({
                severity: severity.success,
                message: response?.data?.message,
              })
            );
            setOpenModel(false);
            if (route) {
              navigate(route, {
                state: {
                  from: 'notes',
                  action: 'complete',
                  id: taskId,
                },
              });
            } else if (isFileView) {
              navigate(
                `/editfile/${Number(taskData?.tasks?.FileID)}?tab=tasks`
              );
            } else if (isDeedView) {
              navigate(`/editdeed/${Number(deedId)}?tab=tasks`);
            } else {
              dispatch(setTabName({ tabName: 'tasks' }));
              navigate(
                `/editcontact/${Number(taskData?.tasks?.ContactID)}?tab=tasks`
              );
            }
          }
        }
      }
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteTask({ taskId: Number(taskId) });
      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          setOpenModel(false);

          if (isFileView) {
            navigate(`/editfile/${Number(taskData?.tasks?.FileID)}?tab=tasks`);
          } else if (isDeedView) {
            navigate(`/editdeed/${Number(deedId)}?tab=tasks`);
          } else {
            dispatch(setTabName({ tabName: 'tasks' }));
            navigate(
              `/editcontact/${Number(taskData?.tasks?.ContactID)}?tab=tasks`
            );
          }
        } else {
          setOpenModel(false);
        }
      } else {
        setOpenModel(false);
      }
    } catch (error) {
      dispatch(
        open({
          severity: severity.error,
          message: 'unaccepted error occurred',
        })
      );
      setOpenModel(false);
    }
  };
  return (
    <Container component="main" fixed sx={{ mt: 2 }}>
      {taskLoading && <OverlayLoader open />}
      {(!taskLoading || mode === 'add') && (
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          enableReinitialize
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({ isSubmitting, isValidating, values }) => (
            <Form>
              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  component="p"
                  gutterBottom
                  className="header-title-h4"
                  id="task-title"
                >
                  {mode === 'add'
                    ? t('addTask')
                    : `${t('editTask')} ${taskData?.tasks?.contactName ? 'For ' + taskData?.tasks?.contactName : ''}`}
                </Typography>
              </Grid>
              <Grid
                item
                container
                xs={12}
                sx={{
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  alignItems: 'center',
                  rowGap: '1rem',
                }}
              >
                <Grid
                  container
                  alignItems="center"
                  sx={{ justifyContent: 'center' }}
                >
                  {mode === 'edit' && (
                    <>
                      <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <Button
                          variant="outlined"
                          id="complete-task-button"
                          fullWidth
                          disabled={isSubmitting}
                          sx={{
                            whiteSpace: 'nowrap',
                            '&:disabled': {
                              opacity: 0.2,
                              cursor: 'not-allowed',
                              borderColor: '#1997c6',
                              color: '#fff',
                            },
                          }}
                          onClick={async () => {
                            if (!validateForm(values)) {
                              await onSubmit({
                                ...values,
                                action: 'complete',
                              });
                            }
                          }}
                        >
                          {t('completeTask')}
                        </Button>
                      </Grid>
                      {!values?.result && (
                        <Grid
                          item
                          xs={12}
                          md={4}
                          sx={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <Button
                            variant="outlined"
                            id="update-task-button"
                            fullWidth
                            disabled={isSubmitting}
                            sx={{
                              whiteSpace: 'nowrap',
                              '&:disabled': {
                                opacity: 0.2,
                                cursor: 'not-allowed',
                                borderColor: '#1997c6',
                                color: '#fff',
                              },
                            }}
                            onClick={async () => {
                              await onSubmit({
                                ...values,
                                action: 'update',
                              });
                            }}
                          >
                            {t('updateTask')}
                          </Button>
                        </Grid>
                      )}
                      <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <Button
                          variant="outlined"
                          id="delete-task-button"
                          onClick={handleOpen}
                          fullWidth
                          disabled={isSubmitting}
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
                          {t('deleteTask')}
                        </Button>
                      </Grid>
                    </>
                  )}
                </Grid>
                <EditTaskForm
                  isValidating={isValidating}
                  fieldVisibility={fieldVisibility}
                  taskVisibleFields={taskVisibleFields}
                  values={values}
                  dropDownValue={dropDownValue}
                  errors={errors}
                  mode={mode}
                  handleInputChange={handleInputChange}
                />
                {mode === 'add' && (
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: 5,
                    }}
                  >
                    <Button
                      type="submit"
                      variant="outlined"
                      id="save-task-button"
                      disabled={isSubmitting}
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
                      {t('save')}
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Form>
          )}
        </Formik>
      )}
      {openModel && (
        <CustomModel
          open={openModel}
          handleClose={handleClose}
          handleDelete={handleDelete}
          modalHeader={t('deleteTaskTitle')}
          modalTitle={t('deleteTaskMsg')}
          modalButtonLabel={t('delete')}
        />
      )}
    </Container>
  );
};

export default MakeTask;
