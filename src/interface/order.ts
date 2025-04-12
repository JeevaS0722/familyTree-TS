import { Moment } from 'moment';
import { Place, State } from './common';
import { addressValues, Addresses } from './address';
import { userListInfo } from './user';

export interface Response {
  message: string;
  success: boolean;
}

export interface CompleteOrderPayload {
  requestedBy?: string;
  ordType?: string;
  ordState?: string;
  ordCity?: string;
  addressId?: string | null;
  ordId: number | null;
  ordPayAmt?: number | null;
  caseNo?: string;
  address?: addressValues;
}

export interface OrderCompleteValues {
  fileName?: string;
  contactName?: string;
  requestedDt?: string | Moment;
  requestedBy?: string;
  ordType?: string;
  ordState?: string;
  ordCity?: string;
  addressId?: string | null;
  ordId: number | null;
  ordPayAmt?: number | null;
  caseNo?: string;
  address?: addressValues;
}

export interface DropdownObjectForCompleteOrders {
  orderTypes: Place[];
  users: userListInfo[];
  states?: State[];
  addresses: Addresses[];
}

export interface OrderCompleteProps {
  dropDownValue: DropdownObjectForCompleteOrders;
  errors?: {
    ordPayAmt?: string;
    addressId?: string;
  };
  addressId: string | null | undefined;
  setForm: (data: string | undefined) => void;
  handleChange: (data: React.ChangeEvent<HTMLInputElement>) => void;
  form?: string;
  setFieldValue: (
    field: string,
    value: unknown,
    shouldValidate?: boolean
  ) => unknown;
  getAddresses: (data: { state: string }) => void;
  addressFetching: boolean;
  scrollRef?: string;
  isValidating?: boolean;
}

export interface FormikValues {
  requestedBy: string;
  ordType: string;
  ordState: string;
  ordCity: string;
  addressId: string;
  ordPayAmt: number;
  caseNo: string;
}
export interface FormikInstance {
  errors: Record<string, string>;
  isValid: boolean;
  values: FormikValues;
}

export interface OrderGetByOrderIdData {
  fileId: number;
  contactId: number;
  fileName: string;
  contactName: string;
  ordType: string;
  ordCity: string;
  ordState: string;
  requestedBy: string;
  caseNo: string;
  requestedDt: string;
  addressId: string;
  cost: number;
  form: string;
  ordNA?: boolean;
  ordDt?: string;
  ordRcdDt?: string;
}

export interface OrderGetByOrderIdResponse extends Response {
  data: OrderGetByOrderIdData;
}

export interface OrderParamsForOrderId {
  orderId?: number;
}

export interface OrderTabContentProps {
  contactId: string | number | null;
  fileId: string | number | null;
  ordCity: string | null | undefined;
  ordState: string | null | undefined;
  grantor: string | null | undefined;
}

export interface AddressesByCounty {
  name: string;
  addressId: number;
}
export interface DropdownObjectForOrder {
  users: Array<object>;
  state?: State[];
  type: Place[];
  address?: AddressesByCounty[];
}

export interface OrderDetailsData {
  contactId: number;
  fileId: number;
  requestedBy: string;
  orderState: string;
  orderCity: string;
  orderType: string;
  caseNo: string;
}

export interface OrderCreateResponse {
  message: string;
  success: boolean;
  data: {
    orderId: number;
  };
}

export interface GetAllOrdByContactIdResult {
  orderId: number;
  ordType: string;
  ordCity: string;
  ordState: string;
  requestedBy: string;
  caseNo: string;
  ordDt: string;
  ordRcdDt: string;
  ordNA: number;
}

export interface OrderGetALLByContactIdResponse extends Response {
  orders: GetAllOrdByContactIdResult[];
  count: number;
}

export interface OrderParamsForContactId {
  contactId: number;
  orderBy?: string;
  order?: string;
}

export interface EditOrderDetailsData {
  orderId: number;
  contactId: number;
  fileId: number;
  requestedBy: string;
  orderState: string;
  orderCity: string;
  orderType: string;
  caseNo: string;
  ordDt: string | null;
  ordRcdDt: string | null;
  ordNA: boolean;
  addressId?: number | string;
}

export interface EditOrderDetailsDataFormData {
  orderId: number;
  contactId: number;
  fileId: number;
  requestedBy: string;
  ordState: string;
  ordCity: string;
  ordType: string;
  caseNo: string;
  ordDt: string | null;
  ordRcdDt: string | null;
  ordNA: boolean;
  addressId?: number;
}

export interface OrderParamsForDelete {
  orderId: number;
}
