import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import {
  ContactDetailQueryParams,
  ContactDetailResponse,
  ContactFileQueryParams,
  ContactFileResponse,
  ContactsQueryParams,
  ContactsResult,
  CreateContactResponse,
  DeleteContactResponse,
  DeletePhoneEmailResponse,
  EditContactData,
  EditContactResponse,
  EmailDetailQueryParams,
  NewContactPayload,
  PhoneDetailQueryParams,
} from '../../interface/contact';

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    createContact: builder.mutation<CreateContactResponse, NewContactPayload>({
      query: contactData => ({
        url: `/contact/create`,
        method: 'POST',
        body: contactData,
      }),
    }),
    getContactsByFile: builder.query<
      ContactFileResponse,
      ContactFileQueryParams
    >({
      query: ({ fileid, sortBy, sortOrder }) => ({
        url: `/contact/get`,
        params: { fileid, sortBy, sortOrder },
      }),
    }),
    getContactsByIds: builder.query<ContactsResult, ContactsQueryParams>({
      query: ({ contactIds, sortBy, sortOrder }) => ({
        url: `/contact/getByIds`,
        params: { contactIds, sortBy, sortOrder },
      }),
    }),
    getContactDetails: builder.query<
      ContactDetailResponse,
      ContactDetailQueryParams
    >({
      query: ({ contactId }) => ({
        url: `/contact/get`,
        params: { contactId },
      }),
    }),
    editContact: builder.mutation<EditContactResponse, EditContactData>({
      query: contactData => ({
        url: `/contact/edit`,
        method: 'PUT',
        body: contactData,
      }),
    }),
    deleteContact: builder.mutation<
      DeleteContactResponse,
      ContactDetailQueryParams
    >({
      query: ({ contactId }) => ({
        url: `/contact/delete`,
        method: 'DELETE',
        params: { contactId },
      }),
    }),
    deletePhone: builder.mutation<
      DeletePhoneEmailResponse,
      PhoneDetailQueryParams
    >({
      query: ({ phoneId }) => ({
        url: `/contact/phone/delete`,
        method: 'DELETE',
        params: { phoneId },
      }),
    }),
    deleteEmail: builder.mutation<
      DeletePhoneEmailResponse,
      EmailDetailQueryParams
    >({
      query: ({ emailId }) => ({
        url: `/contact/email/delete`,
        method: 'DELETE',
        params: { emailId },
      }),
    }),
  }),
});

export const {
  useCreateContactMutation,
  useLazyGetContactsByFileQuery,
  useLazyGetContactDetailsQuery,
  useLazyGetContactsByIdsQuery,
  useEditContactMutation,
  useDeleteContactMutation,
  useDeletePhoneMutation,
  useDeleteEmailMutation,
} = contactApi;
