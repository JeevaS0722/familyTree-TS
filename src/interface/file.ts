import { Place, State } from './common';
import { Employee } from './employee';
import {
  AltData,
  EmailData,
  EmailSchemaData,
  PhoneData,
  PhoneSchemasData,
  TitleData,
} from './contact';
import { FormikErrors } from 'formik';

export interface DropdownObject {
  offerFollowUpUsers: [];
}

export interface LocationStateStatusDropDown {
  states: State[];
}

export interface EditFileDropdown {
  locations: Place[];
  status: Place[];
  buyers: Employee[];
}

export interface Values {
  fileName: string;
  fileOrigin: string;
  startDt: string;
  legalsCounty: string;
  legalsState: string;
  mMSuspAmt: string;
  mMComment: string;
  onlineResearchDt: string;
  fileStatus: string;
  returnedTo: string;
  relationship: string;
  ownership: number | null | string;
  lastName: string;
  firstName: string;
  sSN: string;
  deceased: boolean;
  decDt: string;
  dOB: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  altName?: AltData[];
  phone?: PhoneData[];
  email?: EmailData[];
  title?: TitleData[];
}

export interface AddFileProps {
  dropDownValue: DropdownObject;
  errors?: {
    fileName?: string;
  };
}

export interface AddContactProps {
  dropDownValue: DropdownObject;
  errors?: {
    areaCode?: string;
    prefix?: string;
    phoneNo?: string;
    ownership?: string;
  };
}

