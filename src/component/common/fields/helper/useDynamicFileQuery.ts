import { Place } from '../../../../interface/common';
import {
  useGetFileLocationQuery,
  useGetFileStatusQuery,
} from '../../../../store/Services/commonService';
import { QueryStatus } from '@reduxjs/toolkit/query';

interface QueryReturnType<T> {
  data?: T;
  error?: Error | null;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  status: QueryStatus;
}

interface Places {
  message: string;
  places: Place[];
  success: boolean;
}

function useDynamicFileQuery(
  type: 'status' | 'location'
): QueryReturnType<Places> {
  const statusQuery = useGetFileStatusQuery() as QueryReturnType<Places>;
  const locationQuery = useGetFileLocationQuery() as QueryReturnType<Places>;

  if (type === 'location') {
    return locationQuery;
  } else {
    return statusQuery;
  }
}

export default useDynamicFileQuery;
