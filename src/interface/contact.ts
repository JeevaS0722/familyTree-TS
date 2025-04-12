import { Place } from './common';

export interface editContactFileErrors {
  returnDt: string;
}

export interface ContactData {
  contactID: number;
  fileID: number;
  fileName?: string;
  relationship?: string | null;
  ownership?: string | null;
  lastName?: string | null;
  firstName?: string | null;
  sSN?: string | null;
  dOB?: Date | string;
  deceased?: boolean | false;
  decDt?: Date | string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  hPhone?: string | null;
  oPhone?: string | null;
  badHPhone: number | null;
  badOPhone: number | null;
  oPhone2: string | null;
  badOPhone2: number | null;
  oPhone3: string | null;
  badOPhone3: number | null;
  phone1Desc: string | null;
  phone2Desc: string | null;
  phone3Desc: string | null;
  phone4Desc: string | null;
  email?: string | null;
  visit: boolean | false;
  dNC: boolean | false;
  ticklered?: Date | string;
  fastTrack: boolean | false;
  contactStatus: string | null;
  comment2: string | null;
  probOrd: number | null;
  probNA: number | null;
  probOrdCty: string | null;
  probOrdDt: Date | null;
  probRcdDt: Date | null;
  dCOrd: number | null;
  dCNA: number | null;
  dCOrdCty: string | null;
  dCOrdDt: Date | null;
  dCRcdDt: Date | null;
  obitOrd: number | null;
  obitNA: number | null;
  obitOrdCty: string | null;
  obitOrdDt: Date | null;
  obitRcdDt: Date | null;
  teamMember: string | null;
  modifyBy: string;
  modifyDt: string;
  returnDt: Date | string;
  main?: boolean | null;
  DeedsModels: [
    {
      deedID: number | null;
      county: string;
      returnDate: string;
    },
  ];
  OffersModels: [
    {
      offerID: number | null;
      offerDate: string;
      draftAmount2: string;
      modifyDt: string;
    },
  ];
  FilesModel: {
    fileName: string;
    fileID: number | null;
    whose: number | null;
    fileStatus: string;
    returnedTo: string;
    returnDt: Date | string;
    paperFile: boolean;
    dead: boolean;
    company: string;
    modifyBy: string;
    modifyDt: string;
  };
  PhonesModels: PhoneData[];
  EmailsModels: EmailData[];
  AlternativeNamesModels: AltData[];
  TitlesModels: TitleData[];
}

export interface PhoneData {
  phoneID?: number;
  contactID?: number;
  phoneDesc: string;
  phoneNo: string;
  areaCode: string;
  prefix: string;
}
export interface EmailData {
  Id?: number;
  contactId?: number;
  email: string;
  emailDesc: string;
}

export interface AltData {
  Id?: number;
  contactId?: number;
  altName: string;
  altNameFormat: string;
}

export interface TitleData {
  Id?: number;
  contactID?: number;
  individuallyAndAs?: boolean;
  title?: string;
  preposition?: string;
  entityName?: string;
}

export interface PhoneSchemasData {
  phoneDesc?: string | undefined;
  phoneNo?: string | undefined;
  areaCode?: string | undefined;
  prefix?: string | undefined;
}
export interface EmailSchemaData {
  email?: string | undefined | null;
  emailDesc?: string | undefined | null;
}

export interface AltNameSchemaData {
  altName?: string | undefined | null;
  altNameFormat?: string | undefined | null;
}

export interface ContactTableData {
  dec: boolean | false;
  deceased: string | false;
  select: '';
  contactId: number;
  lastName: string | '';
  firstName: string | '';
  relationship: string | '';
  ownership: string | '';
  offerDate: string | '';
  draftAmount2: string | '';
  returnDate: string | '';
  visit: boolean | false;
  fastTrack: boolean | false | string;
  address: string | '';
  city: string | '';
  state: string | '';
  zip: string | '';
  sSN: string | '';
  decDt: string | '';
  dOB: string | '';
  deedId?: number | null;
  dNC: boolean | null;
  ticklered: string | Date | undefined;
  main: boolean | null;
}

export interface ContactListResult {
  contact: ContactData[];
  count: number;
  ownershipSum: number;
  totalPurchased: number;
  totalUnpurchased: number;
}

export interface ContactsResult {
  data: ContactsResult | undefined;
  contacts: ContactData[];
}

export interface errors {
  dOB?: string;
  decDt: string;
}

export interface NewContactForm {
  fileID: number | null;
  relationship?: string;
  ownership?: number | null | string;
  lastName?: string;
  firstName?: string;
  sSN?: string;
  deceased?: boolean;
  decDt?: string;
  dOB?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  memo?: string;
  altName?: AltData[];
  phone?: PhoneData[];
  email?: EmailData[];
  title?: TitleData[];
}

