import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import {
  CreateDeedResponse,
  DeedData,
  EditDeedFormInterface,
  EditTitleFailure,
  GetAllDeedsRequest,
  GetAllDeedsResponse,
  GetDeedRequest,
  GetDeedResponse,
} from '../../interface/deed';
import { DeedsCountBuyerParams } from '../../interface/searchDeed';

export const deedApi = createApi({
  reducerPath: 'deedApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Deed'],
  endpoints: builder => ({
    createDeed: builder.mutation<CreateDeedResponse, DeedData>({
      query: DeedData => ({
        url: `/deed/create`,
        method: 'POST',
        body: DeedData,
      }),
    }),
    getDeed: builder.query<GetDeedResponse, GetDeedRequest>({
      query: params => ({
        url: '/deed/get',
        method: 'GET',
        params,
      }),
      providesTags: ['Deed'],
    }),
    getAllDeeds: builder.query<GetAllDeedsResponse, GetAllDeedsRequest>({
      query: params => ({
        url: '/deed/getAll',
        method: 'GET',
        params,
      }),
      providesTags: ['Deed'],
    }),
    editDeed: builder.mutation<CreateDeedResponse, EditDeedFormInterface>({
      query: DeedData => ({
        url: `/deed/edit`,
        method: 'PUT',
        body: DeedData,
      }),
    }),
    getDeedCountBuyer: builder.query<
      { deeds: { fullName: string; deedCount: number }[] },
      DeedsCountBuyerParams
    >({
      query: params => ({
        url: '/deed/buyer/count',
        method: 'GET',
        params,
      }),
    }),
    editDeedTitleFailure: builder.mutation<
      CreateDeedResponse,
      EditTitleFailure
    >({
      query: DeedData => ({
        url: `/deed/titleFailure/edit`,
        method: 'PUT',
        body: DeedData,
      }),
    }),
  }),
});

export const {
  useCreateDeedMutation,
  useLazyGetDeedQuery,
  useLazyGetAllDeedsQuery,
  useEditDeedMutation,
  useLazyGetDeedCountBuyerQuery,
  useEditDeedTitleFailureMutation,
} = deedApi;
