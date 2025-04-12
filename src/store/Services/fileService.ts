import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import {
  CreateFileResponse,
  EditFileResponse,
  FileData,
  FileDetails,
  Response,
  FileDetailsData,
  CheckoutPayload,
} from '../../interface/file';
import { recyclePayload } from '../../interface/recycle';
import { askResearchPayload } from '../../interface/askResearch';
import { deadFilePayload } from '../../interface/deadFile';
import { ticklerPayload } from '../../interface/tickler';

export const fileApi = createApi({
  reducerPath: 'fileApi',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    createFile: builder.mutation<CreateFileResponse, FileData>({
      query: fileData => ({
        url: `/file/create`,
        method: 'POST',
        body: fileData,
      }),
    }),
    getFileDetails: builder.query<
      { data: { file: FileDetailsData } },
      { fileid: number }
    >({
      query: ({ fileid }) => `/file/get?fileid=${fileid}`,
    }),
    editFile: builder.mutation<EditFileResponse, FileDetails>({
      query: fileData => ({
        url: `/file/edit`,
        method: 'PUT',
        body: fileData,
      }),
    }),
    checkoutFile: builder.mutation<Response, CheckoutPayload>({
      query: checkoutData => ({
        url: `/file/checkout`,
        method: 'PUT',
        body: checkoutData,
      }),
    }),
    recycle: builder.mutation<Response, recyclePayload>({
      query: data => ({
        url: `/file/recycle`,
        method: 'POST',
        body: data,
      }),
    }),
    askResearch: builder.mutation<Response, askResearchPayload>({
      query: data => ({
        url: `/file/ask/research`,
        method: 'POST',
        body: data,
      }),
    }),
    deadFile: builder.mutation<Response, deadFilePayload>({
      query: data => ({
        url: `/file/dead`,
        method: 'POST',
        body: data,
      }),
    }),
    tickler: builder.mutation<Response, ticklerPayload>({
      query: data => ({
        url: `/file/tickler`,
        method: 'POST',
        body: data,
      }),
    }),
    printFile: builder.query<{ fileURL: string }, { fileId: number }>({
      query: ({ fileId }) => `/file/print?fileId=${fileId}`,
    }),
    printDeed: builder.query<{ fileURL: string }, { deedId: number }>({
      query: ({ deedId }) => `/deed/print?deedId=${deedId}`,
    }),
  }),
});

export const {
  useCreateFileMutation,
  useGetFileDetailsQuery,
  useLazyGetFileDetailsQuery,
  useEditFileMutation,
  useCheckoutFileMutation,
  useAskResearchMutation,
  useDeadFileMutation,
  useRecycleMutation,
  useTicklerMutation,
  useLazyPrintFileQuery,
  useLazyPrintDeedQuery,
} = fileApi;
