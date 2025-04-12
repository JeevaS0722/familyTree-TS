import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosRequestWithReauth, baseQuery } from '.';
import {
  County,
  LetterType,
  OfferType,
  Place,
  State,
  TitleType,
} from '../../interface/common';
import { UploadFileResponse } from '../../interface/document';

export const commonApi = createApi({
  reducerPath: 'commonApi',
  baseQuery,
  endpoints: builder => ({
    getFileStatus: builder.query<{ places: Place[] }, void>({
      query: () => `/common/places?type=7`,
    }),
    getFileLocation: builder.query<{ places: Place[] }, void>({
      query: () => `/common/places?type=8`,
    }),
    getStates: builder.query<{ states: State[] }, void>({
      query: () => `/common/states`,
    }),
    getOfferType: builder.query<{ data: OfferType[] }, void>({
      query: () => `/common/offer_types`,
    }),
    getLetterType: builder.query<{ data: LetterType[] }, void>({
      query: () => `/common/letter_types`,
    }),
    getOrderTypes: builder.query<{ places: Place[] }, void>({
      query: () => `/common/places?type=6`,
    }),
    getCounties: builder.query<{ counties: County[] }, { state: string }>({
      query: params => ({
        url: `/common/counties`,
        method: 'GET',
        params,
      }),
    }),
    createJiraTicket: builder.mutation<
      UploadFileResponse,
      {
        formData: FormData;
      }
    >({
      queryFn: async ({ formData }, api) => {
        return axiosRequestWithReauth(`/common/jira/create`, formData, api);
      },
    }),
    getTitleNames: builder.query<{ data: TitleType[] }, void>({
      query: () => `/common/titles`,
    }),
  }),
});

export const {
  useGetFileStatusQuery,
  useGetFileLocationQuery,
  useGetStatesQuery,
  useLazyGetStatesQuery,
  useGetOfferTypeQuery,
  useGetLetterTypeQuery,
  useGetOrderTypesQuery,
  useLazyGetCountiesQuery,
  useCreateJiraTicketMutation,
  useGetTitleNamesQuery,
} = commonApi;
