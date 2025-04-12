import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import { OrderParamsForOrderId, Response } from '../../interface/order';
import {
  GetDocQueryParams,
  GetGeneratedDocByIdQuery,
  GetGeneratedDocByIdResponse,
  GetGeneratedDocResponse,
  GetGeneratedDocSignedUrlQuery,
  GetGeneratedDocSignedUrlResponse,
} from '../../interface/doc';
import {
  GenerateDeedDocPayload,
  GenerateLetterDocPayload,
} from '../../interface/offer';
import { GenerateDeedReceivedLetterDocPayload } from '../../interface/deed';

export const docApi = createApi({
  reducerPath: 'docApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['doc'],
  endpoints: builder => ({
    generateProbateDocument: builder.mutation<Response, OrderParamsForOrderId>({
      query: payload => ({
        url: `/doc/order/probate`,
        method: 'POST',
        body: payload,
      }),
    }),
    getGeneratedDocuments: builder.query<
      GetGeneratedDocResponse,
      GetDocQueryParams
    >({
      query: params => ({
        url: `/doc/getAll`,
        method: 'GET',
        params: params,
      }),
    }),
    getGeneratedDocById: builder.query<
      GetGeneratedDocByIdResponse,
      GetGeneratedDocByIdQuery
    >({
      query: params => ({
        url: `/doc/get`,
        method: 'GET',
        params: params,
      }),
    }),
    getGeneratedDocSignedUrl: builder.query<
      GetGeneratedDocSignedUrlResponse,
      GetGeneratedDocSignedUrlQuery
    >({
      query: params => ({
        url: `/doc/generated/getSignedUrl`,
        method: 'GET',
        params: params,
      }),
    }),
    generateOfferDeedDocument: builder.mutation<
      Response,
      GenerateDeedDocPayload
    >({
      query: payload => ({
        url: `/doc/offer/deed`,
        method: 'POST',
        body: payload,
      }),
    }),
    generateOfferLetterDocument: builder.mutation<
      Response,
      GenerateLetterDocPayload
    >({
      query: payload => ({
        url: `/doc/offer/letter`,
        method: 'POST',
        body: payload,
      }),
    }),
    generateOfferPostCardDocument: builder.mutation<
      Response,
      GenerateLetterDocPayload
    >({
      query: payload => ({
        url: `/doc/offer/postCard`,
        method: 'POST',
        body: payload,
      }),
    }),
    generateDeedReceivedLetterDocument: builder.mutation<
      Response,
      GenerateDeedReceivedLetterDocPayload
    >({
      query: payload => ({
        url: `/doc/deed/deedReceivedLetter`,
        method: 'POST',
        body: payload,
      }),
    }),
    generateHonorPreviousOfferLetterDocument: builder.mutation<
      Response,
      GenerateLetterDocPayload
    >({
      query: payload => ({
        url: `/doc/offer/honorPreviousOfferLetter`,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const {
  useGenerateProbateDocumentMutation,
  useLazyGetGeneratedDocumentsQuery,
  useLazyGetGeneratedDocSignedUrlQuery,
  useGenerateOfferDeedDocumentMutation,
  useGenerateHonorPreviousOfferLetterDocumentMutation,
  useGenerateOfferLetterDocumentMutation,
  useGenerateOfferPostCardDocumentMutation,
  useLazyGetGeneratedDocByIdQuery,
  useGenerateDeedReceivedLetterDocumentMutation,
} = docApi;
