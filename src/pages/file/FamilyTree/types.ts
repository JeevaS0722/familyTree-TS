export interface OfferData {
  [key: string]: string | number | null;
  offerID: number;
  grantors: string | null;
  draftAmount1: number | null;
  draftLength1: number | null;
  draftAmount2: number | null;
  draftLength2: number | null;
  comment3: string | null;
  offerAddress: string | null;
  offerCity: string | null;
  offerState: string | null;
  offerZip: string | null;
  offerDate: string | null;
  offerTypes: string | null;
  letterType: string | null;
}
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
  OffersModels: OfferData[];
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
