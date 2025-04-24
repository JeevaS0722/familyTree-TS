// src/pages/file/FamilyTree/components/FamilyTreeBuilder/utils/relativePlaceholders.ts

import { PersonData } from '../types/familyTree';

/**
 * Generates a unique ID for placeholder nodes
 */
function generatePlaceholderId(): string {
  return `placeholder-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/**
 * Creates a placeholder node for a specific relationship
 */
export function createPlaceholderNode(
  relType: 'father' | 'mother' | 'spouse' | 'son' | 'daughter',
  referenceId: string
): PersonData {
  // Determine gender based on relationship type
  const gender = relType === 'father' || relType === 'son' ? 'M' : 'F';

  // Create placeholder with appropriate properties
  const placeholder: PersonData = {
    id: generatePlaceholderId(),
    data: {
      gender,
      first_name: '',
      last_name: '',
      name: '',
    },
    rels: {},
    to_add: true, // Flag as placeholder
    _new_rel_data: {
      rel_type: relType,
      label: `Add ${relType.charAt(0).toUpperCase() + relType.slice(1)}`,
    },
  };

  // Add relationship-specific properties
  if (relType === 'father' || relType === 'mother') {
    placeholder.rels.children = [referenceId];
  } else if (relType === 'spouse') {
    placeholder.rels.spouses = [referenceId];
  } else if (relType === 'son' || relType === 'daughter') {
    if (gender === 'M') {
      placeholder.rels.father = referenceId;
    } else {
      placeholder.rels.mother = referenceId;
    }
  }

  return placeholder;
}

/**
 * Generates full set of placeholder relatives for a person
 */
export function generateRelativePlaceholders(
  person: PersonData,
  fullData: PersonData[]
): PersonData[] {
  // Create a deep copy of the data
  const modifiedData = JSON.parse(JSON.stringify(fullData));
  const placeholders: PersonData[] = [];

  // Add father placeholder if needed
  if (!person.rels.father) {
    const fatherPlaceholder = createPlaceholderNode('father', person.id);
    placeholders.push(fatherPlaceholder);
  }

  // Add mother placeholder if needed
  if (!person.rels.mother) {
    const motherPlaceholder = createPlaceholderNode('mother', person.id);
    placeholders.push(motherPlaceholder);
  }

  // Add spouse placeholder
  const spousePlaceholder = createPlaceholderNode('spouse', person.id);
  placeholders.push(spousePlaceholder);

  // Add son placeholder for person
  const sonPlaceholder = createPlaceholderNode('son', person.id);
  placeholders.push(sonPlaceholder);

  // Add daughter placeholder for person
  const daughterPlaceholder = createPlaceholderNode('daughter', person.id);
  placeholders.push(daughterPlaceholder);

  // For each spouse, add son and daughter placeholders
  if (person.rels.spouses && person.rels.spouses.length > 0) {
    person.rels.spouses.forEach(spouseId => {
      const spouseSonPlaceholder = createPlaceholderNode('son', person.id);
      spouseSonPlaceholder._new_rel_data.other_parent_id = spouseId;
      placeholders.push(spouseSonPlaceholder);

      const spouseDaughterPlaceholder = createPlaceholderNode(
        'daughter',
        person.id
      );
      spouseDaughterPlaceholder._new_rel_data.other_parent_id = spouseId;
      placeholders.push(spouseDaughterPlaceholder);
    });
  }
  console.log('placeholders:', placeholders);
  // Add all placeholders to data
  return [...modifiedData, ...placeholders];
}

/**
 * Handle adding a new relative to the data
 */
export function handleNewRelative(
  mainPerson: PersonData,
  newPerson: PersonData,
  relType: string,
  data: PersonData[]
): PersonData[] {
  // Process based on relationship type
  if (relType === 'father') {
    mainPerson.rels.father = newPerson.id;
    if (!newPerson.rels.children) {
      newPerson.rels.children = [];
    }
    newPerson.rels.children.push(mainPerson.id);
  } else if (relType === 'mother') {
    mainPerson.rels.mother = newPerson.id;
    if (!newPerson.rels.children) {
      newPerson.rels.children = [];
    }
    newPerson.rels.children.push(mainPerson.id);
  } else if (relType === 'spouse') {
    if (!mainPerson.rels.spouses) {
      mainPerson.rels.spouses = [];
    }
    if (!newPerson.rels.spouses) {
      newPerson.rels.spouses = [];
    }
    mainPerson.rels.spouses.push(newPerson.id);
    newPerson.rels.spouses.push(mainPerson.id);
  } else if (relType === 'son' || relType === 'daughter') {
    if (!mainPerson.rels.children) {
      mainPerson.rels.children = [];
    }
    mainPerson.rels.children.push(newPerson.id);

    if (mainPerson.data.gender === 'M') {
      newPerson.rels.father = mainPerson.id;
    } else {
      newPerson.rels.mother = mainPerson.id;
    }

    // Handle other parent if specified
    if (newPerson._new_rel_data?.other_parent_id) {
      const otherParentId = newPerson._new_rel_data.other_parent_id;
      const otherParent = data.find(p => p.id === otherParentId);

      if (otherParent) {
        if (!otherParent.rels.children) {
          otherParent.rels.children = [];
        }
        otherParent.rels.children.push(newPerson.id);

        if (otherParent.data.gender === 'M') {
          newPerson.rels.father = otherParent.id;
        } else {
          newPerson.rels.mother = otherParent.id;
        }
      }
    }
  }

  // Add the new person to data
  data.push(newPerson);

  return data;
}
