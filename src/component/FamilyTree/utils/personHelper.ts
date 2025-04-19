// src/utils/personHelper.ts
import { PersonData } from '../types/familyTree';

export function createNewPerson({
  data = {},
  rels = {},
}: {
  data?: Partial<PersonData['data']>;
  rels?: Partial<PersonData['rels']>;
}): PersonData {
  return {
    id: generateUUID(),
    data: {
      gender: '',
      'first name': '',
      'last name': '',
      ...data,
    },
    rels: {
      ...rels,
    },
  };
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
