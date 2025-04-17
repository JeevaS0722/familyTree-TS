// src/CreateTree/newPerson.ts
import { removeToAdd } from './form';
import { Person } from '../types';

interface NewPersonData {
  data?: Record<string, any>;
  rels?: Record<string, any>;
}

interface HandleRelsParams {
  datum: Person;
  data_stash: Person[];
  rel_type: string;
  rel_datum: Person;
}

interface HandleNewRelParams {
  datum: Person;
  new_rel_datum: Person;
  data_stash: Person[];
}

interface AddNewPersonParams {
  data_stash: Person[];
  datum: Person;
}

interface CreateNewPersonWithGenderParams {
  data?: Record<string, any>;
  rel_type: string;
  rel_datum: Person;
}

interface CreateTreeDataParams {
  data: Record<string, any>;
  version?: string;
}

interface AddNewPersonAndHandleRelsParams {
  datum: Person;
  data_stash: Person[];
  rel_type: string;
  rel_datum: Person;
}

/**
 * Handles the relationships of a new person
 */
export function handleRelsOfNewDatum({
  datum,
  data_stash,
  rel_type,
  rel_datum,
}: HandleRelsParams): Person {
  if (rel_type === 'daughter' || rel_type === 'son') {
    addChild(datum);
  } else if (rel_type === 'father' || rel_type === 'mother') {
    addParent(datum);
  } else if (rel_type === 'spouse') {
    addSpouse(datum);
  }

  return datum;

  function addChild(datum: Person): Person {
    if (datum.data.other_parent) {
      addChildToSpouseAndParentToChild(datum.data.other_parent);
      delete datum.data.other_parent;
    }

    datum.rels[rel_datum.data.gender === 'M' ? 'father' : 'mother'] =
      rel_datum.id;

    if (!rel_datum.rels.children) {
      rel_datum.rels.children = [];
    }

    rel_datum.rels.children.push(datum.id);
    return datum;

    function addChildToSpouseAndParentToChild(spouse_id: string): void {
      if (spouse_id === '_new') {
        spouse_id = addOtherParent().id;
      }

      const spouse = data_stash.find(d => d.id === spouse_id);

      if (spouse) {
        datum.rels[spouse.data.gender === 'M' ? 'father' : 'mother'] =
          spouse.id;

        if (!spouse.rels.hasOwnProperty('children')) {
          spouse.rels.children = [];
        }

        spouse.rels.children.push(datum.id);
      }

      function addOtherParent(): Person {
        const new_spouse = createNewPersonWithGenderFromRel({
          rel_type: 'spouse',
          rel_datum,
        });

        addSpouse(new_spouse);
        addNewPerson({ data_stash, datum: new_spouse });
        return new_spouse;
      }
    }
  }

  function addParent(datum: Person): Person {
    const is_father = datum.data.gender === 'M';
    const parent_to_add_id = rel_datum.rels[is_father ? 'father' : 'mother'];

    if (parent_to_add_id) {
      const parentToAdd = data_stash.find(d => d.id === parent_to_add_id);
      if (parentToAdd) {
        removeToAdd(parentToAdd, data_stash);
      }
    }

    addNewParent();

    function addNewParent(): Person {
      rel_datum.rels[is_father ? 'father' : 'mother'] = datum.id;
      handleSpouse();
      datum.rels.children = [rel_datum.id];
      return datum;

      function handleSpouse(): Person | undefined {
        const spouse_id = rel_datum.rels[!is_father ? 'father' : 'mother'];
        if (!spouse_id) {
          return;
        }

        const spouse = data_stash.find(d => d.id === spouse_id);
        if (spouse) {
          datum.rels.spouses = [spouse_id];

          if (!spouse.rels.spouses) {
            spouse.rels.spouses = [];
          }

          spouse.rels.spouses.push(datum.id);
          return spouse;
        }
      }
    }

    return datum;
  }

  function addSpouse(datum: Person): void {
    removeIfToAdd();

    if (!rel_datum.rels.spouses) {
      rel_datum.rels.spouses = [];
    }

    rel_datum.rels.spouses.push(datum.id);
    datum.rels.spouses = [rel_datum.id];

    function removeIfToAdd(): void {
      if (!rel_datum.rels.spouses) {
        return;
      }

      rel_datum.rels.spouses.forEach(spouse_id => {
        const spouse = data_stash.find(d => d.id === spouse_id);
        if (spouse?.to_add) {
          removeToAdd(spouse, data_stash);
        }
      });
    }
  }
}

/**
 * Handles the creation of a new relationship
 */
