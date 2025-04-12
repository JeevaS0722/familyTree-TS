import { State } from './common';

export interface DropdownObject {
  states: State[];
}

export interface CourtFormValues {
  state?: string;
  county?: string;
}

export interface CourtParams {
  state: string | undefined;
  county: string | undefined;
  pageNo?: number | undefined;
  size?: number | undefined;
  order?: string | undefined;
  orderBy?: string | undefined;
  visit?: number;
  page?: number;
  rowsPerPage?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface CourtAddressColumn {
  label: string;
  accessor: keyof Address;
  sortable?: boolean;
}

export interface Address {
  addressID?: number | null | string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  form?: string | null;
  notes?: string | null;
  claimDate?: string | null;
  dtPaid?: string | null;
  dueDt2?: string | null;
  returnDate?: string | null;
  paidDt2?: string | null;
  notice1dt?: string | null;
  notice2dt?: string | null;
  notice3dt?: string | null;
  datePaid2?: string | null;
}
