// src/CreateTree/addRelative.ts
import { handleNewRel, createNewPerson } from './newPerson';
import { Person, Store } from '../types';

/**
 * Create and return an AddRelative instance
 */
export default function AddRelativeFactory(
  ...args: ConstructorParameters<typeof AddRelative>
): AddRelative {
  return new AddRelative(...args);
}

/**
 * Class to handle adding relatives to a person
 */
class AddRelative {
  store: Store;
  cancelCallback: (datum: Person) => void;
  onSubmitCallback: (datum: Person, new_rel_datum: Person) => void;
  datum: Person | null = null;
  onChange: ((updated_datum: Person) => void) | null = null;
  onCancel: (() => void) | null = null;
  is_active: boolean = false;
  store_data: Person[] | null = null;
  addRelLabels: Record<string, string>;

  /**
   * Create an AddRelative instance
   *
   * @param store - The data store
   * @param cancelCallback - Called when adding a relative is cancelled
   * @param onSubmitCallback - Called when a relative is successfully added
   */
  constructor(
    store: Store,
    cancelCallback: (datum: Person) => void,
    onSubmitCallback: (datum: Person, new_rel_datum: Person) => void
  ) {
    this.store = store;
    this.cancelCallback = cancelCallback;
    this.onSubmitCallback = onSubmitCallback;
    this.addRelLabels = this.addRelLabelsDefault();

    return this;
  }

  /**
   * Activate the add relative mode for a person
   */
  activate(datum: Person): void {
    if (this.is_active && this.onCancel) {
      this.onCancel();
    }

    this.is_active = true;
    const store = this.store;

    this.store_data = store.getData();
    this.datum = datum;
    const datumCopy = JSON.parse(JSON.stringify(this.datum)) as Person;

    const datum_rels = getDatumRelsData(
      datumCopy,
      this.getStoreData(),
      this.addRelLabels
    );

    store.updateData(datum_rels);
    store.updateTree({});

    this.onChange = this.createOnChange();
    this.onCancel = this.createOnCancel();
  }

  /**
   * Create the onChange handler
   */
  private createOnChange(): (updated_datum: Person) => void {
    return (updated_datum: Person) => {
      if (!this.datum) {
        return;
      }

      if (updated_datum?._new_rel_data) {
        const new_rel_datum = updated_datum;
        handleNewRel({
          datum: this.datum,
          new_rel_datum,
          data_stash: this.getStoreData(),
        });
        this.onSubmitCallback(this.datum, new_rel_datum);
      } else if (updated_datum.id === this.datum.id) {
        // If user changed the data for main datum, keep it
        this.datum.data = updated_datum.data;
      } else {
        console.error('Something went wrong');
      }
    };
  }

  /**
   * Create the onCancel handler
   */
  private createOnCancel(): () => void {
    return () => {
      if (!this.is_active) {
        return;
      }
      this.is_active = false;

      if (this.store_data) {
        this.store.updateData(this.getStoreData());
      }

      if (this.datum) {
        this.cancelCallback(this.datum);
      }

      this.store_data = null;
      this.datum = null;
      this.onChange = null;
      this.onCancel = null;
    };
  }

  /**
   * Set custom labels for add relative buttons
   */
  setAddRelLabels(add_rel_labels: Record<string, string>): AddRelative {
    if (typeof add_rel_labels !== 'object') {
      console.error('add_rel_labels must be an object');
      return this;
    }

    for (const key in add_rel_labels) {
      this.addRelLabels[key] = add_rel_labels[key];
    }

    return this;
  }

  /**
   * Get default labels for add relative buttons
   */
  addRelLabelsDefault(): Record<string, string> {
    return {
      father: 'Add Father',
      mother: 'Add Mother',
      spouse: 'Add Spouse',
      son: 'Add Son',
      daughter: 'Add Daughter',
    };
  }

  /**
   * Get the current store data
   */
  getStoreData(): Person[] {
    return this.store_data || [];
  }
}

/**
 * Get all relationship data for a person
 */
