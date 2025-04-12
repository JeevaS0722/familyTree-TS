import { Place, State } from './common';
import { Address } from './searchCourts';
import {
  FileByNameOrPhoneColumn,
  NameOrPhone,
} from './searchFileByNameOrPhone';
export interface SearchValues {
  fileStatus: string;
  legalsState: string;
  legalsCounty: string;
}

export interface DropdownObject {
  status: Place[];
  states: State[];
}

export interface File {
  fileID?: number;
  fileName?: string;
  fileStatus?: string;
  mMSuspAmt?: string;
  mMComment?: string;
  legalsCounty?: string;
  legalsState?: string;
  apprValue?: string;
  totalAppraisedValue?: string;
  noteDate?: string;
  researchNote?: string;
  contactID?: number;
  deedID?: number;
}
export interface FormValues {
  status: string;
  state: string;
  county: string;
  pageNo?: number;
  size?: number;
  page?: number;
  rowsPerPage?: number;
  orderBy?: string;
  order?: string;
  sortOrder?: string;
  sortBy?: string;
}
export interface FileSearchResponse {
  success: boolean;
  message: string;
  files: File[];
  count: number;
}
export interface FileNamePhoneSearchResponse {
  success: boolean;
  message: string;
  files: NameOrPhone[];
  count: number;
}

export interface Column {
  label: string;
  accessor: keyof File | keyof Address;
  sortable?: boolean;
}

export interface Props {
  id?: string;
  data: File[] | NameOrPhone[] | Address[];
  count: number;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sortBy: string;
  columns: Column[] | FileByNameOrPhoneColumn[];
  setSortOrder: React.Dispatch<React.SetStateAction<string>>;
  sortOrder: string;
  changePageLoading: boolean;
  sortLoading: boolean;
  setSortLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export { Address };
