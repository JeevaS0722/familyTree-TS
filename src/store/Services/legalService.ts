import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import {
  CopyLegalPayload,
  CreateLegalResponse,
  EditLegalPayload,
  EditLegalResponse,
  LegalDetailQueryParams,
  LegalDetailResponse,
  LegalFileQueryParams,
  LegalFileResponse,
  NewLegalPayload,
} from '../../interface/legal';

export const legalApi = createApi({
  reducerPath: 'legalApi',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    createLegal: builder.mutation<CreateLegalResponse, NewLegalPayload>({
      query: legalData => ({
        url: `/legal/create`,
        method: 'POST',
        body: legalData,
      }),
    }),
    getLegalsByFile: builder.query<LegalFileResponse, LegalFileQueryParams>({
      query: ({
        fileId,
        TX_LA_legal_sortBy,
        TX_LA_legal_sortOrder,
        Other_legal_sortBy,
        Other_legal_sortOrder,
      }) => ({
        url: `/legal/getAll`,
        params: {
          fileId,
          TX_LA_legal_sortBy,
          TX_LA_legal_sortOrder,
          Other_legal_sortBy,
          Other_legal_sortOrder,
        },
      }),
    }),
    getLegalDetails: builder.query<LegalDetailResponse, LegalDetailQueryParams>(
      {
        query: ({ legalId }) => ({
          url: `/legal/get`,
          params: { legalId },
        }),
      }
    ),
    editLegal: builder.mutation<EditLegalResponse, EditLegalPayload>({
      query: legalData => ({
        url: `/legal/edit`,
        method: 'PUT',
        body: legalData,
      }),
    }),
    deleteLegal: builder.mutation<EditLegalResponse, LegalDetailQueryParams>({
      query: ({ legalId }) => ({
        url: `/legal/delete`,
        method: 'DELETE',
        params: { legalId },
      }),
    }),
    copyLegal: builder.mutation<CreateLegalResponse, CopyLegalPayload>({
      query: legalData => ({
        url: `/legal/copy`,
        method: 'POST',
        body: legalData,
      }),
    }),
  }),
});

export const {
  useCreateLegalMutation,
  useLazyGetLegalDetailsQuery,
  useLazyGetLegalsByFileQuery,
  useEditLegalMutation,
  useCopyLegalMutation,
  useDeleteLegalMutation,
} = legalApi;