export function handleNewRel({
  datum,
  new_rel_datum,
  data_stash,
}: HandleNewRelParams): void {
  const rel_type = new_rel_datum._new_rel_data?.rel_type;

  if (!rel_type) {
    return;
  }

  delete new_rel_datum._new_rel_data;
  // Make a deep copy to keep same datum state in current add relative tree
  new_rel_datum = JSON.parse(JSON.stringify(new_rel_datum));

  if (rel_type === 'son' || rel_type === 'daughter') {
    const mother = data_stash.find(d => d.id === new_rel_datum.rels.mother);
    const father = data_stash.find(d => d.id === new_rel_datum.rels.father);

    new_rel_datum.rels = {};

    if (father) {
      if (!father.rels.children) {
        father.rels.children = [];
      }

      father.rels.children.push(new_rel_datum.id);
      new_rel_datum.rels.father = father.id;
    }

    if (mother) {
      if (!mother.rels.children) {
        mother.rels.children = [];
      }

      mother.rels.children.push(new_rel_datum.id);
      new_rel_datum.rels.mother = mother.id;
    }
  } else if (rel_type === 'spouse') {
    if (!datum.rels.spouses) {
      datum.rels.spouses = [];
    }

    if (!datum.rels.spouses.includes(new_rel_datum.id)) {
      datum.rels.spouses.push(new_rel_datum.id);
    }

    // If rel is added in same add relative tree, clean up duplicate parent
    new_rel_datum.rels.children = (new_rel_datum.rels.children || []).filter(
      child_id => {
        const child = data_stash.find(d => d.id === child_id);

        if (!child) {
          return false;
        }

        if (child.rels.mother !== datum.id) {
          const motherIndex = data_stash.findIndex(
            d => d.id === child.rels.mother
          );
          if (motherIndex !== -1) {
            data_stash.splice(motherIndex, 1);
          }
          child.rels.mother = new_rel_datum.id;
        }

        if (child.rels.father !== datum.id) {
          const fatherIndex = data_stash.findIndex(
            d => d.id === child.rels.father
          );
          if (fatherIndex !== -1) {
            data_stash.splice(fatherIndex, 1);
          }
          child.rels.father = new_rel_datum.id;
        }

        return true;
      }
    );

    new_rel_datum.rels = {
      spouses: [datum.id],
      children: new_rel_datum.rels.children || [],
    };
  } else if (rel_type === 'father') {
    datum.rels.father = new_rel_datum.id;
    new_rel_datum.rels = {
      children: [datum.id],
    };

    if (datum.rels.mother) {
      new_rel_datum.rels.spouses = [datum.rels.mother];
      const mother = data_stash.find(d => d.id === datum.rels.mother);

      if (mother) {
        if (!mother.rels.spouses) {
          mother.rels.spouses = [];
        }

        mother.rels.spouses.push(new_rel_datum.id);
      }
    }
  } else if (rel_type === 'mother') {
    datum.rels.mother = new_rel_datum.id;
    new_rel_datum.rels = {
      children: [datum.id],
    };

    if (datum.rels.father) {
      new_rel_datum.rels.spouses = [datum.rels.father];
      const father = data_stash.find(d => d.id === datum.rels.father);

      if (father) {
        if (!father.rels.spouses) {
          father.rels.spouses = [];
        }

        father.rels.spouses.push(new_rel_datum.id);
      }
    }
  }

  data_stash.push(new_rel_datum);
}

/**
 * Creates a new person with minimal data
 */
export function createNewPerson({ data, rels }: NewPersonData = {}): Person {
  return {
    id: generateUUID(),
    data: data || {},
    rels: rels || {},
  };
}

/**
 * Creates a new person with gender based on relationship type
 */
export function createNewPersonWithGenderFromRel({
  data,
  rel_type,
  rel_datum,
}: CreateNewPersonWithGenderParams): Person {
  const gender = getGenderFromRelative(rel_datum, rel_type);
  const personData = Object.assign(data || {}, { gender });
  return createNewPerson({ data: personData });

  function getGenderFromRelative(rel_datum: Person, rel_type: string): string {
    return ['daughter', 'mother'].includes(rel_type) ||
      (rel_type === 'spouse' && rel_datum.data.gender === 'M')
      ? 'F'
      : 'M';
  }
}

/**
 * Adds a new person to the data store
 */
export function addNewPerson({ data_stash, datum }: AddNewPersonParams): void {
  data_stash.push(datum);
}

/**
 * Creates a tree with a single main node
 */
export function createTreeDataWithMainNode({
  data,
  version,
}: CreateTreeDataParams): { data: Person[]; version?: string } {
  return {
    data: [createNewPerson({ data })],
    version,
  };
}

/**
 * Adds a new person and handles their relationships
 */
export function addNewPersonAndHandleRels({
  datum,
  data_stash,
  rel_type,
  rel_datum,
}: AddNewPersonAndHandleRelsParams): void {
  addNewPerson({ data_stash, datum });
  handleRelsOfNewDatum({ datum, data_stash, rel_type, rel_datum });
}

/**
 * Generates a UUID for new person IDs
 */
function generateUUID(): string {
  const d = new Date().getTime();
  const d2 =
    (typeof performance !== 'undefined' &&
      performance.now &&
      performance.now() * 1000) ||
    0;

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16;

    if (d > 0) {
      // Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      // Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }

    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
