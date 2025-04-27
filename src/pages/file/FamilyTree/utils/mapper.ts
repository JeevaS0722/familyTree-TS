import { TreeData } from '../../../../interface/familyTree';
import {
  convertLargeNumberToCurrency,
  convertToMMDDYYYY,
} from '../../../../utils/GeneralUtil';
import { PersonData } from '../components/FamilyTreeBuilder';
import {
  AltData,
  Contact,
  ContactApiResponse,
  OfferData,
  TitleData,
} from '../types';
import moment from 'moment';

export const determineGender = (contact: Contact): 'M' | 'F' | '' => {
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

  return '';
};

export const calculateAge = (birthDateStr: string): string => {
  try {
    const dob = convertToMMDDYYYY(birthDateStr);
    let validDob = dob;
    if (dob && dob.match(/^\d{2}\/00\/\d{4}$/)) {
      validDob = dob.replace('/00/', '/01/');
    } else if (dob && dob.match(/^\d{4}$/)) {
      validDob = `01/01/${dob}`;
    }
    if (!validDob || moment(validDob).isValid() === false) {
      return '00';
    }
    const birthDate = moment(validDob, 'MM/DD/YYYY');
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
    amount: offer.draftAmount2
      ? convertLargeNumberToCurrency(offer.draftAmount2.toString(), {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : null,
    offer_type: offer.OfferType?.OfferTypes?.toLocaleString() || null,
    grantors: offer.grantors || null,
  };
};

export const formatAltNames = (altNames: AltData[]): string[] => {
  if (!altNames || altNames.length === 0) {
    return [];
  }
  return altNames.map(
    (altName: { altName: string; altNameFormat: string }) =>
      `(${altName.altNameFormat}) ${altName.altName}`
  );
};

export const formatTitles = (titles: TitleData[]): string[] => {
  if (!titles || titles.length === 0) {
    return [];
  }
  const data = titles.map((title: TitleData) => {
    if (!title.title || !title.preposition || !title.entityName) {
      return '';
    }
    return title.individuallyAndAs
      ? `individually and as ${title.title} ${title.preposition} ${title.entityName}`
      : `${title.title} ${title.preposition} ${title.entityName}`;
  });
  return data.filter(title => title !== '');
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
    dOB: convertToMMDDYYYY(rootContact.dOB),
    decDt: convertToMMDDYYYY(rootContact.decDt),
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
    ownership: rootContact?.ownership || '0',
    division_of_interest: 'Interest',
    offer: formatOffer(rootContact?.OffersModels || []),
    altNames: formatAltNames(rootContact?.AlternativeNamesModels || []),
    titles: formatTitles(rootContact?.TitlesModels || []),
  },
  rels: {},
  main: isMain || false,
});

export const mapContactsToFamilyTree = (
  response: ContactApiResponse,
  decodedFileName: string,
  fileId?: string | number
): PersonData | null => {
  if (!response.data?.contact) {
    return null;
  }
  const contacts: Contact[] = response.data.contact;
  let rootContact: Contact | undefined = contacts.find((contact: Contact) =>
    contact.relationship?.toLowerCase()?.includes('self')
  );
  if (!rootContact && decodedFileName) {
    rootContact = contacts.find(contact => {
      const fileNameLower = decodedFileName.toLowerCase().trim();

      const firstLastName =
        `${contact.firstName || ''} ${contact.lastName || ''}`
          .toLowerCase()
          .trim();
      const lastFirstName =
        `${contact.lastName || ''} ${contact.firstName || ''}`
          .toLowerCase()
          .trim();

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
  const rootFamilyMember: PersonData = contactsToFamilyTreemapper(
    rootContact,
    fileId,
    true
  );

  return rootFamilyMember;
};

export const mapFamilyTreeAndContactToTree = (
  familyTree: TreeData[],
  contacts: Contact[],
  fileId?: string | number
): PersonData[] => {
  const familyTreeMap = new Map<string, TreeData>(
    familyTree.map(member => [member.id, member])
  );

  const mappedContacts = contacts
    .map(contact => {
      const contactId = contact.contactID.toString();
      const familyMember = familyTreeMap.get(contactId);
      if (familyMember) {
        return {
          id: contactId,
          rels: familyMember?.rels || {},
          main: familyMember.main,
          data: {
            fileId: Number(fileId),
            contactId: contact.contactID,
            gender: determineGender(contact),
            first_ame: contact.firstName || '',
            last_name: contact.lastName || '',
            name: [contact.firstName, contact.lastName]
              .filter(Boolean)
              .join(' '),
            relationship: contact.relationship || null,
            dOB: convertToMMDDYYYY(contact.dOB),
            decDt: convertToMMDDYYYY(contact.decDt),
            deceased: contact.deceased || null,
            age: calculateAge(contact.dOB || ''),

            city: contact.city || null,
            state: contact.state || null,
            address: contact.address || null,
            full_address: [
              contact.address,
              contact.city,
              contact.state,
              contact.zip,
            ]
              .filter(Boolean)
              .join(', '),
            heir: null,
            research_inheritance: null,
            has_new_notes:
              Array.isArray(contact.TasksModels) &&
              contact.TasksModels.length > 0,
            ownership: contact.ownership || '0',
            division_of_interest: 'Interest',
            offer: formatOffer(contact?.OffersModels || []),
          },
        };
      }
      return null; // Return null when no matching family member is found
    })
    .filter(Boolean) as PersonData[]; // Filter out null values

  return mappedContacts;
};
