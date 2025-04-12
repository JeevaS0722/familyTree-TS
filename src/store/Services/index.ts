/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-async-promise-executor */
import {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { logout } from '../Reducers/auth';
import axios, { AxiosProgressEvent } from 'axios';
import { severity } from '../../interface/snackbar';
import { open as snackbarOpen } from '../Reducers/snackbar';
import { open as modalOpen } from '../Reducers/modalReducer';
import { open as errorOpen } from '../Reducers/errorReducer';
import { errorMessage } from '../../utils/constants';
import { setVersion } from '../Reducers/appReducer';

// get user's timezone
const getUserTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

const baseQueryWithCredentials = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_BASE_URL,
  prepareHeaders(headers) {
    // Get user's timezone
    const timezone = getUserTimezone();
    // Set timezone in headers
    headers.set('clienttimezone', timezone);
    return headers;
  },
  credentials: 'include',
});

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_BASE_URL,
});

/**
 * Sets the 'X-FILEMASTER-APP-VERSION' header with the application version
 * This header is typically used for version tracking in API requests.
 */
const checkAppVersion = (result: any, api: BaseQueryApi) => {
  const state = api.getState() as {
    app: {
      version?: number;
    };
  };
  const appVersion = state?.app?.version;
  const apiVersion = result?.meta?.response?.headers?.get(
    'X-Filemaster-App-Version'
  );
  if (appVersion) {
    if (
      result?.error?.status !== errorMessage.fetchError &&
      appVersion !== apiVersion
    ) {
      api.dispatch(
        modalOpen({
          showTitle: false,
          message: errorMessage.unsupportedAppVersionMsg,
          showDashboardLink: false,
        })
      );
    }
  } else if (apiVersion) {
    api.dispatch(setVersion({ version: apiVersion }));
  }
};

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQueryWithCredentials(args, api, extraOptions);
  checkAppVersion(result, api);
  if (result.error) {
    if (result.error.status === 429) {
      result.error.data = {
        ...(result.error.data || {}),
        message: errorMessage.rateLimitExceedError,
      };
    }
  }
  return result;
};

let refreshTokenPromise: Promise<unknown> | undefined;

/**
 * Refreshes the authentication token and retries the original request.
 *
 * @param args - The original request arguments, either a string or FetchArgs.
 * @param api - The BaseQueryApi object providing API interaction utilities.
 * @param extraOptions - Additional options for the request.
 * @returns A promise resolving to the result of the retried request or an error.
 *
 * This function attempts to refresh the authentication token by making a POST request
 * to the '/auth/refresh/token' endpoint. If the refresh is successful, it retries the
 * original request with the new token. If the refresh fails, it dispatches a logout action.
 * The function also checks the application version and handles any errors in the response.
 */
const refreshToken = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  let result: any;
  refreshTokenPromise = new Promise(async res =>
    res(
      await baseQueryWithCredentials(
        { url: '/auth/refresh/token', method: 'post' },
        api,
        extraOptions
      )
    )
  );
  return await refreshTokenPromise
    .then(async (refreshResult: any) => {
      refreshTokenPromise = undefined;
      if (refreshResult?.data) {
        result = await baseQueryWithCredentials(args, api, extraOptions);
        checkAppVersion(result, api);
        handleError(result, api);
        return result;
      } else {
        api.dispatch(logout());
      }
      return refreshResult;
    })
    .catch(err => err);
};

/**
 * Handles errors based on the result and API endpoint.
 *
 * @param result - The result object containing error or response information.
 * @param api - The BaseQueryApi instance used for dispatching actions.
 *
 * This function checks for errors in the result and dispatches appropriate actions
 * based on the error status. It handles different error scenarios such as fetch errors,
 * server errors, and other errors, displaying messages through modals or snackbars.
 * The function skips handling for the 'verifySignedIn' endpoint.
 */
const handleError = (result: any, api: BaseQueryApi) => {
  const error = result.error || result.response;
  if (error && api.endpoint !== 'verifySignedIn') {
    if (error?.status === errorMessage.fetchError) {
      api.dispatch(
        errorOpen({
          message: error?.status,
        })
      );
    } else if (error?.status >= 500) {
      api.dispatch(
        modalOpen({
          title: 'Service Unavailable',
          message: errorMessage.serviceUnavailable,
        })
      );
    } else {
      api.dispatch(
        snackbarOpen({
          severity: severity.error,
          message:
            error?.status === 429
              ? errorMessage.rateLimitExceedError
              : error?.data?.message,
        })
      );
    }
  }
};

