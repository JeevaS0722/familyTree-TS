// src/utils/dataMigration.ts
import { PersonData } from '../types/familyTree';

/**
 * Migrates person data from old format to new format
 * Handles field name changes from 'first name' to 'firstName', etc.
 */
export function migratePersonData(data: PersonData[]): PersonData[] {
  return data.map(person => {
    // Create a new data object with the updated structure
    const newData: any = { ...person.data };

    // Convert 'first name' to 'firstName' if needed
    if ('first name' in newData && !newData.firstName) {
      newData.firstName = newData['first name'];
      delete newData['first name'];
    }

    // Convert 'last name' to 'lastName' if needed
    if ('last name' in newData && !newData.lastName) {
      newData.lastName = newData['last name'];
      delete newData['last name'];
    }

    // Convert 'birthday' to 'dOB' if needed
    if ('birthday' in newData && !newData.dOB) {
      newData.dOB = newData.birthday;
      delete newData.birthday;
    }

    // Remove avatar if it exists
    if ('avatar' in newData) {
      delete newData.avatar;
    }

    // Set default values for new fields if they don't exist
    if (!('deceased' in newData)) {
      newData.deceased = null;
    }
    if (!('decDt' in newData)) {
      newData.decDt = null;
    }
    if (!('age' in newData)) {
      newData.age = null;
    }
    if (!('city' in newData)) {
      newData.city = null;
    }
    if (!('state' in newData)) {
      newData.state = null;
    }
    if (!('address' in newData)) {
      newData.address = null;
    }
    if (!('fileId' in newData)) {
      newData.fileId = 0;
    }
    if (!('heir' in newData)) {
      newData.heir = null;
    }
    if (!('research_inheritance' in newData)) {
      newData.research_inheritance = null;
    }
    if (!('is_new_notes' in newData)) {
      newData.is_new_notes = null;
    }

    // Return updated person
    return {
      ...person,
      data: newData,
    };
  });
}
