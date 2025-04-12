import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import {
  Response,
  CompleteTaskPayload,
  GetAllTaskQueryParam,
  GetTaskQueryParam,
  GetAllTaskResponse,
  GetTaskResponse,
  CreateTaskPayload,
  DeleteTaskQueryParams,
  UpdateTaskPayload,
  CompleteEditTask,
} from '../../interface/task';

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    completeTask: builder.mutation<Response, CompleteTaskPayload>({
      query: completeTaskData => ({
        url: `/task/mark_as_complete`,
        method: 'PUT',
        body: completeTaskData,
      }),
    }),
    getAllTasks: builder.query<GetAllTaskResponse, GetAllTaskQueryParam>({
      query: params => ({
        url: '/task/getAll',
        method: 'GET',
        params,
      }),
    }),
    getTask: builder.query<GetTaskResponse, GetTaskQueryParam>({
      query: params => ({
        url: `/task/get`,
        method: 'GET',
        params,
      }),
    }),
    makeTask: builder.mutation<Response, CreateTaskPayload>({
      query: createTaskData => ({
        url: `/task/create`,
        method: 'POST',
        body: createTaskData,
      }),
    }),
    deleteTask: builder.mutation<Response, DeleteTaskQueryParams>({
      query: ({ taskId }) => ({
        url: `/task/delete`,
        method: 'DELETE',
        params: { taskId },
      }),
    }),
    updateTask: builder.mutation<Response, UpdateTaskPayload>({
      query: updateTaskData => ({
        url: `/task/update`,
        method: 'PUT',
        body: updateTaskData,
      }),
    }),
    completeEditTask: builder.mutation<Response, CompleteEditTask>({
      query: completeEditTaskData => ({
        url: `/task/contact/complete`,
        method: 'PUT',
        body: completeEditTaskData,
      }),
    }),
  }),
});
export const {
  useCompleteTaskMutation,
  useGetAllTasksQuery,
  useGetTaskQuery,
  useMakeTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useCompleteEditTaskMutation,
} = taskApi;
