import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import {
  OfferFollowUpUsersResponse,
  Response,
  CompleteOfferPayload,
  CreateOfferResponse,
  OfferData,
  OfferGetResponse,
  OfferQueryParams,
  OfferGetByOfferIdResponse,
  OfferQueryParamsForOfferId,
  EditOfferResponse,
  EditOfferValues,
  RecentOfferQueryParams,
  RecentOfferGetResponse,
  GetUniqueLegalStateByOfferResponse,
} from '../../interface/offer';

export const offerApi = createApi({
  reducerPath: 'offerApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Offer'],
  endpoints: builder => ({
    createOffer: builder.mutation<CreateOfferResponse, OfferData>({
      query: offerData => ({
        url: `/offer/create_offer`,
        method: 'POST',
        body: offerData,
      }),
    }),
    getOfferDetails: builder.query<OfferGetResponse, OfferQueryParams>({
      query: params => ({
        url: '/offer/get',
        method: 'GET',
        params,
      }),
    }),
    getOfferFollowUpUsers: builder.query<OfferFollowUpUsersResponse, void>({
      query: () => ({
        url: `/offer/followUp/users`,
      }),
    }),
    completeOffer: builder.mutation<Response, CompleteOfferPayload>({
      query: completeOfferData => ({
        url: `/offer/complete`,
        method: 'PUT',
        body: completeOfferData,
      }),
    }),
    getOfferByOfferId: builder.query<
      OfferGetByOfferIdResponse,
      OfferQueryParamsForOfferId
    >({
      query: params => ({
        url: '/offer/get/byOfferId',
        method: 'GET',
        params,
      }),
      providesTags: [{ type: 'Offer' }],
    }),
    editOffer: builder.mutation<EditOfferResponse, EditOfferValues>({
      query: offerData => ({
        url: `/offer/edit`,
        method: 'PUT',
        body: offerData,
      }),
      invalidatesTags: [{ type: 'Offer' }],
    }),
    deleteOffer: builder.mutation<Response, OfferQueryParamsForOfferId>({
      query: params => ({
        url: `/offer/delete`,
        method: 'DELETE',
        params,
      }),
    }),
    recentOffer: builder.query<RecentOfferGetResponse, RecentOfferQueryParams>({
      query: params => ({
        url: '/offer/get/recentOffer',
        method: 'GET',
        params,
      }),
    }),
    getUniqueLegalStateByOffers: builder.query<
      GetUniqueLegalStateByOfferResponse,
      OfferQueryParamsForOfferId
    >({
      query: params => ({
        url: '/offer/get/uniqueLegalStatesByOffer',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const {
  useCreateOfferMutation,
  useLazyGetOfferDetailsQuery,
  useGetOfferFollowUpUsersQuery,
  useCompleteOfferMutation,
  useLazyGetOfferByOfferIdQuery,
  useEditOfferMutation,
  useDeleteOfferMutation,
  useLazyRecentOfferQuery,
  useGetUniqueLegalStateByOffersQuery,
} = offerApi;
