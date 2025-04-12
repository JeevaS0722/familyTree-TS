import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '.';
import {
  FileNamePhoneSearchResponse,
  FileSearchResponse,
  FormValues,
} from '../../interface/searchFile';
import { FileByNameOrPhoneQueryParams } from '../../interface/searchFileByNameOrPhone';
import { OfferParams, OfferSearchItem } from '../../interface/searchOffer';
import { Address, CourtParams } from '../../interface/searchCourts';
import { DeedsParams } from '../../interface/searchDeed';
import {
  OperatorsSearchItem,
  SearchOperatorParams,
} from '../../interface/searchOperator';
import {
  WellMaster,
  WellMastersParams,
} from '../../interface/searchWellMasters';
import {
  MOEASearchItem,
  SearchMOEAByFiltersParams,
  SearchMOEAByNameParams,
} from '../../interface/searchMoea';

export const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    getFiles: builder.query<FileSearchResponse, FormValues>({
      query: params => ({
        url: '/search/files',
        method: 'GET',
        params,
      }),
    }),
    getFilesByNameOrPhone: builder.query<
      FileNamePhoneSearchResponse,
      FileByNameOrPhoneQueryParams
    >({
      query: params => ({
        url: '/search/name_phone',
        method: 'GET',
        params,
      }),
    }),
    getOffers: builder.query<OfferSearchItem, OfferParams>({
      query: params => ({
        url: '/search/offers',
        method: 'GET',
        params,
      }),
    }),
    getCourts: builder.query<
      { address: Address[]; count: number },
      CourtParams
    >({
      query: params => ({
        url: '/search/court/address',
        method: 'GET',
        params,
      }),
    }),
    getDeeds: builder.query<{ deeds: Address[]; count: number }, DeedsParams>({
      query: params => ({
        url: '/search/deeds',
        method: 'GET',
        params,
      }),
    }),
    getOperators: builder.query<OperatorsSearchItem, SearchOperatorParams>({
      query: params => ({
        url: '/search/operators',
        method: 'GET',
        params,
      }),
    }),
    getWellMasters: builder.query<
      { wellMasters: WellMaster[]; count: number },
      WellMastersParams
    >({
      query: params => ({
        url: '/search/wellMaster',
        method: 'GET',
        params,
      }),
    }),
    getMOEAByFilters: builder.query<MOEASearchItem, SearchMOEAByFiltersParams>({
      query: params => ({
        url: '/search/MOEA/byFilters',
        method: 'GET',
        params,
      }),
    }),
    getMOEAByName: builder.query<MOEASearchItem, SearchMOEAByNameParams>({
      query: params => ({
        url: '/search/MOEA/byName',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const {
  useLazyGetFilesQuery,
  useLazyGetFilesByNameOrPhoneQuery,
  useLazyGetOffersQuery,
  useLazyGetCourtsQuery,
  useLazyGetDeedsQuery,
  useLazyGetOperatorsQuery,
  useLazyGetWellMastersQuery,
  useLazyGetMOEAByFiltersQuery,
  useLazyGetMOEAByNameQuery,
} = searchApi;
