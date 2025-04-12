import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import {
  DraftRequestCheckDetails,
  RequestCheckCreateResponse,
  RequestCheckDetails,
} from '../../interface/requestCheck';

export const requestCheckApi = createApi({
  reducerPath: 'requestCheckApi',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    createRequestCheck: builder.mutation<
      RequestCheckCreateResponse,
      RequestCheckDetails
    >({
      query: requestCheckData => ({
        url: `/requestCheck/create`,
        method: 'POST',
        body: requestCheckData,
      }),
    }),
    createDraftRequestCheck: builder.mutation<
      RequestCheckCreateResponse,
      DraftRequestCheckDetails
    >({
      query: requestCheckData => ({
        url: `/requestCheck/draft/create`,
        method: 'POST',
        body: requestCheckData,
      }),
    }),
  }),
});

export const {
  useCreateRequestCheckMutation,
  useCreateDraftRequestCheckMutation,
} = requestCheckApi;
