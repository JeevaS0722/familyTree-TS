import { LetterType, OfferType, State } from './common';

interface OfferFollowUpUsersData {
  fullName: string;
  userId: string;
}

export interface Response {
  message: string;
  success: boolean;
}

export interface GenerateDeedDocPayload {
  offerId: number;
  legalState: string;
}

export interface GenerateLetterDocPayload {
  offerId: number;
}

export interface GetUniqueLegalStateByOfferResponse extends Response {
  data: {
    legalState: string;
    legalStateDesc: string;
  }[];
}

export interface OfferFollowUpUsersResponse extends Response {
  data: OfferFollowUpUsersData[];
}

export interface CompleteOfferPayload {
  toUserId?: string;
  dueDate?: string;
  priority: string;
}

export interface Values {
  toUserId?: string;
  dueDate?: string;
  priority: string;
}

export interface DropdownObjectForCompleteOffers {
  offerFollowUpUsers: OfferFollowUpUsersData[];
  priority: string[];
}

export interface OfferCompleteProps {
  dropDownValue: DropdownObjectForCompleteOffers;
  errors?: {
    priority?: string;
    dueDate?: string;
  };
  isValidating?: boolean;
}

export interface DropdownObjectForOffer {
  offerTypes: OfferType[];
  letterTypes: LetterType[];
  states?: State[];
}
export interface CreateOfferResponse {
  success: boolean;
  message: string;
  data: [];
}

export interface OfferData {
  fileID: number;
  offers: {
    offerType: number;
    letterType: number;
    draftAmount1: number | string;
    draftLength1: number;
    draftLength2: number;
    draftAmount2: number | string;
    comment3: string;
    ownership?: string;
    grantors?: string;
    contactID?: number;
    offerBy?: number;
    address?: string;
    state?: string;
    city?: string;
    zip?: string;
  }[];
}
export interface OfferGetResponse extends Response {
  count: number;
  offers: OffersGetData[];
}

export interface OffersGetData {
  [key: string]: string | number | null;
  offerID: number;
  grantors: string | null;
  draftAmount1: number | null;
  draftLength1: number | null;
  draftAmount2: number | null;
  draftLength2: number | null;
  comment3: string | null;
  offerAddress: string | null;
  offerCity: string | null;
  offerState: string | null;
  offerZip: string | null;
  offerDate: string | null;
  offerTypes: string | null;
  letterType: string | null;
}

export interface OfferQueryParams {
  contactId: number;
  orderBy?: string;
  order?: string;
}

export interface OfferValues {
  offerType: number;
  letterType: number;
  draftAmount1: number | string;
  draftAmount2?: number | string;
  draftLength1: number;
  draftLength2: number;
  comment3: string;
  ownership?: string;
  grantors?: string;
  contactID?: number;
  offerBy?: number;
  address?: string;
  state?: string;
  city?: string;
  zip?: string;
}
export interface ContactDetailResponse {
  contactID: number;
  data: {
    ownership?: string;
    draftAmount2?: number;
    grantors?: string;
    contactID?: number;
    offerBy?: number;
    address?: string;
    city?: string;
    zip?: string;
  };
}

export interface FileData {
  totalFileOffer: number;
  totalFileValue: number;
  fileID?: number;
  fileName?: string;
  offerBy?: number | null;
}

export interface FormikValues {
  offerType: number;
  letterType: number;
  draftAmount1: number;
  draftLength1: number;
  draftLength2: number;
  draftAmount2: number;
  comment3: string;
  ownership?: string;
  grantors?: string;
  contactID?: number;
  offerBy?: number;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}
export interface FormikInstance {
  errors: Record<string, string>;
  isValid: boolean;
  values: FormikValues;
  setFieldValue: <Value>(
    field: keyof FormikValues,
    value: Value,
    shouldValidate?: boolean
  ) => void;
}
export interface OffersTabContentProps {
  contactId: string | number;
  fileId: string | number;
}

export interface OfferGetByOfferIdResponse extends Response {
  offer: OfferGetByOfferIdData;
}

export interface OfferGetByOfferIdData {
  offerID: number;
  grantors: string;
  draftAmount1: string;
  draftLength1: number;
  draftAmount2: string;
  draftLength2: number;
  comment3: string;
  offerAddress: string;
  offerCity: string;
  offerState: string;
  offerZip: string;
  offerType: number;
  letterType: number;
  offerDate: string | null;
  contactId: number;
  lastName: string;
  firstName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  whose: number;
  fileId: number;
  company: string;
}
export interface OfferQueryParamsForOfferId {
  offerId: number;
}

export interface EditOfferResponse {
  success: boolean;
  message: string;
  data?: {
    offerID?: number;
  };
}

export interface EditOfferValues {
  offerId: number;
  grantors: string;
  draftAmount1: number | string;
  draftLength1: number;
  draftAmount2: number | string;
  draftLength2: number;
  comment3: string;
  offerAddress: string;
  offerCity: string;
  offerState: string;
  offerZip: string;
  offerType: number;
  letterType: number;
  offerDate: string | null;
  whose: number;
  fileId: number;
}

export interface RecentOfferQueryParams {
  contactId: number;
}

export interface RecentOfferGetResponse extends Response {
  offer: RecentOfferData;
}

export interface RecentOfferData {
  contactID: number;
  offerID: number;
  offerDate: string;
  offerType: number;
  letterType: number;
  draftAmount1: number;
  draftLength1: number;
  draftAmount2: number;
  draftLength2: number;
  comment3: string;
}
