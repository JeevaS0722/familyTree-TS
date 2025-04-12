import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import {
  CompleteOrderPayload,
  OrderGetByOrderIdResponse,
  OrderParamsForOrderId,
  Response,
  OrderCreateResponse,
  OrderDetailsData,
  OrderGetALLByContactIdResponse,
  OrderParamsForContactId,
  EditOrderDetailsDataFormData,
  OrderParamsForDelete,
} from '../../interface/order';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Order'],
  endpoints: builder => ({
    completeOrder: builder.mutation<Response, CompleteOrderPayload>({
      query: completeOrderData => ({
        url: `/order/complete`,
        method: 'PUT',
        body: completeOrderData,
      }),
    }),
    getOrderByOrderId: builder.query<
      OrderGetByOrderIdResponse,
      OrderParamsForOrderId
    >({
      query: params => ({
        url: `/order/get`,
        method: 'GET',
        params,
      }),
      providesTags: [{ type: 'Order' }],
    }),
    createOrder: builder.mutation<OrderCreateResponse, OrderDetailsData>({
      query: params => ({
        url: `/order/create`,
        method: 'POST',
        body: params,
      }),
    }),
    getAllOrders: builder.query<
      OrderGetALLByContactIdResponse,
      OrderParamsForContactId
    >({
      query: params => ({
        url: `/order/getAll`,
        method: 'GET',
        params,
      }),
    }),
    updateOrder: builder.mutation<
      OrderCreateResponse,
      EditOrderDetailsDataFormData
    >({
      query: params => ({
        url: `/order/edit`,
        method: 'PUT',
        body: params,
      }),
    }),
    deleteOrder: builder.mutation<Response, OrderParamsForDelete>({
      query: params => ({
        url: `/order/delete`,
        method: 'DELETE',
        params,
      }),
    }),
  }),
});

export const {
  useLazyGetOrderByOrderIdQuery,
  useCompleteOrderMutation,
  useCreateOrderMutation,
  useLazyGetAllOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