export interface FileData {
  fileName: string;
  fileOrigin: string;
  startDt: string;
  legalsCounty: string;
  legalsState: string;
  mMSuspAmt: string;
  mMComment: string;
  onlineResearchDt: string;
  fileStatus: string;
  returnedTo: string;
  contact: {
    relationship: string;
    ownership: number | null | string;
    lastName: string;
    firstName: string;
    altName: string;
    sSN: string;
    deceased: boolean;
    decDt: string;
    dOB: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  phone?: PhoneData[];
  email?: EmailData[];
}

export interface CreateFileResponse {
  success: boolean;
  message: string;
  data: {
    fileID: number;
  };
}

export interface FileDetails {
  fileID?: number;
  fileName?: string;
  fileStatus?: string | '';
  returnedTo?: string | null;
  oldFileLoc?: string | null;
  returnDt?: string | '';
  whose?: number | null | string;
  fileOrigin?: string | null;
  startDt?: string | null;
  mMSuspAmt?: string | null;
  mMComment?: string | null;
  exxonMFCk?: boolean | null;
  kochMFCk?: boolean | null;
  texacoMFCk?: boolean | null;
  oxyMFCk?: boolean | null;
  pangaeaCk?: boolean | null;
  oKStateRecCk?: boolean | null;
  pottCtyRecCk?: boolean | null;
  oKCtyRecCk?: boolean | null;
  payneCoCk?: boolean | null;
  tXStateRecCk?: boolean | null;
  exxonMF?: boolean | null;
  kochMF?: boolean | null;
  texacoMF?: boolean | null;
  oxyMF?: boolean | null;
  blackBart?: string | null;
  pangaea?: boolean | null;
  oKStateRec?: boolean | null;
  pottCtyRec?: boolean | null;
  oKCtyRec?: boolean | null;
  oKProbate?: boolean | null;
  payneCo?: string | null;
  tXStateRec?: boolean | null;
  apprValue?: string | null;
  totalAppraisedValue?: string | null;
  onlineCtyRecDt?: string | null;
  onlineResearchDt?: string | null;
  currentTaxes?: string | null;
  legalsDesc?: string | null;
  legalsCounty?: string | null;
  legalsState?: string | null;
  comment1?: string | null;
  countyResearch?: number | null;
  countyResearchToBe?: number | null;
  dead?: boolean | null;
  boxNo?: string | null;
  comment6?: string | null;
  company?: string | null;
  fieldResearch?: string | null;
  paperFile?: boolean | null;
}

interface ExtendedFileValue extends FileDetails {
  totalFileOffer?: number | null;
  totalFileValue?: number | null;
}

export interface EditFileResponse {
  success: boolean;
  message: string;
  data?: {
    file?: ExtendedFileValue;
  };
}

export interface FileDetailsData {
  fileID?: number;
  fileName?: string;
  fileStatus?: string | '';
  returnedTo?: string | null;
  returnDt?: string | '';
  whose?: number | null | string;
  fileOrigin?: string | null;
  startDt?: string | null;
  mMSuspAmt?: string | null;
  mMComment?: string | null;
  exxonMFCk?: boolean | null;
  kochMFCk?: boolean | null;
  texacoMFCk?: boolean | null;
  oxyMFCk?: boolean | null;
  pangaeaCk?: boolean | null;
  oKStateRecCk?: boolean | null;
  pottCtyRecCk?: boolean | null;
  oKCtyRecCk?: boolean | null;
  payneCoCk?: boolean | null;
  tXStateRecCk?: boolean | null;
  exxonMF?: boolean | null;
  kochMF?: boolean | null;
  texacoMF?: boolean | null;
  oxyMF?: boolean | null;
  blackBart?: string | null;
  pangaea?: boolean | null;
  oKStateRec?: boolean | null;
  pottCtyRec?: boolean | null;
  oKCtyRec?: boolean | null;
  oKProbate?: boolean | null;
  payneCo?: string | null;
  tXStateRec?: boolean | null;
  apprValue?: string | null;
  totalAppraisedValue?: string | null;
  onlineCtyRecDt?: string | null;
  onlineResearchDt?: string | null;
  currentTaxes?: string | null;
  legalsDesc?: string | null;
  legalsCounty?: string | null;
  legalsState?: string | null;
  comment1?: string | null;
  countyResearch?: number | null;
  countyResearchToBe?: number | null;
  dead?: boolean | null;
  boxNo?: string | null;
  comment6?: string | null;
  company?: string | null;
  fieldResearch?: string | null;
  paperFile?: boolean | null;
  modifyBy: string;
  modifyDt: string;
  createDate: string;
  createdBy: string;
  totalFileOffer: number;
  totalFileValue: number;
}

export interface Response {
  success: boolean;
  message: string;
}

export interface CheckoutPayload {
  fileId: number;
}

export interface AddNewFileProps {
  values?: {
    legalsState?: string;
  };
  errors?: {
    fileName?: string;
    mMSuspAmt?: string;
    startDt?: string;
    onlineResearchDt?: string;
  };
  setError: React.Dispatch<React.SetStateAction<string>>;
  errorCountyRef: React.RefObject<HTMLDivElement>;
}

export interface AddNewContactProps {
  values: Values;
  errors: FormikErrors<{
    ownership?: number | null | string;
    decDt?: string;
    dOB?: string;
    altName?: string;
    altNameFormat?: string;
    phone?: PhoneSchemasData[];
    email?: EmailSchemaData[];
    title?: TitleData[];
  }>;
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => void;
  handlePhoneChange: (
    index: number,
    key: keyof PhoneData,
    value: string
  ) => void;
  handleEmailChange: (
    index: number,
    key: keyof EmailData,
    value: string
  ) => void;
  addNewPhone: () => void;
  addNewEmail: () => void;
  phone: PhoneData[];
  email: EmailData[];
  phone1Ref: React.RefObject<(HTMLInputElement | null)[]>;
  phone2Ref: React.RefObject<(HTMLInputElement | null)[]>;
  phone3Ref: React.RefObject<(HTMLInputElement | null)[]>;
  altName: AltData[];
  addNewAltName: () => void;
  handleAltNameChange: (
    index: number,
    key: keyof AltData,
    value: string
  ) => void;
  title: TitleData[];
  addNewTitle: () => void;
  handleTitleChange: (
    index: number,
    key: keyof TitleData,
    value: string
  ) => void;
}

export interface FileStatusData {
  places: Place[];
}
