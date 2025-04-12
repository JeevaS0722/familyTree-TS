import { State } from './common';

export interface RequestCheckDetails {
  payee: string;
  memo: string;
  amt: string | null;
  address: string;
  city: string;
  state: string;
  zip: string | null;
}

export interface DropDownValue {
  state: State[];
}

export interface RequestCheckCreateResponse {
  message: string;
  success: boolean;
}

export interface DraftRequestCheckDetails {
  fileId: number;
  contactId: number;
  deedId: number;
  draft: number;
}
