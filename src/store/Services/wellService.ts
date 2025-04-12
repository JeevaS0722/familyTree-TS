import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import {
  CreateWellResponse,
  CreateWellsInterface,
  Response,
  UpdateWellData,
  WellGetAllByDivOrderIdIdResponse,
  WellGetByWellIdResponse,
  WellParamsForDivOrderId,
  WellParamsForWellId,
} from '../../interface/well';

export const wellApi = createApi({
  reducerPath: 'wellApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['well'],
  endpoints: builder => ({
    getWellByWellId: builder.query<
      WellGetByWellIdResponse,
      WellParamsForWellId
    >({
      query: params => ({
        url: `/well/get`,
        method: 'GET',
        params,
      }),
      providesTags: [{ type: 'well' }],
    }),
    getAllWells: builder.query<
      WellGetAllByDivOrderIdIdResponse,
      WellParamsForDivOrderId
    >({
      query: params => ({
        url: `/well/getAll`,
        method: 'GET',
        params,
      }),
    }),
    createWell: builder.mutation<CreateWellResponse, CreateWellsInterface>({
      query: wellData => ({
        url: `/well/create`,
        method: 'POST',
        body: wellData,
      }),
    }),
    editWell: builder.mutation<CreateWellResponse, UpdateWellData>({
      query: wellData => ({
        url: `/well/edit`,
        method: 'PUT',
        body: wellData,
      }),
    }),
    deleteWell: builder.mutation<Response, WellParamsForWellId>({
      query: params => ({
        url: `/well/delete`,
        method: 'DELETE',
        params,
      }),
    }),
    copyWell: builder.mutation<CreateWellResponse, WellParamsForWellId>({
      query: wellId => ({
        url: `/well/copy`,
        method: 'POST',
        body: wellId,
      }),
    }),
  }),
});

export const {
  useLazyGetAllWellsQuery,
  useLazyGetWellByWellIdQuery,
  useCreateWellMutation,
  useEditWellMutation,
  useDeleteWellMutation,
  useCopyWellMutation,
} = wellApi;
