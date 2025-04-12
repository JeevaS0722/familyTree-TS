import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import {
  Response,
  getContactNoteListQueryParams,
  getContactNoteListResponse,
  getDeedNoteListQueryParams,
  getDeedNoteListResponse,
  getFileNoteListQueryParams,
  getFileNoteListResponse,
  getNoteResponse,
  getOrderNoteListQueryParams,
  getOrderNoteListResponse,
  addContactNotePayload,
  addDeedNotePayload,
  addFileNotePayload,
  deleteNotePayload,
  editNotePayload,
  getNoteQueryParams,
} from '../../interface/note';

export const noteAPI = createApi({
  reducerPath: 'noteAPI',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    getFileNoteList: builder.query<
      getFileNoteListResponse,
      getFileNoteListQueryParams
    >({
      query: query => ({
        url: `/note/file/getAll`,
        method: 'GET',
        params: query,
      }),
    }),
    getDeedNoteList: builder.query<
      getDeedNoteListResponse,
      getDeedNoteListQueryParams
    >({
      query: query => ({
        url: `/note/deed/getAll`,
        method: 'GET',
        params: query,
      }),
    }),
    getOrderNoteList: builder.query<
      getOrderNoteListResponse,
      getOrderNoteListQueryParams
    >({
      query: query => ({
        url: `/note/order/getAll`,
        method: 'GET',
        params: query,
      }),
    }),
    getContactNoteList: builder.query<
      getContactNoteListResponse,
      getContactNoteListQueryParams
    >({
      query: query => ({
        url: `/note/contact/getAll`,
        method: 'GET',
        params: query,
      }),
    }),
    addFileNote: builder.mutation<Response, addFileNotePayload>({
      query: data => ({
        url: `/note/file/create`,
        method: 'POST',
        body: data,
      }),
    }),
    addDeedNote: builder.mutation<Response, addDeedNotePayload>({
      query: data => ({
        url: `/note/deed/create`,
        method: 'POST',
        body: data,
      }),
    }),
    addContactNote: builder.mutation<Response, addContactNotePayload>({
      query: data => ({
        url: `/note/contact/create`,
        method: 'POST',
        body: data,
      }),
    }),
    updateNote: builder.mutation<Response, editNotePayload>({
      query: data => ({
        url: `/note/update`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteNote: builder.mutation<Response, deleteNotePayload>({
      query: data => ({
        url: `/note/delete`,
        method: 'Delete',
        params: data,
      }),
    }),
    getNote: builder.query<getNoteResponse, getNoteQueryParams>({
      query: params => ({
        url: `/note/get`,
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const {
  useLazyGetFileNoteListQuery,
  useLazyGetDeedNoteListQuery,
  useLazyGetContactNoteListQuery,
  useLazyGetOrderNoteListQuery,
  useLazyGetNoteQuery,
  useAddFileNoteMutation,
  useAddDeedNoteMutation,
  useAddContactNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = noteAPI;
