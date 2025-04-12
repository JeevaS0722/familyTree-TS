import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth, baseQueryWithReauth } from './index';

export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: baseQueryWithAuth,
  endpoints: builder => ({
    login: builder.mutation({
      query: ({ data }) => ({
        url: `/auth/login`,
        method: 'POST',
        body: data as object,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `/auth/logout`,
        method: 'POST',
      }),
    }),
  }),
});

export const authHelperAPI = createApi({
  reducerPath: 'authHelperAPI',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    verifySignedIn: builder.query({
      query: () => ({
        url: `/auth/verify/signedIn`,
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authAPI;
export const { useVerifySignedInQuery } = authHelperAPI;
