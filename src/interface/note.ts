import { Place } from './common';

export interface ContactNotesTabContentProps {
  contactId: string | number | null;
  orderBy: string | undefined;
  order: string;
}

export interface DeedNotesTabContentProps {
  deedId: string | number | null;
  contactId: string | number | null;
  orderBy: string | undefined;
  order: string;
}

export interface FileNotesTabContentProps {
  fileId: string | number | null;
  orderBy: string | undefined;
  order: string;
}

export interface OrderNotesTabContentProps {
  orderId: string | number | null;
  orderBy: string | undefined;
  order: string;
  deedId: number;
}

export interface Response {
  success: boolean;
  message: string;
}

export interface getNoteResponse extends Response {
  data: {
    noteId: number;
    notes: string;
    contactName: string;
  };
}

export interface getFileNoteListResponse extends Response {
  data: {
    rows: {
      dateCompleted: string;
      type: string;
      fromUserId: string;
      toUserId: string;
      noteId: number;
      contactName: string;
      notes: string;
    }[];
    count: number;
  };
}

export interface getContactNoteListResponse extends Response {
  data: {
    rows: {
      dateCompleted: string;
      dateCreated: string;
      type: string;
      fromUserId: string;
      toUserId: string;
      noteId: number;
      contactName: string;
      notes: string;
    }[];
    count: number;
  };
}

export interface getDeedNoteListResponse extends Response {
  data: {
    rows: {
      dateCompleted: string;
      dateCreated: string;
      type: string;
      fromUserId: string;
      toUserId: string;
      noteId: number;
      contactName: string;
      notes: string;
    }[];
    count: number;
  };
}

export interface getOrderNoteListResponse extends Response {
  data: {
    rows: {
      dateCompleted: string;
      fromUserId: string;
      noteId: number;
      contactName: string;
      notes: string;
    }[];
    count: number;
  };
}

export interface getFileNoteListQueryParams {
  fileId: number;
  orderBy: string | undefined;
  order: string | undefined;
}

export interface getDeedNoteListQueryParams {
  deedId: number;
  orderBy: string | undefined;
  order: string | undefined;
}

export interface getOrderNoteListQueryParams {
  orderId: number;
  orderBy: string | undefined;
  order: string | undefined;
}

export interface getContactNoteListQueryParams {
  contactId: number;
  orderBy: string | undefined;
  order: string | undefined;
}

export interface deedOrContactNoteFormProps {
  errors?: {
    type?: string;
    memo?: string;
  };
  taskType: Array<object>;
  fileStatus: Place[] | [];
  isValidating: boolean;
}

export interface editNoteFormProps {
  errors?: {
    memo?: string;
  };
  isValidating: boolean;
}

export interface fileNoteFormProps {
  errors?: {
    type?: string;
    memo?: string;
  };
  taskType: Array<object>;
  returnedTo: Place[] | [];
  isValidating: boolean;
}

export interface addFileNotePayload {
  type: string;
  memo: string;
  returnedTo: string;
  fileId: number;
}
export interface addDeedOrContactNoteValues {
  type: string;
  memo: string;
  fileStatus: string;
}

export interface editNoteValues {
  memo: string;
}

export interface addFileNoteValues {
  type: string;
  memo: string;
  returnedTo: string;
}

export interface addDeedNotePayload {
  type: string;
  memo: string;
  fileStatus: string;
  deedId: number;
}

export interface addContactNotePayload {
  type: string;
  memo: string;
  fileStatus: string;
  contactId: number;
}

export interface editNotePayload {
  noteId: number;
  memo: string;
}

export interface getNoteQueryParams {
  noteId: number;
}

export interface deleteNotePayload {
  noteId: number;
}
