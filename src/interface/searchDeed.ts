export interface SearchDeedFormValues {
  searchType?: string;
  searchText?: string;
  from?: string;
  to?: string;
}

export interface LocationState {
  newSearch: boolean;
}

export interface DeedsParams {
  searchType: string | undefined;
  searchText: string | undefined;
  from: string | undefined;
  to: string | undefined;
  pageNo?: number | undefined | null | string;
  size?: number | undefined | null | string;
  order?: string | undefined;
  orderBy?: string | undefined;
  rowsPerPage?: number | undefined;
  sortBy?: string | undefined;
  sortOrder?: string | undefined;
}

export interface SearchDeedDateType {
  from?: string | null;
  to?: string | null;
}

export interface DeedsCountBuyerParams {
  from: string | undefined;
  to: string | undefined;
  order?: string | undefined;
  orderBy?: string | undefined;
}
