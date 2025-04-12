export interface Response {
  success: boolean;
  message: string;
}

export interface suspensePayload {
  suspType: string;
  stateCo: string;
  amount: number | null;
  suspStart: string;
  suspEnd: string;
  claimDate: string;
  subClaim: boolean;
  rcvdFunds: boolean;
  contactName: string;
  contactPhone: string;
}

export interface addSuspensePayload extends suspensePayload {
  deedId: number;
}

export interface editSuspensePayload extends suspensePayload {
  suspId: number;
}

export interface getSuspenseListResponse extends Response {
  data: {
    records: {
      suspId: number;
      suspType: string;
      stateCo: string;
      amount: string;
      claimDateRange: string;
      claimDate: string;
      subClaim: boolean;
      rcvdFunds: boolean;
      contactName: string;
      contactPhone: string;
    }[];
    count: number;
  };
}

export interface getSuspenseResponse extends Response {
  data: {
    suspId: number;
    suspType: string;
    stateCo: string;
    amount: string;
    claimDateRange: string;
    claimDate: string;
    subClaim: boolean;
    rcvdFunds: boolean;
    contactName: string;
    contactPhone: string;
  };
}

export interface getSuspenseListQueryParams {
  orderBy?: string;
  order?: string;
  deedId: number;
}

export interface getSuspenseQueryParams {
  suspId: number;
}

export interface suspenseValues {
  suspId?: number;
  deedId?: number;
  suspType: string;
  stateCo: string;
  amount: number | null;
  suspStart: string;
  suspEnd: string;
  claimDate: string;
  subClaim: boolean;
  rcvdFunds: boolean;
  contactName: string;
  contactPhone: string;
}

export interface suspenseFormProps {
  errors?: {
    stateCo?: string;
    contactPhone?: string;
    claimDate?: string;
    suspStart?: string;
    suspEnd?: string;
    amount?: string;
  };
  isValidating: boolean;
}
