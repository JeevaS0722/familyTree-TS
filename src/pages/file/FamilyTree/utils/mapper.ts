import { formatDateToMonthDayYear } from '../../../../utils/GeneralUtil';
import { PersonData } from '../components/FamilyTreeBuilder';
import { Contact, ContactApiResponse, OfferData } from '../types';
import moment from 'moment';

export const determineGender = (contact: Contact): 'M' | 'F' => {
  const relationship = contact.relationship?.toLowerCase() || '';
  const gender = contact?.gender?.toLowerCase() || '';
  if (gender === 'male' || gender === 'm') {
    return 'M';
  }

  if (gender === 'female' || gender === 'f') {
    return 'F';
  }

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
  return 'M';
};

export const calculateAge = (birthDateStr: string): string => {
  try {
    if (
      !birthDateStr ||
      birthDateStr === '0000-00-00' ||
      moment(birthDateStr).isValid() === false
    ) {
      return '00';
    }
    const birthDate = moment(birthDateStr, 'YYYY-MM-DD');
    const today = moment();
    const age = today.diff(birthDate, 'years');
    return age < 0 ? '00' : age.toString();
  } catch (e) {
    return '00';
  }
};

export const formatOffer = (
  offers: OfferData[]
): {
  offerId?: string | null;
  amount?: string | null;
  offer_type?: string | null;
  grantors?: string | null;
} => {
  if (!offers || offers.length === 0) {
    return {
      offerId: null,
      amount: null,
      offer_type: null,
      grantors: null,
    };
  }

  const offer = offers[0];
  return {
    offerId: offer.offerID.toString() || null,
    amount: offer.amount?.toLocaleString() || null,
    offer_type: offer.offerType?.toLocaleString() || null,
    grantors: offer.grantors || null,
  };
};

export const contactsToFamilyTreemapper = (
  rootContact: Contact,
  fileId?: string | number,
  isMain?: boolean
): PersonData => ({
  id: rootContact.contactID.toString(),
  data: {
    fileId: Number(fileId),
    contactId: rootContact.contactID,
    gender: determineGender(rootContact),
    first_ame: rootContact.firstName || '',
    last_name: rootContact.lastName || '',
    name: [rootContact.firstName, rootContact.lastName]
      .filter(Boolean)
      .join(' '),
    relationship: rootContact.relationship || null,
    dOB: formatDateToMonthDayYear(rootContact.dOB),
    decDt: formatDateToMonthDayYear(rootContact.decDt),
    deceased: rootContact.deceased || null,
    age: calculateAge(rootContact.dOB || ''),
    city: rootContact.city || null,
    state: rootContact.state || null,
    address: rootContact.address || null,
    full_address: [
      rootContact.address,
      rootContact.city,
      rootContact.state,
      rootContact.zip,
    ]
      .filter(Boolean)
      .join(', '),
    heir: null,
    research_inheritance: null,
    has_new_notes:
      Array.isArray(rootContact.TasksModels) &&
      rootContact.TasksModels.length > 0,
    ownership: `${parseFloat(rootContact.ownership).toFixed(4)} %`,
    division_of_interest: 'Interest',
    offer: formatOffer(rootContact?.OffersModels || []),
  },
  rels: {},
  main: isMain || false,
});

export const mapContactsToFamilyTree = (
  response: ContactApiResponse,
  decodedFileName: string,
  fileId?: string | number
): PersonData | null => {
  // Check if the response contains contacts
  if (!response.data?.contact) {
    console.error('No contacts found in the response.');
    return null;
  }
  // 1. First check for a contact with relationship containing "self"
  const contacts: Contact[] = response.data.contact;
  let rootContact: Contact | undefined = contacts.find((contact: Contact) =>
    contact.relationship?.toLowerCase()?.includes('self')
  );
  if (!rootContact && decodedFileName) {
    rootContact = contacts.find(contact => {
      const fileNameLower = decodedFileName.toLowerCase().trim();

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
  if (!rootContact) {
    return null;
  }
  // Convert the single root contact to a FamilyMember
  const rootFamilyMember: PersonData = contactsToFamilyTreemapper(
    rootContact,
    fileId,
    true
  );

  return rootFamilyMember;
};

export const mapRelationshipType = (
  type: string | null
): 'partner' | 'child' | null => {
  if (!type) {
    return null;
  }

  switch (type) {
    case 'father':
    case 'mother':
      return 'partner'; // Parents are added as partners of the opposite parent
    case 'spouse':
      return 'partner';
    case 'son':
    case 'daughter':
      return 'child';
    default:
      return null;
  }
};
