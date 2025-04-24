// src/component/FamilyTree/types/familyTreeExtended.ts

import { PersonData as BasePersonData } from './familyTree';

// Contact interface from old code
export interface Contact {
  contactID: number;
  relationship: string | null;
  lastName: string;
  firstName: string;
  sSN: string | null;
  dOB: string | null;
  deceased: boolean;
  decDt: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  comment2: string | null;
  ownership: string;
  main: boolean;
  altNameFormat: string;
  OffersModels?: Array<{
    offerID: number;
    offerDate: string | null;
    draftAmount2: string;
    modifyDt: string;
  }>;
  DeedsModels?: Array<{
    deedID: number;
    county: string;
    returnDate: string;
  }>;
  TasksModels?: Array<{
    taskID: number;
    type: string;
    memo: string;
    dateCreated: string;
    dateDue: string;
    dateComplete: string | null;
  }>;
}

// API response interface
export interface ContactApiResponse {
  success: boolean;
  message: string;
  data: {
    contact: Contact[];
    count: number;
    ownershipSum: number;
    totalPurchased: number;
    totalUnpurchased: number;
  };
}

// Enhanced PersonData with contact-specific fields
export interface EnhancedPersonData extends BasePersonData {
  data: BasePersonData['data'] & {
    contactId?: number;
    fileId?: number;
    relationshipType?: string;
    divisionOfInterest?: string;
    percentage?: string;
    countyOfDeath?: string;
    offerAmount?: string;
    isNewNotes?: boolean;
  };
  originalContact?: Contact;
}

// Note interface for the notes panel
export interface Note {
  id: string;
  type: string;
  content: string;
  createdBy: string;
  createdDate: string;
}

// API note interface
export interface ApiNote {
  noteId: number;
  type: string;
  notes: string;
  fromUserId: string;
  toUserId: string;
  dateCompleted: string;
  contactName: string;
}

// Notes API response
export interface NotesApiResponse {
  rows: ApiNote[];
  count: number;
}

// Add note payload
export interface AddNotePayload {
  contactId: string | number;
  type: string;
  memo: string;
  fileStatus?: string;
}
