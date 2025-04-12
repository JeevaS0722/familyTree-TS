export interface WellMastersFormValues {
  searchBy?: string | undefined;
  textSearch?: string | undefined;
}

export interface WellMastersParams {
  searchBy: string | undefined;
  textSearch: string | undefined;
  pageNo?: number | undefined;
  size?: number | undefined;
  order?: string | undefined;
  orderBy?: string | undefined;
  page?: number;
  rowsPerPage?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface WellMaster {
  wellID: number;
  fileName: string | null;
  wellName: string | null;
  county: string | null;
  state: string | null;
  API: string | null;
  sectionAB: string | null;
  townshipBlock: number | null;
  rangeSurvey: number | null;
  quarters: string | null;
  acres: number | null;
  nma: number | null;
  interest: number | null;
  type: string | null;
  operatorName: string | null;
  payorName: string | null;
}
