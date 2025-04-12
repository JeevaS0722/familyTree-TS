import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '.';
import { Employee } from '../../interface/employee';

export const employeeApi = createApi({
  reducerPath: 'buyerApi',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    getAllBuyers: builder.query<{ data: { buyers: Employee[] } }, void>({
      query: () => `/buyer/getAll`,
    }),
  }),
});

export const { useGetAllBuyersQuery } = employeeApi;