function getDatumRelsData(
  datum: Person,
  store_data: Person[],
  addRelLabels: Record<string, string>
): Person[] {
  const datum_rels = getDatumRels(datum, store_data);

  // Add father if missing
  if (!datum.rels.father) {
    const father = createNewPerson({
      data: { gender: 'M' },
      rels: { children: [datum.id] },
    });

    father._new_rel_data = {
      rel_type: 'father',
      label: addRelLabels.father,
    };

    datum.rels.father = father.id;
    datum_rels.push(father);
  }

  // Add mother if missing
  if (!datum.rels.mother) {
    const mother = createNewPerson({
      data: { gender: 'F' },
      rels: { children: [datum.id] },
    });

    mother._new_rel_data = {
      rel_type: 'mother',
      label: addRelLabels.mother,
    };

    datum.rels.mother = mother.id;
    datum_rels.push(mother);
  }

  const mother = datum_rels.find(d => d.id === datum.rels.mother);
  const father = datum_rels.find(d => d.id === datum.rels.father);

  if (mother && father) {
    mother.rels.spouses = [father.id];
    father.rels.spouses = [mother.id];

    mother.rels.children = [datum.id];
    father.rels.children = [datum.id];
  }

  if (!datum.rels.spouses) {
    datum.rels.spouses = [];
  }

  // Handle children without both parents
  if (datum.rels.children) {
    let new_spouse: Person | undefined;

    datum.rels.children.forEach(child_id => {
      const child = datum_rels.find(d => d.id === child_id);

      if (child) {
        if (!child.rels.mother) {
          if (!new_spouse) {
            new_spouse = createNewPerson({
              data: { gender: 'F' },
              rels: {
                spouses: [datum.id],
                children: [],
              },
            });
            new_spouse._new_rel_data = {
              rel_type: 'spouse',
              label: addRelLabels.spouse,
            };
          }
          new_spouse.rels.children.push(child.id);
          datum.rels.spouses.push(new_spouse.id);
          child.rels.mother = new_spouse.id;
          datum_rels.push(new_spouse);
        }

        if (!child.rels.father) {
          if (!new_spouse) {
            new_spouse = createNewPerson({
              data: { gender: 'M' },
              rels: {
                spouses: [datum.id],
                children: [],
              },
            });
            new_spouse._new_rel_data = {
              rel_type: 'spouse',
              label: addRelLabels.spouse,
            };
          }
          new_spouse.rels.children.push(child.id);
          datum.rels.spouses.push(new_spouse.id);
          child.rels.father = new_spouse.id;
          datum_rels.push(new_spouse);
        }
      }
    });
  }

  // Add a new spouse
  const new_spouse = createNewPerson({
    data: { gender: 'F' },
    rels: { spouses: [datum.id] },
  });

  new_spouse._new_rel_data = {
    rel_type: 'spouse',
    label: addRelLabels.spouse,
  };

  datum.rels.spouses.push(new_spouse.id);
  datum_rels.push(new_spouse);

  // Ensure children array exists
  if (!datum.rels.children) {
    datum.rels.children = [];
  }

  // Add son and daughter for each spouse
  datum.rels.spouses.forEach(spouse_id => {
    const spouse = datum_rels.find(d => d.id === spouse_id);

    if (spouse) {
      if (!spouse.rels.children) {
        spouse.rels.children = [];
      }

      // Filter out children that aren't shared with the current datum
      spouse.rels.children = spouse.rels.children.filter(child_id =>
        datum.rels.children.includes(child_id)
      );

      // Add a new son
      const new_son = createNewPerson({
        data: { gender: 'M' },
        rels: {
          father: datum.data.gender === 'M' ? datum.id : spouse.id,
          mother: datum.data.gender === 'F' ? datum.id : spouse.id,
        },
      });

      new_son._new_rel_data = {
        rel_type: 'son',
        label: addRelLabels.son,
        other_parent_id: spouse.id,
      };

      spouse.rels.children.push(new_son.id);
      datum.rels.children.push(new_son.id);
      datum_rels.push(new_son);

      // Add a new daughter
      const new_daughter = createNewPerson({
        data: { gender: 'F' },
        rels: {
          mother: datum.data.gender === 'F' ? datum.id : spouse.id,
          father: datum.data.gender === 'M' ? datum.id : spouse.id,
        },
      });

      new_daughter._new_rel_data = {
        rel_type: 'daughter',
        label: addRelLabels.daughter,
        other_parent_id: spouse.id,
      };

      spouse.rels.children.push(new_daughter.id);
      datum.rels.children.push(new_daughter.id);
      datum_rels.push(new_daughter);
    }
  });

  return datum_rels;
}

/**
 * Find a relationship by ID
 */
function findRel(store_data: Person[], id: string): Person {
  const person = store_data.find(d => d.id === id);
  if (!person) {
    throw new Error(`Relationship with ID ${id} not found`);
  }
  return JSON.parse(JSON.stringify(person));
}

/**
 * Get all direct relationships for a person
 */
function getDatumRels(datum: Person, data: Person[]): Person[] {
  const datum_rels: Person[] = [datum];

  // Process each relationship type
  Object.entries(datum.rels).forEach(([rel_type, rel]) => {
    if (Array.isArray(rel)) {
      rel.forEach(rel_id => {
        findAndPushRel(rel_type, rel_id);
      });
    } else if (rel) {
      findAndPushRel(rel_type, rel);
    }
  });

  return datum_rels;

  /**
   * Find a relative and add to the datum_rels array
   */
  function findAndPushRel(rel_type: string, rel_id: string): void {
    const rel_datum = findRel(data, rel_id);

    // For parent relations, remove their parents to avoid infinite ancestry
    if (rel_type === 'father' || rel_type === 'mother') {
      delete rel_datum.rels.father;
      delete rel_datum.rels.mother;
    }

    // For children, clear their children and spouses to avoid infinite descendants
    if (rel_type === 'children') {
      rel_datum.rels.children = [];
      rel_datum.rels.spouses = [];
    }

    datum_rels.push(rel_datum);
  }
}
