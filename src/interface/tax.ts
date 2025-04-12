export interface NewTaxForm {
  deedID?: number;
  taxingEntity?: string | null;
  county?: string | null;
  state?: string | null;
  amountDue?: string | null;
  datePaid?: Date | null | string;
  rcvd: boolean | number;
  taxStart?: Date | null | string;
  taxEnd?: Date | null | string;
}

export interface CreateTaxResponse {
  success: boolean;
  message: string;
  data?: { taxID?: number };
}

export interface TaxDetails {
  state?: string | null | undefined;
  deedID?: number | null;
  taxID?: number | null;
  county?: string | null;
  amountDue?: string | null;
  datePaid?: Date | null;
  rcvd: boolean | number;
  taxStart: Date | null;
  taxEnd: Date | null;
  taxingEntity?: string | null;
}

export interface TaxesListResult {
  taxes: TaxDetails[];
  count: number;
}

interface Response {
  success: boolean;
  message: string;
}

export interface TaxDeedResponse extends Response {
  data: TaxesListResult;
}

export interface EditTaxResponse {
  success: boolean;
  message: string;
  data?: { taxID?: number };
}

export interface TaxDetailQueryParams {
  taxId: number;
}

export interface EditTaxForm {
  taxID?: number | null;
  taxingEntity?: string | null;
  county?: string | null;
  state?: string | null;
  amountDue?: string | null;
  datePaid?: Date | null | string;
  rcvd?: boolean | number;
  taxStart?: Date | null | string;
  taxEnd?: Date | null | string;
}

export interface TaxColumn {
  label: string;
  accessor: keyof TaxTableData;
  sortable?: boolean;
  index: number;
}

export interface TaxTableData {
  taxID?: number | null;
  county?: string | null;
  amountDue?: string | null;
  datePaid?: Date | null;
  rcvd: boolean;
  taxStart: Date | null;
  taxEnd: Date | null;
}

export interface TaxesDeedQueryParams {
  deedId: number;
  orderBy: string;
  order: string;
}

export interface TaxDetailResponse extends Response {
  data: { tax: TaxDetails };
}

export interface DeleteTaxResponse {
  success: boolean;
  message: string;
}

export interface TaxTabContentProps {
  deedId: number;
}

export interface AddTaxProps {
  errors?: {
    amountDue?: string;
    taxStart?: string;
    taxEnd?: string;
    county?: string;
    datePaid?: string;
    state?: string;
  };
  state: string;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  errorCountyRef?: React.RefObject<HTMLDivElement>
}
