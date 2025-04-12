import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import { getUserListResponse, getUserResponse } from '../../interface/user';

export const userAPI = createApi({
  reducerPath: 'userAPI',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    getUser: builder.query<getUserResponse, string>({
      query: () => ({
        url: `/user`,
      }),
    }),
    getUserList: builder.query<getUserListResponse, void>({
      query: () => ({
        url: `/user/getAll`,
      }),
    }),
  }),
});

export const { useGetUserQuery, useGetUserListQuery } = userAPI;
