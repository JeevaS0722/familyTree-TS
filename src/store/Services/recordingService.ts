import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import {
  CrateRecordingResponse,
  DeleteRecordingResponse,
  RecordingDetailsData,
  RecordingGetAllByDeedIdResponse,
  RecordingGetByRecIdResponse,
  RecordingParamsForDeedId,
  RecordingParamsForRecId,
  UpdateRecordingDetailsData,
} from '../../interface/recording';

export const recordingApi = createApi({
  reducerPath: 'recordingApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['recording'],
  endpoints: builder => ({
    getRecordingByRecId: builder.query<
      RecordingGetByRecIdResponse,
      RecordingParamsForRecId
    >({
      query: params => ({
        url: `/recording/get`,
        method: 'GET',
        params,
      }),
      providesTags: [{ type: 'recording' }],
    }),
    getAllRecordings: builder.query<
      RecordingGetAllByDeedIdResponse,
      RecordingParamsForDeedId
    >({
      query: params => ({
        url: `/recording/getAll`,
        method: 'GET',
        params,
      }),
    }),
    createRecording: builder.mutation<
      CrateRecordingResponse,
      RecordingDetailsData
    >({
      query: recordingData => ({
        url: `/recording/create`,
        method: 'POST',
        body: recordingData,
      }),
    }),
    editRecording: builder.mutation<
      CrateRecordingResponse,
      UpdateRecordingDetailsData
    >({
      query: recordingData => ({
        url: `/recording/edit`,
        method: 'PUT',
        body: recordingData,
      }),
    }),
    deleteRecording: builder.mutation<
      DeleteRecordingResponse,
      RecordingParamsForRecId
    >({
      query: ({ recId }) => ({
        url: `/recording/delete`,
        method: 'DELETE',
        params: { recId },
      }),
    }),
  }),
});

export const {
  useLazyGetAllRecordingsQuery,
  useLazyGetRecordingByRecIdQuery,
  useCreateRecordingMutation,
  useEditRecordingMutation,
  useDeleteRecordingMutation,
} = recordingApi;
