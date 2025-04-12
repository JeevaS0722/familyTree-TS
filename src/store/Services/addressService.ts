import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import {
  AddressesResponse,
  NewAddressForm,
  getAddressParams,
  CreateAddressResponse,
  getAddressIdParams,
  AddressResponse,
  getAddressCountyParams,
  AddressesResponseByCounty,
  EditAddressForm,
} from '../../interface/address';

export const addressApi = createApi({
  reducerPath: 'addressApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Address'],
  endpoints: builder => ({
    getAddressByState: builder.query<AddressesResponse, getAddressParams>({
      query: params => ({
        url: `/address/get/ByState`,
        method: 'GET',
        params,
      }),
    }),
    createAddress: builder.mutation<CreateAddressResponse, NewAddressForm>({
      query: addressDate => ({
        url: `/address/create`,
        method: 'POST',
        body: addressDate,
      }),
    }),
    getAddressById: builder.query<AddressResponse, getAddressIdParams>({
      query: params => ({
        url: `/address/get`,
        method: 'GET',
        params,
      }),
    }),
    getAddressByCounty: builder.query<
      AddressesResponseByCounty,
      getAddressCountyParams
    >({
      query: params => ({
        url: `/address/get/byCounty`,
        method: 'GET',
        params,
      }),
    }),
    updateAddress: builder.mutation<AddressResponse, EditAddressForm>({
      query: addressDate => ({
        url: `/address/edit`,
        method: 'PUT',
        body: addressDate,
      }),
    }),
  }),
});

export const {
  useLazyGetAddressByStateQuery,
  useCreateAddressMutation,
  useLazyGetAddressByIdQuery,
  useLazyGetAddressByCountyQuery,
  useUpdateAddressMutation,
} = addressApi;
