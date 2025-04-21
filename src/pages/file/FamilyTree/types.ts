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
  OffersModels: Array<{
    offerID: number;
    offerDate: string | null;
    draftAmount2: string;
    modifyDt: string;
  }>;
  DeedsModels: Array<{
    deedID: number;
    county: string;
    returnDate: string;
  }>;
  TasksModels: Array<{
    taskID: number;
    type: string;
    memo: string;
    dateCreated: string;
    dateDue: string;
    dateComplete: string | null;
    // other task properties
  }>;
  // Add other fields as needed
}

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
