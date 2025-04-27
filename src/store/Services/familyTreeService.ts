import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import {
  CreateTreeResponse,
  NewTreePayload,
  TreeQueryParams,
  ContactFileQueryParams,
  ContactFileResponse,
  ContactUpdateQueryParams,
} from '../../interface/familyTree';

export const familyTreeApi = createApi({
  reducerPath: 'familyTreeApi',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    createFamilyTree: builder.mutation<CreateTreeResponse, NewTreePayload>({
      query: treeData => ({
        url: `/familyTree/create`,
        method: 'POST',
        body: treeData,
      }),
    }),
    getFamilyTree: builder.query<CreateTreeResponse, TreeQueryParams>({
      query: ({ fileId }) => ({
        url: `/familyTree/get`,
        params: { fileId },
      }),
    }),
    editFamilyTree: builder.mutation<CreateTreeResponse, NewTreePayload>({
      query: treeData => ({
        url: `/familyTree/edit`,
        method: 'PUT',
        body: treeData,
      }),
    }),
    getContactDetails: builder.query<
      ContactFileResponse,
      ContactFileQueryParams
    >({
      query: ({ fileId }) => ({
        url: `/familyTree/contact/get`,
        params: { fileId },
      }),
    }),
    updateContactDetails: builder.mutation<
      CreateTreeResponse,
      ContactUpdateQueryParams
    >({
      query: contact => ({
        url: `/familyTree/contact/edit`,
        method: 'PUT',
        body: contact,
      }),
    }),
  }),
});

export const {
  useCreateFamilyTreeMutation,
  useLazyGetFamilyTreeQuery,
  useEditFamilyTreeMutation,
  useGetFamilyTreeQuery,
  useLazyGetContactDetailsQuery,
  useGetContactDetailsQuery,
  useUpdateContactDetailsMutation,
} = familyTreeApi;
