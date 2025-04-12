import { QueryParams } from './common';
interface actionDataConfig {
  actionName: string;
  data: string[];
}

interface actionDataValues {
  label: string;
  count: number;
}

interface metricDataValues {
  firstName?: string;
  fullName?: string;
  count: number;
}

interface actionData {
  actions: {
    actionName: string;
    data: actionDataValues[];
  }[];
}

interface metricData {
  metrics: {
    metricName: string;
    data: metricDataValues[];
  }[];
}

export interface Response {
  success: boolean;
  message: string;
}

export interface LayoutResponse extends Response {
  data: {
    metrics: string[];
    actions: actionDataConfig[];
  };
}

export interface ActionResponse extends Response {
  data: actionData;
}

export interface MetricResponse extends Response {
  data: metricData;
}

export interface reducerState {
  actions: {
    actionName: string;
    data: actionDataValues[];
  }[];
  metrics: {
    metricName: string;
    data: metricDataValues[];
  }[];
  layout: {
    metrics: string[];
    actions: actionDataConfig[];
  };
}

export interface readyForOfferData {
  count: number;
  records: {
    totalFileValue: number | null;
    origin: string | null;
    fileName: string | null;
    modifiedBy: string | null;
    returnDate: string | null;
    fileId: number;
  }[];
}

interface fileReviewData {
  count: number;
  records: {
    totalFileValue: number | null;
    origin: string | null;
    fileName: string | null;
    modifiedBy: string | null;
    returnDate: string | null;
    fileId: number;
    buyer?: string;
  }[];
}

interface taskData {
  count: number;
  records: {
    priority?: string;
    dueDate: string;
    sentBy: string | null;
    buyer?: string;
    fileId: number;
    notes: string;
    taskType: string;
    fileName: string;
    contactName: string;
    contactId: number;
    deedId: number[];
    county?: string | number | null;
    city?: string | number;
    zip?: string | number;
    state: string | number;
    taskId: number;
    visit?: number;
    payee?: string;
    address?: string;
    totalFileValue?: number;
    amount?: string;
    isDeedAssociated: boolean;
  }[];
}

interface requestBefore21DaysData {
  count: number;
  records: {
    orderId: number;
    contactName: string;
    fileName: string;
    orderType: string;
    orderedFrom: string;
    fileId: number;
    contactId: number;
    county: string;
    state: string;
    modifiedBy: string;
    orderReceiveDate: string;
    orderDate: string;
  }[];
}

interface checkedOutData {
  count: number;
  records: {
    requestedBy: string;
    date: string;
    fileName: string;
    fileId: number;
    totalFileValue: number;
  }[];
}

interface unreceivedRequestsData {
  count: number;
  records: {
    fileName: string;
    contactName: string;
    type: string;
    county: string;
    state: string;
    from: string;
    requestedBy: string;
    fileId: number;
    contactId: number;
    orderId: number;
    receivedDate: string;
  }[];
}

interface deedsPendingData {
  count: number;
  records: {
    fileName: string;
    contactName: string;
    county: string;
    returnedDate: string;
    buyer: string;
    purchaseAmount: number;
    finalPaymentDate: string;
    totalFileValue: number;
    fileId: number;
    contactId: number;
    deedId: number;
    ownership: number;
  }[];
}

interface offersToSendData {
  count: number;
  records: {
    requestedDate: string;
    grantors: string;
    fileName: string;
    totalFileValue: number;
    offerType: string;
    letterType: string;
    draft1: string;
    draft2: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    email: string;
    requestedBy: string;
    specialInstruction: string;
    offerId: number;
    fileId: number;
  }[];
}

interface requestsToSendData {
  count: number;
  records: {
    fileName: string;
    contactName: string;
    type?: string;
    county?: string;
    state?: string;
    from?: string;
    requestedDate?: string;
    requestedBy?: string;
    fileId: number;
    contactId: number;
    orderId?: number;
    modifiedBy?: string;
    orderDt?: string;
    name?: string;
    payee?: string;
    amount?: string | number;
    address?: string | number;
    memo?: string;
    addressId?: string;
  }[];
}

export interface ReadyForOfferResponse extends Response {
  data: readyForOfferData;
}
export interface FileReviewResponse extends Response {
  data: fileReviewData;
}

export interface TasksReponse extends Response {
  data: taskData;
}

export interface UnreceivedRequestsResponse extends Response {
  data: unreceivedRequestsData;
}

export interface DeedsPendingResponse extends Response {
  data: deedsPendingData;
}

export interface OffersToSendResponse extends Response {
  data: offersToSendData;
}

export interface RequestsToSendResponse extends Response {
  data: requestsToSendData;
}

export interface CheckedOutResponse extends Response {
  data: checkedOutData;
}

export interface RequestBefore21Days extends Response {
  data: requestBefore21DaysData;
}

export interface ActionItemQueryParams {
  pageNo?: number | undefined;
  size?: number | undefined;
  order?: string | undefined;
  orderBy?: string | undefined;
}

