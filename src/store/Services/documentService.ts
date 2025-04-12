/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosRequestWithReauth, baseQueryWithReauth } from './index';
import {
  DeleteDocumentResponse,
  deleteDocumentsParams,
  DocumentsResponse,
  getDocumentsParams,
  DocumentResponse,
  getDocumentParams,
  OnlyOfficePrintPayload,
  OnlyOfficeTokenResponse,
  RenameDocumentResponse,
  renameDocumentsPayload,
  UploadFileResponse,
  DuplicateDocumentListResponse,
  postDuplicateDocumentParams,
} from '../../interface/document';
import { AxiosProgressEvent } from 'axios';

export const documentApi = createApi({
  reducerPath: 'documentApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['document'],
  endpoints: builder => ({
    getDocuments: builder.query<DocumentsResponse, getDocumentsParams>({
      query: params => ({
        url: `/document/getAll`,
        method: 'GET',
        params,
      }),
    }),
    deleteDocument: builder.mutation<
      DeleteDocumentResponse,
      deleteDocumentsParams
    >({
      query: params => ({
        url: `/document/delete`,
        method: 'DELETE',
        params,
      }),
    }),
    renameDocument: builder.mutation<
      RenameDocumentResponse,
      renameDocumentsPayload
    >({
      query: params => ({
        url: `/document/rename`,
        method: 'PUT',
        body: params,
      }),
    }),
    getOnlyOfficeToken: builder.mutation<
      OnlyOfficeTokenResponse,
      deleteDocumentsParams
    >({
      query: params => ({
        url: `/document/only-office/token`,
        method: 'GET',
        params,
      }),
    }),
    uploadDocumentFile: builder.mutation<
      UploadFileResponse,
      {
        formData: FormData;
        onUploadProgress: (progressEvent: AxiosProgressEvent) => void;
        queryParams?: Record<string, any>;
      }
    >({
      queryFn: async ({ formData, onUploadProgress, queryParams }, api) => {
        return axiosRequestWithReauth(
          `/document/upload/file`,
          formData,
          api,
          onUploadProgress,
          queryParams
        );
      },
    }),
    uploadDocumentDeed: builder.mutation<
      UploadFileResponse,
      {
        formData: FormData;
        onUploadProgress: (progressEvent: AxiosProgressEvent) => void;
        queryParams?: Record<string, any>;
      }
    >({
      queryFn: async ({ formData, onUploadProgress, queryParams }, api) => {
        return axiosRequestWithReauth(
          `/document/upload/deed`,
          formData,
          api,
          onUploadProgress,
          queryParams
        );
      },
    }),
    getOnlyOfficePrintToken: builder.mutation<
      OnlyOfficeTokenResponse,
      OnlyOfficePrintPayload
    >({
      query: formData => ({
        url: `/document/print/only-office/token`,
        method: 'POST',
        body: formData,
      }),
    }),
    getDocument: builder.query<DocumentResponse, getDocumentParams>({
      query: params => ({
        url: `/document/get`,
        method: 'GET',
        params,
      }),
    }),
    getDuplicateDocumentList: builder.mutation<
      DuplicateDocumentListResponse,
      postDuplicateDocumentParams
    >({
      query: params => ({
        url: `/document/upload/duplicateCheck`,
        method: 'POST',
        body: params,
      }),
    }),
  }),
});

export const {
  useLazyGetDocumentsQuery,
  useDeleteDocumentMutation,
  useRenameDocumentMutation,
  useGetOnlyOfficeTokenMutation,
  useUploadDocumentFileMutation,
  useUploadDocumentDeedMutation,
  useGetOnlyOfficePrintTokenMutation,
  useLazyGetDocumentQuery,
  useGetDuplicateDocumentListMutation,
} = documentApi;
