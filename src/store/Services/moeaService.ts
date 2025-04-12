import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import {
  Response,
  addMOEAPayload,
  editMOEAPayload,
  getMOEAQueryParams,
  deleteMOEAPayload,
  getMOEAResponse,
} from '../../interface/moea';

export const MOEAAPI = createApi({
  reducerPath: 'MOEAAPI',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    addMOEA: builder.mutation<Response, addMOEAPayload>({
      query: data => ({
        url: `/MOEA/create`,
        method: 'POST',
        body: data,
      }),
    }),
    updateMOEA: builder.mutation<Response, editMOEAPayload>({
      query: data => ({
        url: `/MOEA/update`,
        method: 'PUT',
        body: data,
      }),
    }),
    getMOEA: builder.query<getMOEAResponse, getMOEAQueryParams>({
      query: params => ({
        url: `/MOEA/get`,
        method: 'GET',
        params,
      }),
    }),
    deleteMOEA: builder.mutation<Response, deleteMOEAPayload>({
      query: data => ({
        url: `/MOEA/delete`,
        method: 'Delete',
        params: data,
      }),
    }),
  }),
});

export const {
  useLazyGetMOEAQuery,
  useAddMOEAMutation,
  useUpdateMOEAMutation,
  useDeleteMOEAMutation,
} = MOEAAPI;
