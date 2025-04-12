export interface SearchOperatorParams {
  name: string | undefined;
  pageNo?: number | undefined | null | string;
  size?: number | undefined | null | string;
  order?: string | undefined;
  orderBy?: string | undefined;
}

export interface SearchOperatorFormValues {
  name?: string;
  searchText?: string;
  from?: string;
  to?: string;
}

export interface LocationState {
  newSearch?: boolean;
}

export interface OperatorsSearchItem {
  success: boolean;
  message: string;
  operators: {
    operatorID?: number;
    companyName?: string | null;
    contactName?: string | null;
    phoneNumber?: number | null;
    fax?: number | null;
    email?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: number | null;
    notes?: string | null;
  }[];
  count: number;
}

export interface SearchObject {
  tableId: string;
  filters: object;
}
