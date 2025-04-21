// src/component/FamilyTree/utils/contactMapper.ts
import { PersonData } from '../types/familyTree';
import { Contact, ContactApiResponse } from '../types/familyTreeExtended';

/**
 * Maps a relationship string to the appropriate relationship type
 */
export const mapRelationshipType = (relationship: string | null): string => {
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
export const determineGender = (contact: Contact): 'M' | 'F' | '' => {
  const relationship = contact.relationship?.toLowerCase() || '';

  if (
    relationship.includes('husband') ||
    relationship.includes('father') ||
    relationship.includes('son')
  ) {
    return 'M';
  }

  if (
    relationship.includes('wife') ||
    relationship.includes('mother') ||
    relationship.includes('daughter')
  ) {
    return 'F';
  }

  // Default based on ID being even/odd as a fallback (arbitrary)
  return contact.contactID % 2 === 0 ? 'M' : 'F';
};

/**
 * Calculate age from birthdate string
 */
export const calculateAge = (birthDateStr: string): string => {
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
 * Converts a single contact to a PersonData object
 */
export const contactToPersonData = (contact: Contact): PersonData => {
  // Check if the contact has any tasks/notes
  const hasNotes =
    Array.isArray(contact.TasksModels) && contact.TasksModels.length > 0;

  return {
    id: `contact-${contact.contactID}`,
    data: {
      gender: determineGender(contact),
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      dOB: contact.dOB || '',
      decDt: contact.decDt || null,
      deceased: contact.deceased || null,
      // Additional fields
      age: contact.dOB ? calculateAge(contact.dOB) : null,
      address: contact.address || null,
      city: contact.city || null,
      state: contact.state || null,
      // Enhanced fields
      contactId: contact.contactID,
      fileId: 0, // Will be set by container component
      relationshipType: mapRelationshipType(contact.relationship),
      divisionOfInterest: 'Interest',
      percentage: `${parseFloat(contact.ownership).toFixed(4)} %`,
      isNewNotes: hasNotes,
      offerAmount: contact.OffersModels?.[0]?.draftAmount2 || '$0.00',
    },
    rels: {
      father: undefined,
      mother: undefined,
      spouses: [],
      children: [],
    },
    originalContact: contact,
  };
};

/**
 * Find root node from contacts based on two checks:
 * 1. Contact has "self" relationship
 * 2. Contact name matches filename
 */
export const findRootContact = (
  contacts: Contact[],
  fileName?: string
): Contact | null => {
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

  return rootContact;
};

/**
 * Main function to map contacts API response to a root PersonData node
 */
export const mapContactsToFamilyTree = (
  apiResponse: ContactApiResponse,
  fileId?: number | string,
  fileName?: string
): PersonData | null => {
  if (!apiResponse?.success || !apiResponse?.data?.contact) {
    return null;
  }

  const rootContact = findRootContact(apiResponse.data.contact, fileName);

  // If no root found through the two checks, return null to trigger initial dialog
  if (!rootContact) {
    return null;
  }

  // Convert the single root contact to a PersonData
  const rootPerson = contactToPersonData(rootContact);

  // Mark as Primary Root
  rootPerson.data.relationshipType = 'Primary Root';

  // Add fileId
  if (fileId) {
    rootPerson.data.fileId = Number(fileId);
  }

  // Set as main
  rootPerson.main = true;

  // Return just this single node with empty children and partners arrays
  return rootPerson;
};
