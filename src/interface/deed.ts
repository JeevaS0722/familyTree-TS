import { Place } from './common';
import { EmailData, PhoneData, AltData, TitleData } from './contact';
import { Employee } from './employee';

export interface DeedData {
  fileId: number;
  contactId: number;
}

export interface CreateDeedResponse {
  success: boolean;
  message: string;
  data: {
    deedId: number;
  };
  warning?: string;
}

export interface GenerateDeedReceivedLetterDocPayload {
  deedId: number;
}

export interface DeedViewDropdown {
  locations: Place[];
  status: Place[];
  buyers: Employee[];
  titleFailedReasons: { reason: string }[];
}

export interface GetDeedRequest {
  deedId: number;
}

export interface GetDeedResponse {
  success: boolean;
  message: string;
  deed: Deed;
  totalPurchased: number;
  totalNMAOwned: number;
}

export interface GetAllDeedsResponse {
  success: boolean;
  message: string;
  deeds: {
    deedId: number;
    county: string;
    returnDate: string;
  }[];
}

export interface GetAllDeedsRequest {
  contactId: number;
}

interface ContactsModel {
  EmailsModels: EmailData[];
  contactID: number;
  fileID: number;
  relationship: string;
  ownership: string;
  lastName: string;
  firstName: string;
  sSN: string;
  dOB?: Date | string;
  deceased: boolean;
  decDt?: Date | string;
  address: string;
  city: string;
  state: string;
  zip: string;
  hPhone: string;
  oPhone: string;
  badHPhone: number;
  badOPhone: number;
  oPhone2: string;
  badOPhone2: number;
  oPhone3: string;
  badOPhone3: number;
  phone1Desc: string;
  phone2Desc: string;
  phone3Desc: string;
  phone4Desc: string;
  email: string;
  visit: boolean;
  dNC: boolean;
  ticklered?: Date | string;
  fastTrack: boolean;
  contactStatus: string;
  comment2: string;
  probOrd: number;
  probNA: number;
  probOrdCty: string;
  probOrdDt: null | string;
  probRcdDt: null | string;
  dCOrd: number;
  dCNA: number;
  dCOrdCty: string;
  dCOrdDt: null | string;
  dCRcdDt: null | string;
  obitOrd: number;
  obitNA: number;
  obitOrdCty: string;
  obitOrdDt: null | string;
  obitRcdDt: null | string;
  teamMember: string;
  modifyBy: string;
  modifyDt: string;
  createdBy: null | string;
  createDate: string;
  grantor: string;
  payee: string;
  PhonesModels?: PhoneData[];
  AlternativeNamesModels?: AltData[];
  TitlesModels?: TitleData[];
}

interface EmployeesModel {
  employeeID: number;
  fullName: string;
  lastName: string;
  firstName: string;
  buyers: number;
  initials: string;
  extension: number;
  email: string;
  modifyBy: null | string;
  modifyDt: string;
  createdBy: null | string;
  createDate: string;
}

interface FilesModel {
  fileID: number;
  fileName: string;
  fileStatus: string;
  returnedTo: string;
  oldFileLoc: string;
  returnDt: string | null;
  whose: number;
  fileOrigin: string;
  startDt: string;
  mMSuspAmt: string;
  mMComment: string;
  exxonMFCk: boolean;
  kochMFCk: boolean;
  texacoMFCk: boolean;
  oxyMFCk: boolean;
  pangaeaCk: number;
  oKStateRecCk: boolean;
  pottCtyRecCk: boolean;
  oKCtyRecCk: boolean;
  payneCoCk: boolean;
  tXStateRecCk: boolean;
  exxonMF: string;
  kochMF: string;
  texacoMF: string;
  oxyMF: string;
  blackBart: string;
  pangaea: string;
  oKStateRec: string;
  pottCtyRec: string;
  oKCtyRec: string;
  oKProbate: boolean;
  payneCo: string;
  tXStateRec: string;
  apprValue: string;
  totalAppraisedValue: string;
  onlineCtyRecDt: string;
  onlineResearchDt: string;
  currentTaxes: string;
  legalsDesc: string;
  legalsCounty: string;
  legalsState: string;
  comment1: string;
  countyResearch: number;
  countyResearchToBe: number;
  dead: boolean;
  boxNo: string;
  comment6: string;
  company: string;
  fieldResearch: string;
  createdBy: string;
  createDate: string;
  paperFile: boolean;
  modifyBy: string;
  modifyDt: string;
  Whose: number;
  EmployeesModel: EmployeesModel;
}

