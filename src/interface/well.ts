export interface CreateWellInitialValues {
  divOrderID: number | null | string;
  well: string;
  section?: string;
  township?: string;
  rangeSurvey?: string;
  wellCounty?: string;
  wellState?: string;
  welldivint?: string;
}
export interface Response {
  success: boolean;
  message: string;
}
export interface WellParamsForWellId {
  wellId: number;
}

export interface WellGetData {
  wellID: number;
  divOrderID: number;
  well: string;
  sectionAB: string;
  divInterest: string;
  townshipBlock: string;
  rangeSurvey: string;
  state: string;
  county: string;
  modifyBy: string | null;
  modifyDt: string;
  createdBy: string | null;
  createDate: string;
}

export interface WellGetByWellIdResponse extends Response {
  data: WellGetData;
}

export interface WellGetAllByDivOrderIdIdResponse extends Response {
  data: WellGetData[];
  count?: number;
}
export interface WellParamsForDivOrderId {
  divOrderId: number;
  orderBy?: string;
  order?: string;
}

export interface CreateWellsInterface {
  divOrderID: number | null | string;
  well: string;
  section?: string;
  township?: string;
  rangeSurvey?: string;
  wellCounty?: string;
  wellState?: string;
  welldivint?: string;
}

export interface CreateWellResponse extends Response {
  data: {
    wellId: number;
  };
}

export interface UpdateWellData {
  wellId: number;
  well: string;
  section: string;
  welldivint: string;
  township: string;
  rangeSurvey: string;
  wellState: string;
  wellCounty: string;
}

export interface WellTableContentProps {
  divOrderId: number;
  deedID?: number;
}
