import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import {
  CreateDivisionPayload,
  DeleteDivisionReqQuery,
  GetAllDivisionsQueryParam,
  GetAllDivisionsResponse,
  GetDivisionOrderQueryParam,
  GetDivisionOrderResponse,
  Response,
  UpdateDivisionPayload,
} from '../../interface/division';

export const divisionApi = createApi({
  reducerPath: 'divisionApi',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    createDivision: builder.mutation<Response, CreateDivisionPayload>({
      query: createDivisionData => ({
        url: `/divorder/create`,
        method: 'POST',
        body: createDivisionData,
      }),
    }),
    getAllDivision: builder.query<
      GetAllDivisionsResponse,
      GetAllDivisionsQueryParam
    >({
      query: params => ({
        url: '/divorder/getAll',
        method: 'GET',
        params,
      }),
    }),
    getDivisionDetails: builder.query<
      GetDivisionOrderResponse,
      GetDivisionOrderQueryParam
    >({
      query: params => ({
        url: `/divorder/get`,
        method: 'GET',
        params,
      }),
    }),
    updateDivision: builder.mutation<Response, UpdateDivisionPayload>({
      query: updateDivisionData => ({
        url: `/divorder/update`,
        method: 'PUT',
        body: updateDivisionData,
      }),
    }),
    deleteDivision: builder.mutation<Response, DeleteDivisionReqQuery>({
      query: params => ({
        url: `/divorder/delete`,
        method: 'DELETE',
        params,
      }),
    }),
  }),
});
export const {
  useCreateDivisionMutation,
  useGetAllDivisionQuery,
  useGetDivisionDetailsQuery,
  useLazyGetDivisionDetailsQuery,
  useUpdateDivisionMutation,
  useDeleteDivisionMutation,
} = divisionApi;
