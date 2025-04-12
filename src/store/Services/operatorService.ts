import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import {
  CreateOperatorInitialValues,
  GetAllOperatorResponse,
  OperatorGetByOperatorIdResponse,
  OperatorParamsForOperatorId,
  ResponseOfOperator,
  UpdateOperatorInitialValues,
} from '../../interface/operator';

export const operatorApi = createApi({
  reducerPath: 'operatorApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['operator'],
  endpoints: builder => ({
    getAllOperator: builder.query<
      GetAllOperatorResponse,
      {
        searchText?: string;
        pageNo?: number;
        size?: number;
      }
    >({
      query: params => ({
        url: '/operator/getAll',
        params,
      }),
    }),
    getOperatorById: builder.query<
      OperatorGetByOperatorIdResponse,
      OperatorParamsForOperatorId
    >({
      query: params => ({
        url: `/operator/get`,
        method: 'GET',
        params,
      }),
      providesTags: [{ type: 'operator' }],
    }),
    createOperator: builder.mutation<
      ResponseOfOperator,
      CreateOperatorInitialValues
    >({
      query: operator => ({
        url: '/operator/create',
        method: 'POST',
        body: operator,
      }),
    }),
    updateOperator: builder.mutation<
      ResponseOfOperator,
      UpdateOperatorInitialValues
    >({
      query: operator => ({
        url: '/operator/edit',
        method: 'PUT',
        body: operator,
      }),
    }),
  }),
});
export const {
  useGetAllOperatorQuery,
  useLazyGetAllOperatorQuery,
  useLazyGetOperatorByIdQuery,
  useCreateOperatorMutation,
  useUpdateOperatorMutation,
} = operatorApi;
