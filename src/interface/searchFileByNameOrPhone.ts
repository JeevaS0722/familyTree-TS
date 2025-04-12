interface NameOrPhone {
  fileID: number;
  fileName: string;
  legalsCounty?: string | null;
  legalsState?: string | null;
  altName?: string;
  deedID?: number;
  county?: string;
  contactName?: string;
  contactID?: number;
  phoneNo?: string;
  buyer?: string;
  returnDate?: string;
  actions?: string;
}
interface FileByNameOrPhoneQueryParams {
  searchFor: string;
  pageNo?: number;
  size?: number;
  orderBy?: string;
  order?: string;
  page?: number;
  rowsPerPage?: number;
  sortBy?: string;
  sortOrder?: string;
}
interface FileByNameOrPhoneColumn {
  label: string;
  accessor: keyof NameOrPhone;
  sortable?: boolean;
}

export { NameOrPhone, FileByNameOrPhoneQueryParams, FileByNameOrPhoneColumn };
