import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import {
  Response,
  addSuspensePayload,
  editSuspensePayload,
  getSuspenseListQueryParams,
  getSuspenseListResponse,
  getSuspenseQueryParams,
  getSuspenseResponse,
} from '../../interface/suspense';

export const suspenseAPI = createApi({
  reducerPath: 'suspenseAPI',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    getSuspenseList: builder.query<
      getSuspenseListResponse,
      getSuspenseListQueryParams
    >({
      query: query => ({
        url: `/suspense/getAll`,
        method: 'GET',
        params: query,
      }),
    }),
    addSuspense: builder.mutation<Response, addSuspensePayload>({
      query: data => ({
        url: `/suspense/create`,
        method: 'POST',
        body: data,
      }),
    }),
    updateSuspense: builder.mutation<Response, editSuspensePayload>({
      query: data => ({
        url: `/suspense/update`,
        method: 'PUT',
        body: data,
      }),
    }),
    getSuspense: builder.query<getSuspenseResponse, getSuspenseQueryParams>({
      query: params => ({
        url: `/suspense/get`,
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const {
  useLazyGetSuspenseListQuery,
  useLazyGetSuspenseQuery,
  useAddSuspenseMutation,
  useUpdateSuspenseMutation,
} = suspenseAPI;
