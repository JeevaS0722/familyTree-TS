export interface OperatorResponse {
  operatorID?: number | null;
  companyName?: string | null;
  contactName?: string | null;
  ownerNumber?: string | null;
  phoneNumber?: number | null;
  fax?: number | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: number | null;
  notes?: string | null;
  well?: string;
  section?: string;
  township?: string;
  rangeSurvey?: string;
  wellCounty?: string;
  wellState?: string;
  welldivint?: string;
}

export interface OperatorsModel {
  operatorID: number;
  companyName: string;
  contactName: string;
  ownerNumber: string;
  phoneNumber: number;
  fax: number;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  notes: string;
}

export interface GetAllOperatorResponse {
  message: string;
  success: boolean;
  data: OperatorsModel[];
}

export interface CreateOperatorInitialValues {
  companyName: string;
  contactName?: string;
  ownerNumber?: string;
  phoneNumber?: number | null;
  fax?: number | null;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string | null;
  notes?: string;
}

export interface OperatorGetByOperatorIdResponse {
  message: string;
  success: boolean;
  data: OperatorsModel;
}

export interface OperatorParamsForOperatorId {
  operatorId: number | string;
}

export interface ResponseOfOperator {
  message: string;
  success: boolean;
  data: {
    operatorId: number;
  };
}

export interface UpdateOperatorInitialValues {
  operatorID: number;
  companyName: string;
  contactName?: string;
  ownerNumber?: string;
  phoneNumber?: number | null;
  fax?: number | null;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string | null;
  notes?: string;
}