/**
 * Executes a base query with reauthentication logic.
 *
 * This function attempts to perform a query with credentials and checks for
 * authentication errors. If a 401 error is detected, it attempts to refresh
 * the authentication token and retries the query. Handles errors and checks
 * for application version updates.
 *
 * @param args - The arguments for the query, which can be a string or FetchArgs.
 * @param api - The API interface provided by Redux Toolkit for query operations.
 * @param extraOptions - Additional options for the query execution.
 *
 * @returns A promise that resolves to the query result or an error.
 */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result: any;
  if (!refreshTokenPromise) {
    result = await baseQueryWithCredentials(args, api, extraOptions);
    checkAppVersion(result, api);
    const is401Error =
      result.error &&
      (result.error.status === 401 || result.error.originalStatus === 401);
    if (is401Error) {
      result = await refreshToken(args, api, extraOptions);
    } else {
      handleError(result, api);
    }
  } else {
    return await refreshTokenPromise
      .then(async (refreshResult: any) => {
        if (refreshResult?.data) {
          result = await baseQueryWithCredentials(args, api, extraOptions);
          checkAppVersion(result, api);
          handleError(result, api);
          return result;
        } else {
          api.dispatch(logout());
        }
        refreshTokenPromise = undefined;
        return refreshResult;
      })
      .catch(err => err);
  }
  return result;
};

const baseURl = process.env.REACT_APP_API_BASE_URL;

/**
 * Sends a POST request using Axios with reauthentication handling.
 *
 * @param url - The endpoint URL to send the request to.
 * @param formData - The FormData object containing the data to be sent.
 * @param onUploadProgress - Callback function to handle upload progress events.
 * @param api - The API context used for making requests.
 * @param params - Optional query parameters to include in the request.
 * @returns An object containing the response data or an error object.
 *
 * If the request fails with a 401 status, it attempts to refresh the token
 * and retries the request. If the refresh fails, it returns an error indicating
 * session expiration.
 */
const axiosRequestWithReauth = async (
  url: string,
  formData: FormData,
  api: any,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
  params?: Record<string, any>
) => {
  try {
    const response = await axios.post(baseURl + url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params,
      onUploadProgress,
      withCredentials: true,
    });
    return { data: response.data };
  } catch (error: any) {
    if (error.response?.status === 401) {
      const refreshResult = await baseQueryWithReauth(
        { url: '/auth/refresh/token', method: 'post' },
        api,
        {}
      );
      if (refreshResult?.data) {
        const retryResponse = await axios.post(baseURl + url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params,
          onUploadProgress,
          withCredentials: true,
        });
        return { data: retryResponse.data };
      } else {
        return {
          error: {
            status: 401,
            data: 'Session expired, please log in again.',
          },
        };
      }
    } else if (error.response && api.endpoint !== 'verifySignedIn') {
      if (error.response?.status === 'FETCH_ERROR') {
        api.dispatch(
          errorOpen({
            message: error.response?.status,
          })
        );
      } else if (error.response.status >= 500) {
        api.dispatch(
          modalOpen({
            title: 'Service Unavailable',
            message: errorMessage.serviceUnavailable,
          })
        );
      } else if (
        error.response.data?.message === errorMessage.unsupportedAppVersion
      ) {
        api.dispatch(
          modalOpen({
            showTitle: false,
            message: errorMessage.unsupportedAppVersionMsg,
            showDashboardLink: false,
          })
        );
      } else {
        api.dispatch(
          snackbarOpen({
            severity: severity.error,
            message:
              error.response?.status === 429
                ? errorMessage.rateLimitExceedError
                : error?.response?.data?.message,
          })
        );
      }
    }
    return {
      error: {
        status: error.response?.status,
        data: error.response?.data,
      },
    };
  }
};

export {
  baseQueryWithReauth,
  baseQueryWithCredentials,
  baseQuery,
  axiosRequestWithReauth,
  baseQueryWithAuth,
};
