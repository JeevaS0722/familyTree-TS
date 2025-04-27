export interface OfferData {
  offerID: number | null;
  offerDate: string;
  draftAmount2: string;
  modifyDt: string;
  grantors: string | null;
  OfferType?: OfferTypeData | null;
}

export interface AltData {
  altName: string | null;
  altNameFormat: string | null;
  modifyDt: string;
}

export interface TitleData {
  title: string | null;
  preposition: string | null;
  entityName: string | null;
  individuallyAndAs: boolean | false;
  modifyDt: string;
}

export interface OfferTypeData {
  OfferTypes: string;
}

export interface TaskData {
  taskID: number;
  fromUserID: string | null;
  toUserID: string | null;
  toUserDept: string | null;
  dateDue: Date | string | null;
  dateComplete: Date | string | null;
  priority: string | null;
  memo: string | null;
  createDate: Date | string | null;
}

export interface ContactData {
  contactID: number;
  fileID: number;
  fileName?: string;
  relationship?: string | null;
  ownership?: string | null;
  lastName?: string | null;
  firstName?: string | null;
  gender?: string | null;
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
  OffersModels?: OfferData[] | [];
  AlternativeNamesModels?: AltData[] | [];
  TitlesModels?: TitleData[] | [];
  TasksModels?: TaskData[] | [];
}

export interface ContactListResult {
  contact: ContactData[];
  count: number;
  ownershipSum: number;
  totalPurchased: number;
  totalUnpurchased: number;
}

interface Response {
  success: boolean;
  message: string;
}
export interface ContactFileResponse extends Response {
  data: ContactListResult;
}

export interface TreeData {
  id: string;
  rels: {
    father?: string;
    mother?: string;
    spouses?: string[];
    children?: string[];
  };
  main?: boolean;
  isPhantom?: boolean;
}

export interface FamilyTreeData {
  treeId?: number;
  fileId?: number;
  treeData?: TreeData[];
  createdBy?: string | null;
  createDate?: Date;
  modifyBy?: string | null;
  modifyDt?: Date;
}

export interface CreateTreeResponse {
  success: boolean;
  message: string;
  data?: FamilyTreeData | null;
}

export interface NewTreePayload {
  fileId: number;
  treeData: TreeData[] | null;
}

export interface TreeQueryParams {
  fileId: number;
}

export interface ContactFileQueryParams {
  fileId: number;
}

export interface ContactUpdateQueryParams {
  contactId: number;
  gender: string | null;
}

export interface ContactUpdateResponse {
  success: boolean;
  message: string;
}
