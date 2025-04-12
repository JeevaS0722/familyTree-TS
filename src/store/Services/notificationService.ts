import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import { SubscriberHMACHashResponse } from '../../interface/notification';

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['notification'],
  endpoints: builder => ({
    getSubscriberHMACHash: builder.query<SubscriberHMACHashResponse, void>({
      query: () => ({
        url: `/novu/subscriber/hmacHash`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetSubscriberHMACHashQuery } = notificationApi;
