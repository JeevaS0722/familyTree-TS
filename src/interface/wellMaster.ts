export interface CreateWellMasterInitialValues {
  wellName: string;
  deedID: number;
  api: string;
  book: string;
  page: string;
  county: string;
  state: string;
  sectionAB: string;
  townshipBlock: string;
  rangeSurvey: string;
  quarters: string;
  acres: number | null;
  nma: number | null;
  interest: string;
  payorID: null | number;
  operatorID: null | number;
  type: string;
  fileName: string;
}

export interface Response {
  success: boolean;
  message: string;
}

export interface CreateWellMasterResponse extends Response {
  data: {
    wellID: number;
  };
}

export interface LocationState {
  deedID: number;
  wellID: number;
}

export interface UpdateWellMasterInitialValues {
  wellID: number;
  wellName: string;
  api: string;
  book: string;
  page: string;
  county: string;
  state: string;
  sectionAB: string;
  townshipBlock: string;
  rangeSurvey: string;
  quarters: string;
  acres: number | null;
  nma: number | null;
  interest: string;
  payorID: null | number | string;
  operatorID: null | number | string;
  type: string;
  fileName: string;
  updateToAllAssociatedOperator?: boolean;
  updateToAllAssociatedPayor?: boolean;
}

export interface GetWellMasterByWellID {
  wellID: number;
}
interface QuarterData {
  quarters: string;
}
export interface GetAllQuartersResponse {
  message: string;
  success: boolean;
  data: QuarterData[];
}
export interface GetAllQuarters {
  searchText?: string;
  deedId?: number | null;
  wellId?: number | null | string;
  pageNo?: number;
  size?: number;
}

export interface WellMasterGetByWellIdResponse extends Response {
  data: {
    wellID: number;
    wellName: string;
    api: string;
    book: string;
    page: string;
    county: string;
    state: string;
    sectionAB: string;
    townshipBlock: string;
    rangeSurvey: string;
    quarters: string;
    acres: number | null;
    nma: number | null;
    interest: string;
    payorID: null | number;
    operatorID: null | number;
    type: string;
    fileName: string;
    deedID: number;
  };
}
