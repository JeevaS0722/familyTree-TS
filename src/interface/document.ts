export interface DocumentListResult {
  deed_documents?: FilesStorage[];
  file_documents?: DeedsStorage[];
}

export interface Response {
  message?: string;
  success?: boolean;
}

export interface DocumentsResponse extends Response {
  data?: DocumentListResult;
}

export interface FilesStorage {
  id: number;
  fileId?: number;
  fileName?: string;
  fileFullpath?: string;
  fileCategory?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface DeedsStorage {
  id: number;
  deedId?: number;
  fileName?: string;
  fileFullpath?: string;
  fileCategory?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface getDocumentsParams {
  fileId?: number;
  deedId?: number | string;
}

export interface deleteDocumentsParams {
  id?: number;
  isFileDocument?: boolean;
  isEditor?: boolean;
  deleteAll?: string | boolean;
}

export interface DeleteDocumentResponse {
  success: boolean;
  message: string;
}

export interface renameDocumentsPayload {
  id?: number;
  isFileDocument?: boolean;
  fileName: string;
}
export interface OnlyOfficePrintPayload {
  id: number;
  type: string;
  fileURL: string;
}
export interface RenameDocumentResponse {
  success: boolean;
  message: string;
  data: {
    doc_id: string;
  };
}

export interface OnlyOfficeTokenResponse {
  success: boolean;
  message: string;
  data: {
    onlyOfficeToken: string;
  };
}

export interface Document {
  id?: number;
  deedId?: number;
  fileId?: number;
  fileName: string;
  fileFullpath: string;
  fileCategory?: string;
}

export interface UploadFileResponse {
  success: boolean;
  message: string;
  data: [
    {
      doc_id: string;
    },
  ];
}

export interface DocumentResponse extends Response {
  data?: { document: FilesStorage | DeedsStorage | Document };
}

export interface getDocumentParams {
  id?: number;
  type?: string;
  action?: string;
}
export interface postDuplicateDocumentParams {
  fileId: number;
  deedId?: number;
  filenames: string[];
}

export interface DuplicateDocumentListResponse extends Response {
  data: {
    duplicates: {
      fileId: number | null;
      deedId: number | null;
      docId: number;
      fileName: string;
      createdAt: string | Date;
      updatedAt: string | Date;
      storageType: 'file_storage' | 'deed_storage';
      multipleMatch: boolean; // ✅ Ensure this is always included
      matchCount: number; // ✅ Total number of matches
      matchedIds: number[]; // ✅ Stores matching fileIds (for file storage) or deedIds (for deed storage)
      matchType: 'same_deed' | 'cross_deed' | 'multiple_file' | null; // ✅ Describes the type of match
    }[];
  };
}

export interface DuplicateDocumentListResponseObj {
  fileId: number | null;
  deedId: number | null;
  docId: number;
  fileName: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  storageType: 'file_storage' | 'deed_storage';
  multipleMatch: boolean; // ✅ Ensure this is always included
  matchCount: number; // ✅ Total number of matches
  matchedIds: number[]; // ✅ Stores matching fileIds (for file storage) or deedIds (for deed storage)
  matchType: 'same_deed' | 'cross_deed' | 'multiple_file' | null; // ✅ Describes the type of match
}

export interface DuplicateFile {
  fileName: string;
  orgFilename: string;
  fileType: string;
  action: 'rename' | 'override' | 'remove' | null;
  newFileName?: string;
  type: 'local' | 'db';
  isEditing?: boolean;
  isRemoved?: boolean;
  fileId: number | null;
  deedId: number | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  storageType: 'file_storage' | 'deed_storage';
  multipleMatch: boolean; // ✅ Ensure this is always included
  matchCount: number; // ✅ Total number of matches
  matchedIds: number[]; // ✅ Stores matching fileIds (for file storage) or deedIds (for deed storage)
  matchType: 'same_deed' | 'cross_deed' | 'multiple_file' | null; // ✅ Describes the type of match
  isError?: boolean;
  errorMessage?: string;
  createdAtUnique: string;
}
