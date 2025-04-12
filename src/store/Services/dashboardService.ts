import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './index';
import {
  ActionResponse,
  CheckedOutResponse,
  DeedsPendingResponse,
  FileReviewParams,
  FileReviewResponse,
  LayoutResponse,
  MetricResponse,
  OffersToSendResponse,
  ReadyForOfferResponse,
  RequestBefore21Days,
  RequestsToSendResponse,
  SearchCheckedOutQueryParams,
  SearchDeedsPendingQueryParams,
  SearchMyTaskQueryParams,
  SearchOfferToSendQueryParams,
  SearchReadyForOfferQueryParams,
  SearchRequestBefore21DaysQueryParams,
  SearchRequestToSendQueryParams,
  TasksReponse,
  UnreceivedRequestsParams,
  UnreceivedRequestsResponse,
} from '../../interface/dashboard';
import {
  GetGoalCountResponse,
  UpdateGoalRequest,
  UpdateGoalResponse,
} from '../../interface/draftDue';

export const dashboardAPI = createApi({
  reducerPath: 'dashboardAPI',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    getDashboardLayout: builder.query<LayoutResponse, void>({
      query: () => ({
        url: `/dashboard/layout`,
      }),
    }),
    getDashboardActions: builder.query<ActionResponse, string>({
      query: () => ({
        url: `/dashboard/actions`,
      }),
    }),
    getDashboardMetrics: builder.query<MetricResponse, string>({
      query: () => ({
        url: `/dashboard/metrics`,
      }),
    }),
    getReadyForOffer: builder.query<
      ReadyForOfferResponse,
      SearchReadyForOfferQueryParams
    >({
      query: params => ({
        url: `/dashboard/action/readyForOffer`,
        params,
      }),
    }),
    getFileReview: builder.query<FileReviewResponse, FileReviewParams>({
      query: params => ({
        url: `/dashboard/action/fileReview`,
        params,
      }),
    }),
    getMyTasks: builder.query<TasksReponse, SearchMyTaskQueryParams>({
      query: params => ({
        url: `/dashboard/action/myTasks`,
        params,
      }),
    }),
    getUrgentTasks: builder.query<TasksReponse, SearchMyTaskQueryParams>({
      query: params => ({
        url: `/dashboard/action/urgentTasks`,
        params,
      }),
    }),
    getTeamMateTasks: builder.query<TasksReponse, SearchMyTaskQueryParams>({
      query: params => ({
        url: `/dashboard/action/teamMateTasks`,
        params,
      }),
    }),
    getResearchTasks: builder.query<TasksReponse, SearchMyTaskQueryParams>({
      query: params => ({
        url: `/dashboard/action/researchTasks`,
        params,
      }),
    }),
    getRequestBefore21Days: builder.query<
      RequestBefore21Days,
      SearchRequestBefore21DaysQueryParams
    >({
      query: params => ({
        url: `/dashboard/action/requestsBefore21Days`,
        params,
      }),
    }),
    getCheckedOut: builder.query<
      CheckedOutResponse,
      SearchCheckedOutQueryParams
    >({
      query: params => ({
        url: `/dashboard/action/checkedOut`,
        params,
      }),
    }),
    getUnreceivedRequests: builder.query<
      UnreceivedRequestsResponse,
      UnreceivedRequestsParams
    >({
      query: params => ({
        url: `/dashboard/action/unreceivedRequests`,
        params,
      }),
    }),
    getRequestsToSend: builder.query<
      RequestsToSendResponse,
      SearchRequestToSendQueryParams
    >({
      query: params => ({
        url: `/dashboard/action/requestsToSend`,
        params,
      }),
    }),
    getOffersToSend: builder.query<
      OffersToSendResponse,
      SearchOfferToSendQueryParams
    >({
      query: params => ({
        url: `/dashboard/action/offersToSend`,
        params,
      }),
    }),
    getDeedsPending: builder.query<
      DeedsPendingResponse,
      SearchDeedsPendingQueryParams
    >({
      query: params => ({
        url: `/dashboard/action/deedsPending`,
        params,
      }),
    }),
    getAllNewWellCount: builder.mutation<GetGoalCountResponse, void>({
      query: () => ({
        url: `/dashboard/goal/allCount`,
        method: 'GET',
      }),
    }),
    updateGoal: builder.mutation<UpdateGoalResponse, UpdateGoalRequest>({
      query: updateData => ({
        url: `/dashboard/goal/updateGoal`,
        method: 'PUT',
        body: updateData,
      }),
    }),
  }),
});

export const {
  useGetDashboardLayoutQuery,
  useGetDashboardActionsQuery,
  useGetDashboardMetricsQuery,
  useLazyGetDashboardActionsQuery,
  useLazyGetDashboardMetricsQuery,
  useLazyGetReadyForOfferQuery,
  useLazyGetFileReviewQuery,
  useLazyGetMyTasksQuery,
  useLazyGetUrgentTasksQuery,
  useLazyGetResearchTasksQuery,
  useLazyGetTeamMateTasksQuery,
  useLazyGetRequestBefore21DaysQuery,
  useLazyGetCheckedOutQuery,
  useLazyGetUnreceivedRequestsQuery,
  useLazyGetRequestsToSendQuery,
  useLazyGetOffersToSendQuery,
  useLazyGetDeedsPendingQuery,
  useGetAllNewWellCountMutation,
  useUpdateGoalMutation,
} = dashboardAPI;