export interface Deed {
  fileName: string;
  fileStatus: string;
  totalPurchased: number;
  deedID: number;
  fileID: number;
  contactID: number;
  returned: number;
  returnDate: string;
  deedState?: string;
  deedCounty?: string;
  state?: string;
  county?: string;
  comment1: string;
  ckLegals: boolean;
  revisions: boolean;
  comment2: string;
  revRcvd: boolean;
  revRcvdNA: boolean;
  draftAmount1: number;
  dueDt1?: string | null;
  paid1: boolean;
  datePaid1?: string | null;
  checkNo1: string;
  draftAmount2: number;
  dueDt2: string | null;
  paid2: boolean;
  datePaid2?: string;
  checkNo2: string;
  comment3: string;
  comment4: string;
  curativeNeed: boolean;
  curativeRcvd: boolean;
  curativeNA: boolean;
  quietTitle: boolean;
  comment5: string;
  qtComplete: boolean;
  qtNA: boolean;
  recComplete: number;
  taxesDue: number;
  taxNA: number;
  taxEntityCk: number;
  taxPartialOwn: number;
  drillingInfo: number | string | boolean | null | undefined;
  checked: number | string | boolean | null | undefined;
  funds: number;
  fundsNA: boolean;
  claimState: number;
  comment7: string;
  wellFComp: boolean;
  wellFNA: boolean;
  listWellFiles: string;
  sectionFComp: boolean;
  sectionFNA: boolean;
  listSectFiles: string;
  complete: boolean;
  titleFailed: number;
  titleFailedReason: string;
  modifyBy: string;
  modifyDt: string;
  createdBy: null | string;
  createDate: string;
  FileID: number;
  ContactID: number;
  ContactsModel: ContactsModel;
  FilesModel: FilesModel;
  phone?: Array<{
    areaCode: string;
    prefix: string;
    phoneNo: string;
    phoneDesc: string;
  }>;
  email?: Array<{
    email: string;
    emailDesc: string;
  }>;
  altName?: Array<{
    altName: string;
    altNameFormat: string;
  }>;
  title?: Array<{
    title: string;
    preposition: string;
    entityName: string;
    individuallyAndAs: boolean;
  }>;
}

export interface GetDeedDataByDeedIdResponse {
  deed: Deed;
}

export interface ListOfDeeds {
  deedId: number;
  county: string;
  returnDate: string;
}

export interface EditFormProps {
  errors?: {
    returnDt?: string;
    returnDate?: string;
  };
  isValidating?: boolean;
  values: EditDeedFormInterface;
  deedDetailsData: EditDeedFormInterface;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  errorCountyRef: React.RefObject<HTMLDivElement>;
}
export interface DeedStatusProps {
  contactId: number;
}

export interface EditDeedFormInterface {
  deedID?: number;
  returned?: number;
  returnDate?: string;
  deedCounty?: string;
  deedState?: string;
  comment1?: string;
  ckLegals?: boolean;
  revisions?: boolean;
  revRcvd?: boolean;
  revRcvdNA?: boolean;
  draftAmount1?: number;
  dueDt1?: string | null;
  paid1?: boolean;
  datePaid1?: Date | string | null;
  checkNo1?: string;
  draftAmount2?: number;
  dueDt2?: string | null;
  paid2?: boolean;
  datePaid2?: string | null;
  checkNo2?: string | null;
  comment3?: string;
  comment4?: string;
  curativeNeed?: boolean;
  curativeRcvd?: boolean;
  curativeNA?: boolean;
  quietTitle?: boolean;
  comment5?: string;
  qtComplete?: boolean;
  qtNA?: boolean;
  recComplete?: boolean;
  taxesDue?: boolean;
  taxNA?: boolean;
  taxEntityCk?: boolean;
  taxPartialOwn?: boolean;
  funds?: number;
  fundsNA?: boolean;
  claimState?: number;
  comment7?: string;
  wellFComp?: boolean;
  wellFNA?: boolean;
  listWellFiles?: string;
  sectionFComp?: boolean;
  sectionFNA?: boolean;
  listSectFiles?: string;
  complete?: boolean;
  titleFailed?: number;
  titleFailedReason?: string;
  createdBy?: string | null;
  createDate?: string;
  drillingInfo?: number | string | boolean | null | undefined;
  checked?: number | string | boolean | null | undefined;
  phone?: Array<{
    areaCode: string;
    prefix: string;
    phoneNo: string;
    phoneDesc: string;
  }>;
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
  whose?: number | null;
  fileStatus?: string | null;
  returnedTo?: string | null;
  returnDt?: Date | string;
  paperFile?: boolean | false;
  company?: string | null;
  modifyBy?: string | null;
  modifyDt?: string;
  grantor?: string;
  payee?: string;

  fileName?: string | null;
  oldFileLoc?: string;
  fileOrigin?: string;
  startDt?: string;
  mMSuspAmt?: string;
  mMComment?: string;
  exxonMFCk?: boolean;
  kochMFCk?: boolean;
  texacoMFCk?: boolean;
  oxyMFCk?: boolean;
  pangaeaCk?: number;
  oKStateRecCk?: boolean;
  pottCtyRecCk?: boolean;
  oKCtyRecCk?: boolean;
  payneCoCk?: boolean;
  tXStateRecCk?: boolean;
  exxonMF?: string;
  kochMF?: string;
  texacoMF?: string;
  oxyMF?: string;
  blackBart?: string;
  pangaea?: string;
  oKStateRec?: string;
  pottCtyRec?: string;
  oKCtyRec?: string;
  oKProbate?: boolean;
  payneCo?: string;
  tXStateRec?: string;
  apprValue?: string;
  totalAppraisedValue?: string;
  onlineCtyRecDt?: string | null;
  onlineResearchDt?: string | null;
  currentTaxes?: string;
  legalsDesc?: string;
  legalsCounty?: string;
  legalsState?: string;
  countyResearch?: number;
  countyResearchToBe?: number;
  dead?: boolean;
  boxNo?: string;
  comment6?: string;
  fieldResearch?: string;
  totalPurchased?: number;
  totalNMAOwned?: number;
  email?: Array<{
    email: string;
    emailDesc: string;
  }>;
  altName?: Array<{
    altName: string;
    altNameFormat: string;
  }>;
  title?: Array<{
    title: string;
    preposition: string;
    entityName: string;
    individuallyAndAs: boolean;
  }>;
}

export interface EditTitleFailure {
  deedId: number;
  titleFailDate: string;
  lossAmount: number;
}