export interface NewContactPayload {
  fileID: number | null;
  relationship?: string;
  ownership?: number | null | string;
  lastName?: string;
  firstName?: string;
  altName?: string;
  sSN?: string;
  deceased?: boolean;
  decDt?: string;
  dOB?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  note?: {
    memo?: string;
  };
  phone?: PhoneData[];
  email?: EmailData[];
}

export interface CreateContactResponse {
  success: boolean;
  message: string;
  data?: { contactID?: number };
}

export interface Contact {
  contactId: string;
  select?: string;
  firstName?: string;
  lastName?: string;
  deceased?: string;
  relationship?: string;
  ownership?: string;
  offerDate?: string;
  draftAmount2?: string;
  returnDate?: string;
  visit?: string;
  fastTrack?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  sSN?: string;
  decDt?: string;
  dOB?: string;
  dec?: string;
  email?: string;
  main?: boolean;
}
export interface ContactColumn {
  label: string;
  accessor: keyof Contact;
  sortable?: boolean;
}

export interface ContactProps {
  data: ContactTableData[];
  columns: ContactColumn[];
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  sortOrder: string;
  setSortOrder: React.Dispatch<React.SetStateAction<string>>;
  setSortLoading: React.Dispatch<React.SetStateAction<boolean>>;
  sortLoading: boolean;
  mainContactId: number | null;
  setMainContactId: (id: number | null) => void;
}

export interface EditContactData {
  contactID?: number;
  fileID?: number;
  relationship?: string | null;
  lastName?: string | null;
  firstName?: string | null;
  contactName?: string | null;
  ownership?: string | null;
  sSN?: string | null;
  dOB?: Date | string;
  deceased?: boolean | false;
  decDt?: Date | string;
  visit?: boolean | false;
  dNC?: boolean | false;
  ticklered?: Date | string;
  fastTrack?: boolean | false;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  comment2?: string | null;
  fileName?: string | null;
  whose?: number | null;
  fileStatus?: string | null;
  returnedTo?: string | null;
  returnDt?: Date | string;
  paperFile?: boolean | false;
  company?: string | null;
  modifyBy?: string | null;
  modifyDt?: string;
  totalNMAOwned?: number;
  phone?: PhoneData[];
  email?: EmailData[];
  altName?: AltData[];
  title?: TitleData[];
}
interface Response {
  success: boolean;
  message: string;
}
export interface ContactFileResponse extends Response {
  data: ContactListResult;
}

export interface ContactFileQueryParams {
  fileid: number;
  sortBy: string;
  sortOrder: string;
}

export interface ContactsQueryParams {
  contactIds: string;
  sortBy: string;
  sortOrder: string;
}

export interface ContactDetailResponse extends Response {
  data: { contact: ContactData; totalNMAOwned: number };
}

export interface ContactDetailQueryParams {
  contactId: number;
}

export interface ViewContactResult {
  success: boolean;
  message: string;
  data?: { contact?: ContactData[] };
}

export interface EditContactResponse {
  success: boolean;
  message: string;
  data?: { contactID?: number };
}

export interface DeleteContactResponse {
  success: boolean;
  message: string;
  data: object;
}

export interface ContactDetails {
  contactID: number;
  fileID?: number | null;
  relationship?: string | null;
  ownership?: string | null;
  lastName?: string | null;
  firstName?: string | null;
  sSN?: string | null;
  dOB?: Date | string;
  deceased?: boolean | false;
  decDt?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  returnDt?: Date | string;
  fileName?: string | null;
  whose?: number | null;
  fileStatus?: string;
  returnedTo?: string;
  fmodifyBy?: string;
  fmodifyDt?: Date | string;
  paperFile?: boolean;
  email?: string;
  phone?: Phones[];
}

export interface ContactInfoProps {
  contactDetailsData: ContactData;
  state: Place[];
  loading: boolean;
  errors?: {
    firstName?: string;
    email?: string;
  };
}

export interface Phones {
  phoneID?: number;
  contactID?: number;
  phoneDesc: string;
  phoneNo: string;
  areaCode: string;
  prefix: string;
}

export interface EditContactError {
  ownership?: string;
  firstName?: string;
  phone?: PhoneSchemasData[];
  email?: EmailSchemaData[];
  zip?: number;
  dOB?: string;
  decDt?: string;
  ticklered?: string;
  altName?: AltNameSchemaData[];
  title?: TitleData[];
}

export interface NameSchemasData {
  firstName?: string | null;
  lastName?: string | null;
  altName?: string | null;
}
