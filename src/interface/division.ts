import { Moment } from 'moment';

export interface Response {
  success: boolean;
  message: string;
  data: {
    orderId: number;
  };
}

export interface CreateDivisionPayload {
  deedId?: number | null | string;
  fileId?: number | null | string;
  contactId?: number | null | string;
  operId?: number | null | string;
  notified?: boolean;
  notice1Date?: Date | Moment | string;
  notice2Date?: Date | Moment | string;
  notice3Date?: Date | Moment | string;
  dorcvd?: boolean;
  donate?: string;
  well?: string;
  section?: string;
  township?: string;
  rangeSurvey?: string;
  wellCounty?: string;
  wellState?: string;
  welldivint?: string;
}

export interface DivisionTabContentProps {
  contactId: string | number | null;
  fileId: string | number | null;
  from: string | null | undefined;
  deedId: string | null | number;
}

export interface CreateDivisionInitialValues {
  deedId?: number | null | string;
  fileId?: number | null | string;
  contactId?: number | null | string;
  operId?: number | null | string;
  notified?: boolean;
  notice1Date?: Date | Moment | string;
  notice2Date?: Date | Moment | string;
  notice3Date?: Date | Moment | string;
  dorcvd?: boolean;
  donate?: string;
  well?: string;
  section?: string;
  township?: string;
  rangeSurvey?: string;
  wellCounty?: string;
  wellState?: string;
  welldivint?: string;
  referenceId?: string;
}

export interface OperatorDropdown {
  key?: string;
  value?: number | string;
  state?: string;
  desc?: string;
}

export interface DropdownObjectForListOfOperators {
  operatorsData: OperatorDropdown[];
}

export interface GetAllDivisionsQueryParam {
  deedId: string | number | null;
  order?: string | null;
  orderBy?: string | null;
}
export interface getAllDivisionsRes {
  divisions: {
    orderID?: number | null;
    deedID?: number | null;
    operID?: number | null;
    past60days?: string | null;
    past30days?: string | null;
    notified?: boolean | null;
    notice1Date?: string | null;
    notice2?: boolean | null;
    notice2Date?: string | null;
    notice3?: boolean | null;
    notice3Date?: string | null;
    received?: boolean | null;
    commentOrd?: string | null;
    legalDesc?: string | null;
    countyState?: string | null;
    operator?: {
      operatorID?: number | null;
      companyName?: string | null;
      contactName?: string | null;
      phoneNumber?: number | null;
      fax?: number | null;
      email?: string | null;
      address?: string | null;
      city?: string | null;
      state?: string | null;
      zip?: number | null;
      notes?: string | null;
    } | null;
    wells?:
      | {
          wellID?: number | null;
          well?: string | null;
          section?: string | null;
          township?: string | null;
          range?: string | null;
          county?: string | null;
          state?: string | null;
          divisionInterest?: string | null;
          sectionAB?: string | null;
          townshipBlock?: string | null;
          rangeSurvey?: string | null;
        }[]
      | null;
  }[];
}
export interface GetAllDivisionsResponse {
  success: boolean;
  message: string;
  data: {
    divisions: getAllDivisionsRes['divisions'];
    count: number;
  };
}

export interface GetDivisionOrderQueryParam {
  orderId: string | number;
}

export interface GetDivisionOrderResponse {
  data: {
    orderID?: number | null;
    deedID?: number | null;
    operID?: number | null;
    notified?: boolean | null;
    notice1Date?: string | null;
    notice2?: boolean | null;
    notice2Date?: string | null;
    notice3?: boolean | null;
    notice3Date?: string | null;
    received?: boolean | null;
    commentOrd?: string | null;
    referenceId?: string | null;
    OperatorsModel?: {
      operatorID?: number | null;
      companyName?: string | null;
      contactName?: string | null;
      phoneNumber?: number | null;
      fax?: number | null;
      email?: string | null;
      address?: string | null;
      city?: string | null;
      state?: string | null;
      zip?: number | null;
      notes?: string | null;
    } | null;
    DeedsModel?: {
      deedID: number | null;
      ContactsMode?: {
        contactID: number | null;
        fileID: number | null;
      };
    };
  };
  message: string;
  success: boolean;
}

export interface GetDivisionInitialValues {
  orderId?: number | string;
  operId?: number | null | string;
  notified?: boolean | null;
  notice1Date?: Date | Moment | string | null;
  notice2Date?: Date | Moment | string | null;
  notice3Date?: Date | Moment | string | null;
  dorcvd?: boolean | null;
  donate?: string | null;
  referenceId?: string | null;
}

export interface UpdateDivisionPayload {
  orderId: string | number;
  operId?: number | null | string;
  notified?: boolean | null;
  notice1Date?: Date | Moment | string | null;
  notice2Date?: Date | Moment | string | null;
  notice3Date?: Date | Moment | string | null;
  dorcvd?: boolean | null;
  donate?: string | null;
  referenceId?: string | null;
}

export interface DeleteDivisionReqQuery {
  orderId: string | number;
}

export interface CompanyAddress {
  phone: string;
  email: string;
  address: string;
  name: string;
  state: string;
  zip: string;
  city: string;
}
