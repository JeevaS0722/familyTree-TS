import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import {
  CreateWellMasterInitialValues,
  CreateWellMasterResponse,
  GetWellMasterByWellID,
  UpdateWellMasterInitialValues,
  WellMasterGetByWellIdResponse,
  Response,
  GetAllQuartersResponse,
} from '../../interface/wellMaster';

export const wellMasterApi = createApi({
  reducerPath: 'wellMasterApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['wellMaster'],
  endpoints: builder => ({
    createWellMaster: builder.mutation<
      CreateWellMasterResponse,
      CreateWellMasterInitialValues
    >({
      query: wellData => ({
        url: `/wellMaster/create`,
        method: 'POST',
        body: wellData,
      }),
    }),
    updateWellMaster: builder.mutation<
      CreateWellMasterResponse,
      UpdateWellMasterInitialValues
    >({
      query: wellData => ({
        url: `/wellMaster/edit`,
        method: 'PUT',
        body: wellData,
      }),
    }),
    getWellMasterByWellID: builder.query<
      WellMasterGetByWellIdResponse,
      GetWellMasterByWellID
    >({
      query: params => ({
        url: `/wellMaster/get`,
        method: 'GET',
        params,
      }),
      providesTags: [{ type: 'wellMaster' }],
    }),
    deleteWellMaster: builder.mutation<Response, GetWellMasterByWellID>({
      query: params => ({
        url: `/wellMaster/delete`,
        method: 'DELETE',
        params,
      }),
    }),
    getAllQuarters: builder.query<
      GetAllQuartersResponse,
      {
        searchText?: string;
        deedId?: number | null;
        wellId?: number | null | string;
        pageNo?: number;
        size?: number;
      }
    >({
      query: params => ({
        url: '/wellMaster/getAll/quarters',
        params,
      }),
    }),
  }),
});

export const {
  useCreateWellMasterMutation,
  useUpdateWellMasterMutation,
  useLazyGetWellMasterByWellIDQuery,
  useDeleteWellMasterMutation,
  useLazyGetAllQuartersQuery,
} = wellMasterApi;
