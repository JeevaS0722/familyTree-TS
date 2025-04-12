import { State } from './common';

export interface ValuesForOfferSearch {
  visit?: boolean;
  state?: string;
  city?: string;
  zip?: string;
  county?: string;
  date1?: string;
  date2?: string;
}
export interface OfferParams {
  state: string | undefined;
  city: string | undefined;
  zip: string | undefined;
  county: string | undefined;
  date1: string | undefined;
  date2: string | undefined;
  pageNo?: number | undefined;
  size?: number | undefined;
  order?: string | undefined;
  orderBy?: string | undefined;
  visit?: number;
  page?: number;
  rowsPerPage?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface OfferSearchItem {
  success: boolean;
  message: string;
  offers: {
    fileId: number;
    contactId: number;
    whose: number;
    fileName: string;
    contactName: string;
    visit: number;
    city: string;
    zip: number;
    phone: string;
    offerAmount: number;
    offerDate: string;
    legalsState: string;
    legalsCounty: string;
    fileLocation: string;
    fileLocDt: string;
  }[];
  count?: number;
}

export interface DropDownValueForStates {
  states: State[];
}

export interface DateType {
  date2?: string | null;
  date1?: string | null;
}
