export interface NewLegalForm {
  state: string;
  county?: string;
  section?: number | null;
  townshipNo?: string;
  townshipNS?: string;
  rangeNo?: string;
  rangeEW?: string;
  lot?: string;
  callDir1?: string;
  callNo1?: string;
  callDir2?: string;
  callNo2?: string;
  callDir3?: string;
  callNo3?: string;
  callDir4?: string;
  callNo4?: string;
  callDir5?: string;
  callNo5?: string;
  callDir6?: string;
  callNo6?: string;
  callDir7?: string;
  callNo7?: string;
  callDir8?: string;
  callNo8?: string;
  status?: string;
  source?: string;
  divInterest?: number | null | string;
  intType?: string;
  nma?: number | null | string;
  makeOffer: true;
  survey?: string;
  league?: string;
  block?: string;
  abstract?: string;
  labor?: string;
  year?: string;
}

export interface LocationState {
  isCopyLegal: boolean;
  isFileView: boolean;
  contactId: number;
}

export interface CreateLegalResponse {
  success: boolean;
  message: string;
  data?: { legalID?: number };
}

export interface LegalData {
  legalsID?: string;
  fileID?: string;
  state: string;
  county?: string;
  section?: number | null;
  townshipNo?: string;
  townshipNS?: string;
  rangeNo?: string;
  rangeEW?: string;
  lot?: string;
  callDir1?: string;
  callNo1?: string;
  callDir2?: string;
  callNo2?: string;
  callDir3?: string;
  callNo3?: string;
  callDir4?: string;
  callNo4?: string;
  callDir5?: string;
  callNo5?: string;
  callDir6?: string;
  callNo6?: string;
  callDir7?: string;
  callNo7?: string;
  callDir8?: string;
  callNo8?: string;
  status?: string;
  source?: string;
  divInterest?: number | null | string;
  intType?: string;
  nma?: number | null | string;
  makeOffer?: boolean | number;
  survey?: string;
  league?: string;
  block?: string;
  abstract?: string;
  labor?: string;
  year?: string;
  modifyBy?: string;
  modifyDt?: string;
  calls?: string;
}
export interface LegalListResult {
  legals: { TX_LA_legals: LegalData[]; Other_legals: LegalData[] };
  count: number;
}

interface Response {
  success: boolean;
  message: string;
}

export interface LegalFileResponse extends Response {
  data: LegalListResult;
}

export interface EditLegalResponse {
  success: boolean;
  message: string;
}

export interface LegalFileQueryParams {
  fileId: number;
  TX_LA_legal_sortBy: string;
  TX_LA_legal_sortOrder: string;
  Other_legal_sortBy: string;
  Other_legal_sortOrder: string;
}

export interface NewLegalPayload {
  fileID: number;
  state?: string;
  county?: string;
  section?: number | null;
  townshipNo?: string;
  townshipNS?: string;
  rangeNo?: string;
  rangeEW?: string;
  calls?: CallsObject[];
  lot?: string;
  status?: string;
  source?: string;
  divInterest?: number | null;
  intType?: string;
  nma?: number | null;
  makeOffer?: boolean;
  survey?: string;
  league?: string;
  block?: string;
  abstract?: string;
  labor?: string;
  year?: string;
}
interface Call {
  callNo?: number | null;
  callDir?: string;
}

interface CallsObject {
  [key: string]: Call;
}

export interface LegalDetailResponse extends Response {
  data: { legal: LegalData };
}

export interface LegalDetailQueryParams {
  legalId: number;
}

export interface LegalColumn {
  label: string;
  accessor: keyof LegalTableData;
  sortable?: boolean;
  index: number;
}

export interface LegalTableData {
  edit?: string;
  legalsId?: number;
  fileID?: number;
  state?: string;
  county?: string;
  section?: number | null;
  townshipNo?: string;
  rangeNo?: string;
  callNo1?: string;
  lot?: string;
  status?: string;
  source?: string;
  divInterest?: number | null | string;
  intType?: string;
  nma?: number | null;
  makeOffer?: string;
  survey?: string;
  league?: string;
  block?: string;
  abstract?: string;
  labor?: string;
  year?: string;
  copy?: string;
}

export interface LegalProps {
  fileId?: string | number;
  fileName?: string | null;
  isFileView?: boolean;
  contactId?: string | number;
}

export interface EditLegalPayload {
  legalID?: number;
  state?: string;
  county?: string;
  section?: number | null;
  townshipNo?: string;
  townshipNS?: string;
  rangeNo?: string;
  rangeEW?: string;
  calls?: CallsObject[];
  lot?: string;
  status?: string;
  source?: string;
  divInterest?: number | null;
  intType?: string;
  nma?: number | null;
  makeOffer?: boolean | number;
  survey?: string;
  league?: string;
  block?: string;
  abstract?: string;
  labor?: string;
  year?: string;
}

export interface CopyLegalPayload {
  legalID: number;
}
