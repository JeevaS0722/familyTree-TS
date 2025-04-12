// src/components/FamilyTree/contactToFamilyMapper.ts
import { FamilyMember } from './types';

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

/**
 * Maps a relationship string to the appropriate relationship type
 */
const mapRelationshipType = (relationship: string | null): string => {
  if (!relationship) {
    return 'Unknown';
  }

  switch (relationship.toLowerCase()) {
    case 'self':
      return 'Primary Root';
    case 'spouse':
    case 'partner':
    case 'husband':
    case 'wife':
      return 'Partner';
    case 'child':
    case 'son':
    case 'daughter':
      return 'Child';
    case 'parent':
    case 'father':
    case 'mother':
      return 'Parent';
    default:
      return relationship;
  }
};

/**
 * Determines gender based on relationship or defaults to male/female
 */
const determineGender = (contact: Contact): 'male' | 'female' | 'other' => {
  const relationship = contact.relationship?.toLowerCase() || '';

  if (
    relationship.includes('husband') ||
    relationship.includes('father') ||
    relationship.includes('son')
  ) {
    return 'male';
  }

  if (
    relationship.includes('wife') ||
    relationship.includes('mother') ||
    relationship.includes('daughter')
  ) {
    return 'female';
  }

  // Default based on ID being even/odd as a fallback (arbitrary)
  return contact.contactID % 2 === 0 ? 'male' : 'female';
};

/**
 * Converts a single contact to a FamilyMember
 */
const contactToFamilyMember = (contact: Contact): FamilyMember => {
  // Check if the contact has any tasks/notes
  const hasNotes =
    Array.isArray(contact.TasksModels) && contact.TasksModels.length > 0;

  return {
    id: `contact-${contact.contactID}`,
    name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
    gender: determineGender(contact),
    age: contact.dOB ? calculateAge(contact.dOB) : '00',
    birthDate: contact.dOB || '00/00/00',
    deathDate: contact.decDt || '00/00/00',
    address: [contact.address, contact.city, contact.state, contact.zip]
      .filter(Boolean)
      .join(', '),
    isDeceased: contact.deceased,
    divisionOfInterest: 'Interest',
    percentage: `${parseFloat(contact.ownership).toFixed(4)} %`,
    relationshipType: mapRelationshipType(contact.relationship),
    children: [], // Start with empty children
    partners: [], // Start with empty partners
    // Add contactId for reference
    contactId: contact.contactID,
    // Add isNewNotes property based on TasksModels
    isNewNotes: hasNotes,
    // Original data reference
    originalContact: contact,
  };
};

/**
 * Calculate age from birthdate string
 */
const calculateAge = (birthDateStr: string): string => {
  try {
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age.toString();
  } catch (e) {
    return '00';
  }
};

/**
 * Finds just the root node contact - returns only that single node without building relationships
 */
export const buildFamilyTreeFromContacts = (
  contacts: Contact[],
  fileId?: number | string,
  fileName?: string
): FamilyMember | null => {
  if (!contacts || contacts.length === 0) {
    return null;
  }

  // 1. First check for a contact with relationship containing "self"
  let rootContact = contacts.find(contact =>
    contact.relationship?.toLowerCase()?.includes('self')
  );

  // 2. Check for contacts that match the filename (first+last or last+first)
  if (!rootContact && fileName) {
    rootContact = contacts.find(contact => {
      const fileNameLower = fileName.toLowerCase().trim();

      // Create different name combinations to check
      const firstLastName =
        `${contact.firstName || ''} ${contact.lastName || ''}`
          .toLowerCase()
          .trim();
      const lastFirstName =
        `${contact.lastName || ''} ${contact.firstName || ''}`
          .toLowerCase()
          .trim();

      // Check if any name combination matches or is contained in the filename
      return (
        firstLastName.includes(fileNameLower) ||
        fileNameLower.includes(firstLastName) ||
        lastFirstName.includes(fileNameLower) ||
        fileNameLower.includes(lastFirstName)
      );
    });
  }

  // If no root found through the two checks, return null to trigger initial dialog
  if (!rootContact) {
    return null;
  }

  // Convert the single root contact to a FamilyMember
  const rootMember = contactToFamilyMember(rootContact);

  // Mark as Primary Root
  // rootMember.relationshipType = 'Primary Root';

  // Add fileId
  if (fileId) {
    rootMember.fileId = fileId;
  }

  // Return just this single node with empty children and partners arrays
  return rootMember;
};

/**
 * Main function to convert API response to family tree root node
 */
export const mapContactsToFamilyTree = (
  apiResponse: ContactApiResponse,
  fileId?: number | string,
  fileName?: string
): FamilyMember | null => {
  if (!apiResponse?.success || !apiResponse?.data?.contact) {
    return null;
  }

  return buildFamilyTreeFromContacts(
    apiResponse.data.contact,
    fileId,
    fileName
  );
};
