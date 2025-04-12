import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import {
  CreateTaxResponse,
  DeleteTaxResponse,
  EditTaxForm,
  EditTaxResponse,
  NewTaxForm,
  TaxDeedResponse,
  TaxDetailQueryParams,
  TaxDetailResponse,
  TaxesDeedQueryParams,
} from '../../interface/tax';

export const taxApi = createApi({
  reducerPath: 'taxApi',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    createTax: builder.mutation<CreateTaxResponse, NewTaxForm>({
      query: taxData => ({
        url: `/tax/create`,
        method: 'POST',
        body: taxData,
      }),
    }),
    getAllTaxesByDeed: builder.query<TaxDeedResponse, TaxesDeedQueryParams>({
      query: ({ deedId, order, orderBy }) => ({
        url: `/tax/getAll`,
        params: {
          deedId,
          orderBy,
          order,
        },
      }),
    }),
    getTaxDetails: builder.query<TaxDetailResponse, TaxDetailQueryParams>({
      query: ({ taxId }) => ({
        url: `/tax/get`,
        params: { taxId },
      }),
    }),
    editTax: builder.mutation<EditTaxResponse, EditTaxForm>({
      query: legalData => ({
        url: `/tax/edit`,
        method: 'PUT',
        body: legalData,
      }),
    }),
    deleteTax: builder.mutation<DeleteTaxResponse, TaxDetailQueryParams>({
      query: ({ taxId }) => ({
        url: `/tax/delete`,
        method: 'DELETE',
        params: { taxId },
      }),
    }),
  }),
});

export const {
  useCreateTaxMutation,
  useEditTaxMutation,
  useLazyGetTaxDetailsQuery,
  useLazyGetAllTaxesByDeedQuery,
  useDeleteTaxMutation,
} = taxApi;
