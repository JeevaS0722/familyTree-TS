import { ReactElement, ReactNode, CSSProperties } from 'react';

export interface Place {
  place: string;
  type: number;
}

export interface State {
  state: string;
  desc: string;
}

export interface County {
  state: string;
  county: string;
  stateDesc: string;
}

export interface TableData {
  [key: string]: string | number | null | number[] | boolean | undefined;
}
interface DropdownOption {
  label?: string;
  value: string;
  id: string;
}

export interface TableColumns {
  label?: string;
  accessor?: string;
  headerName?: string;
  field?: string;
  sortable: boolean;
  format?: (arg: TableData) => ReactElement | string | null | ReactElement[];
  cellRenderer?: (params: { data: TableData }) => ReactNode;
  filterable?: boolean;
  type?: string;
  options?: DropdownOption[];
  condition?: string;
  width?: number;
  headerEdit?: boolean;
  editable?: boolean;
  colId?: string;
  minWidth?: number;
  maxWidth?: number;
  headerEditMode?: 'full' | 'partial' | 'custom' | 'none';
  lockPinned?: boolean;
  headerEditFormatter?: (value: string) => string;
  headerEditParser?: (value: string) => string;
  headerValidation?: (value: string) => boolean;
  cellClass?: string;
  cellStyle?: CSSProperties;
  headerComponent?: React.ComponentType;
  headerComponentParams?: Record<string, unknown>;
  cellRendererParams?: Record<string, unknown>;
  valueFormatter?: (row: TableData) => string;
  pinned?: string;
  index?: number;
}
export interface QueryParams {
  page?: number;
  rowsPerPage?: number;
  sortBy?: string | undefined;
  sortOrder?: string;
}

export interface DeedCountBuyer {
  fullName?: string | null | undefined;
  deedCount?: number | null | undefined;
}

export interface TableProps {
  tableId?: string;
  data: TableData[];
  getData?: (params: QueryParams) => void;
  getDataWithoutPagination?: (params: QueryParamsForWithoutPagination) => void;
  columns: TableColumns[];
  count: number;
  initialLoading: boolean;
  message?: string;
  loading?: boolean;
  tableLoading?: boolean;
  initialSortOrder?: string;
  initialSortBy?: string;
  getTableRowBackgroundColor?: (row: {
    [key: string]: string | number | number[] | null | boolean | undefined;
  }) => string;
  refreshList?: boolean;
  id?: number | undefined;
  getTextColor?: string;
  sortBy?: string | null;
  sortOrder?: string | null;
  page?: number;
  rowsPerPage?: number;
  setSortBy?: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  setSortOrder?: React.Dispatch<
    React.SetStateAction<string | null | undefined>
  >;
  setPage?: React.Dispatch<React.SetStateAction<number | undefined>>;
  setRowsPerPage?: React.Dispatch<React.SetStateAction<number | undefined>>;
  isWithoutPagination?: boolean;
  fixedColumns?: string[]; // Columns that are always
  defaultPinnedColumns?: string[];
  theme?: 'dark' | 'light';
  agTheme?: 'dark' | 'light';
}

export interface OfferType {
  typeID: number;
  offerTypes: string;
}

export interface LetterType {
  letterID: number;
  letterType: string;
}

export interface TitleType {
  Id: number;
  titleName: string;
  type: number;
}

export interface QueryParamsForWithoutPagination {
  id: number | undefined | string | undefined;
  sortBy: string | undefined;
  sortOrder: string;
}
export interface SectionOption {
  key: string;
  value: string;
}

export interface GetTableRowId {
  fileId?: number;
  contactID?: number;
  deedID?: number;
  wellID?: number;
}

export interface filters {
  sortBy: string;
  sortOrder: string;
  page: number;
  rowsPerPage: number;
  size?: number;
  pageNo?: number;
  order?: string;
  orderBy?: string;
}

export interface OnlyOfficeDocumentTypeInterface {
  pdf: string;
  doc: string;
  docx: string;
  xls: string;
  xlsx: string;
  ppt: string;
  pptx: string;
}

export interface DocumentEditorProps {
  id: number;
  fileName: string;
  url: string;
  userId: string;
  mode: string;
  token: string;
  from: string;
  isSave: boolean;
}

export interface ReleaseNoteInterface {
  version: string;
  release_date: string;
  sections: {
    title: { name: string; sx: string };
    details: {
      content: string;
      type: string;
      src: string;
    }[];
  }[];
}

export type HeaderEditMode = 'full' | 'partial' | 'custom' | 'none';

// Header value change event parameters
export interface HeaderValueChangeParams {
  colId: string;
  oldValue: string;
  newValue: string;
  colDef: any;
  visibleColumns: Array<string>;
  columnOrder: Array<string>;
}

// Column sizing options
export interface ColumnSizingOptions {
  minColumnWidth?: number; // Minimum column width in pixels
  debounceTime?: number; // Debounce time for resize operations in ms
  bufferWidth?: number; // Buffer space to leave at edge of grid
  fillContainer?: boolean; // Whether to expand columns to fill container
}

// Redux state interface for table configurations
export interface TableState {
  visibleColumns: {
    [tableId: string]: string[]; // Visible columns for each table
  };
  columnOrder: {
    [tableId: string]: string[]; // Column order for each table
  };
  columnWidths?: {
    [tableId: string]: {
      // Column widths for each table
      [colId: string]: number;
    };
  };
}

// Redux action payloads
export interface TableVisibilityPayload {
  tableId: string;
  columns: string[];
}

export interface TableInitializePayload {
  tableId: string;
  allColumns: string[];
}

export interface TableResetPayload {
  tableId: string;
}

export interface TableColumnOrderPayload {
  tableId: string;
  columns: string[];
}

export interface TableColumnWidthPayload {
  tableId: string;
  colId: string;
  width: number;
}

// Search filter payload for Redux
export interface SearchFilterPayload {
  tableId: string;
  filters: filters;
}