export interface TasksProps {
  data: TasksReponse | undefined;
  tasksLoading: boolean;
  getData: (args: QueryParams) => void;
  isFetching: boolean;
  title: string;
  getFilteredData?: (args: SearchMyTaskQueryParams) => void;
  count?: number;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SearchMyTaskQueryParams {
  priority?: string;
  buyer?: string;
  sentBy?: string;
  taskType?: string;
  fileName?: string;
  contactName?: string;
  visit?: boolean;
  county?: string;
  state?: string;
  zip?: string;
  city?: string;
  payee?: string;
  dueDate?: string;
  dueDate_from?: string;
  dueDate_to?: string;
  dueDate_condition?: string;
  totalFileValue?: string;
  totalFileValue_min?: string;
  totalFileValue_max?: string;
  totalFileValue_condition?: string;
  amount_from?: string;
  amount_to?: string;
  amount?: string;
  amount_condition?: string;
  pageNo?: number;
  size?: number;
  orderBy?: string;
  order?: string;
  title?: string;
}

export interface SearchCheckedOutQueryParams {
  requestedBy?: string;
  fileName?: string;
  date?: string;
  date_condition?: string;
  date_from?: string;
  date_to?: string;
  totalFileValue_max?: string;
  totalFileValue_min?: string;
  totalFileValue_condition?: string;
  totalFileValue?: string;
  pageNo?: number;
  size?: number;
  orderBy?: string;
  order?: string;
}

export interface SearchReadyForOfferQueryParams {
  modifiedBy?: string;
  fileName?: string;
  returnDate?: string;
  returnDate_condition?: string;
  returnDate_from?: string;
  returnDate_to?: string;
  totalFileValue_max?: string;
  totalFileValue_min?: string;
  totalFileValue_condition?: string;
  totalFileValue?: string;
  pageNo?: number;
  size?: number;
  orderBy?: string;
  order?: string;
}

export interface SearchDeedsPendingQueryParams {
  fileName?: string;
  contactName?: string;
  buyer?: string;
  county?: string;
  returnedDate_condition?: string;
  returnedDate?: string;
  returnedDate_from?: string;
  returnedDate_to?: string;
  totalFileValue_condition?: string;
  totalFileValue_max?: string;
  totalFileValue_min?: string;
  totalFileValue?: string;
  purchaseAmount_condition?: string;
  purchaseAmount?: string;
  purchaseAmount_min?: string;
  purchaseAmount_max?: string;
  finalPaymentDate_condition?: string;
  finalPaymentDate?: string;
  finalPaymentDate_from?: string;
  finalPaymentDate_to?: string;
  totalPurchased_condition?: string;
  totalPurchased?: string;
  totalPurchased_min?: string;
  totalPurchased_max?: string;
  ownership_condition?: string;
  ownership?: string;
  ownership_min?: string;
  ownership_max?: string;
  main?: boolean;
  pageNo?: number;
  size?: number;
  orderBy?: string;
  order?: string;
}

export interface SearchRequestBefore21DaysQueryParams {
  fileName?: string;
  contactName?: string;
  orderType?: string;
  orderedFrom?: string;
  county?: string;
  state?: string;
  orderDate_condition?: string;
  orderDate?: string;
  orderDate_from?: string;
  orderDate_to?: string;
  receivedDate_condition?: string;
  receivedDate?: string;
  receivedDate_to?: string;
  receivedDate_from?: string;
  modifiedBy?: string;
  pageNo?: number;
  size?: number;
  orderBy?: string;
  order?: string;
}

export interface UnreceivedRequestsParams {
  contactName?: string;
  county?: string;
  date?: string;
  date_condition?: string;
  date_from?: string;
  date_to?: string;
  fileName?: string;
  from?: string;
  receivedDate?: string;
  receivedDate_condition?: string;
  receivedDate_from?: string;
  receivedDate_to?: string;
  requestedBy?: string;
  state?: string;
  type?: string;
  pageNo?: number | undefined;
  size?: number | undefined;
  order?: string | undefined;
  orderBy?: string | undefined;
  page?: number;
  rowsPerPage?: number;
  sortBy?: string | undefined;
  sortOrder?: string;
}

export interface SearchOfferToSendQueryParams {
  requestedDate_condition?: string;
  requestedDate?: string;
  requestedDate_from?: string;
  requestedDate_to?: string;
  fileName?: string;
  grantors?: string;
  totalFileValue_condition?: string;
  totalFileValue_max?: string;
  totalFileValue_min?: string;
  totalFileValue?: string;
  offerType?: string;
  letterType?: string;
  draft1_condition?: string;
  draft1?: string;
  draft1_min?: string;
  draft1_max?: string;
  draft2_condition?: string;
  draft2?: string;
  draft2_min?: string;
  draft2_max?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  email?: string;
  requestedBy?: string;
  specialInstruction?: string;
  pageNo?: number;
  size?: number;
  page?: number;
  rowsPerPage?: number;
  orderBy?: string;
  order?: string;
  phone?: string;
}

export interface FileReviewParams {
  fileName?: string;
  buyer?: string;
  totalFileValue?: string;
  totalFileValue_condition?: string;
  totalFileValue_from?: string;
  totalFileValue_to?: string;
  modifiedBy?: string;
  returnDate?: string;
  returnDate_condition?: string;
  returnDate_from?: string;
  returnDate_to?: string;
  pageNo?: number | undefined;
  size?: number | undefined;
  order?: string | undefined;
  orderBy?: string | undefined;
  page?: number;
  rowsPerPage?: number;
  sortBy?: string | undefined;
  sortOrder?: string;
}

export interface SearchRequestToSendQueryParams {
  fileName?: string;
  contactName?: string;
  type?: string;
  county?: string;
  state?: string;
  requestedDate_condition?: string;
  requestedDate?: string;
  requestedDate_from?: string;
  requestedDate_to?: string;
  requestedBy?: string;
  pageNo?: number;
  size?: number;
  page?: number;
  rowsPerPage?: number;
  sortBy?: string | undefined;
  sortOrder?: string;
  orderBy?: string;
  order?: string;
}
