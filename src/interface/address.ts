import { State } from './common';

export interface Response {
  message: string;
  success: boolean;
}

export interface addressValues {
  name?: string;
  attn?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  county?: string;
  payee?: string;
  phone?: string;
  fax?: string;
  email?: string;
  website?: string;
  notes?: string;
}
export interface getAddressParams {
  state: string;
}

export interface AddressProps {
  states: State[];
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  errorCountyRef: React.RefObject<HTMLDivElement>;
  addressId?: string;
  isValidating?: boolean;
  errors: {
    [key: string]: string;
  };
  names: names;
  scrollRef?: string;
  disabledFields?: {
    state?: boolean;
  };
  stateValue?: string;
}

export interface names {
  name: string;
  attn: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  payee: string;
  phone: string;
  fax: string;
  email: string;
  website: string;
  notes: string;
}

export interface Addresses {
  name: string;
  form: string;
  addressId: number;
}

export interface AddressesResponse extends Response {
  data: Addresses[];
}

export interface NewAddressForm {
  addressID?: number | null | undefined;
  name: string | null;
  attn?: string;
  address?: string;
  city?: string;
  state?: string | null;
  zip?: string;
  county?: string;
  payee?: string;
  phone?: string;
  fax?: string;
  email?: string;
  website?: string;
  notes?: string;
}

export interface CreateAddressResponse {
  success: boolean;
  message: string;
  data?: { addressID?: number };
}

export interface EditAddressForm {
  addressID: number | null | undefined;
  name: string | null;
  attn?: string;
  address?: string;
  city?: string;
  state?: string | null;
  zip?: string;
  county?: string;
  payee?: string;
  cost?: number;
  phone?: string;
  fax?: string;
  email?: string;
  website?: string;
  form?: string;
  notes?: string;
}

export interface getAddressIdParams {
  id: number;
}

export interface AddressDetails {
  addressID?: string | undefined | null | number;
  name: string;
  attn?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  county?: string;
  payee?: string;
  cost?: number;
  phone?: string;
  fax?: string;
  email?: string;
  website?: string;
  form?: string;
  notes?: string;
}

export interface AddressResponse {
  success: boolean;
  message: string;
  data: {
    address: AddressDetails;
  };
}

export interface LocationState {
  isEditView?: boolean;
}

export interface getAddressCountyParams {
  county: string;
}

export interface AddressesRes {
  name: string;
  addressId: number;
}
export interface AddressesResponseByCounty extends Response {
  data: AddressesRes[];
}
