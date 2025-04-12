import { State } from './common';

export interface RecordingDetailsData {
  deedId: number;
  documentType?: string | null;
  county: string;
  state: string;
  dateSent: string | null;
  dateReturn: string | null;
  book: string;
  page: string;
}

export interface DropdownObjectForRecording {
  state: State[];
}

export interface RecordingParamsForRecId {
  recId: number;
}

interface Response {
  success: boolean;
  message: string;
}

export interface RecordingGetByRecIdData {
  recID: number;
  documentType: string | null;
  deedID: number;
  county: string;
  state: string;
  dateSent: string;
  dateReturn: string;
  book: string;
  page: string;
  modifyBy: string | null;
  modifyDt: string;
  createdBy: string | null;
  createDate: string;
}

export interface RecordingGetByRecIdResponse extends Response {
  data: RecordingGetByRecIdData;
}

export interface RecordingParamsForDeedId {
  deedId: number;
  orderBy?: string;
  order?: string;
}

export interface RecordingGetAllByDeedIdResponse extends Response {
  data: RecordingGetByRecIdData[];
  count?: number;
}

export interface CrateRecordingResponse extends Response {
  data: {
    recId: number;
  };
}

export interface UpdateRecordingDetailsData {
  recId: number;
  documentType?: string | null;
  county: string;
  state: string;
  dateSent: string | null;
  dateReturn: string | null;
  book: string;
  page: string;
}

export interface RecordingTabContentProps {
  deedId: number;
}

export interface DeleteRecordingResponse {
  success: boolean;
  message: string;
}
