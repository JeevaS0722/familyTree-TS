// src/CreateTree/form.ts
import { checkIfRelativesConnectedWithoutPerson } from './checkIfRelativesConnectedWithoutPerson';
import { createTreeDataWithMainNode } from './newPerson';
import { Person, Store } from '../types';

export interface FormField {
  id: string;
  type: string;
  label: string;
  initial_value?: string;
}

export interface GenderField {
  id: string;
  type: string;
  label: string;
  initial_value?: string;
  options: { value: string; label: string }[];
}

export interface FormCreator {
  fields: FormField[];
  onSubmit: (e: SubmitEvent) => void;
  onDelete?: () => void;
  addRelative?: () => void;
  addRelativeCancel?: () => void;
  addRelativeActive?: boolean;
  editable?: boolean;
  title?: string;
  new_rel?: boolean;
  can_delete?: boolean;
  gender_field: GenderField;
  onCancel?: () => void;
  no_edit?: boolean;
}

interface CreateFormParams {
  datum: Person;
  store: Store;
  fields: { type: string; label: string; id: string }[];
  postSubmit: (props?: { delete?: boolean }) => void;
  addRelative?: any;
  deletePerson?: () => void;
  onCancel?: () => void;
  editFirst?: boolean;
}

export function createForm({
  datum,
  store,
  fields,
  postSubmit,
  addRelative,
  deletePerson,
  onCancel,
  editFirst,
}: CreateFormParams): FormCreator {
  const form_creator: FormCreator = {
    fields: [],
    onSubmit: submitFormChanges,
    gender_field: {
      id: 'gender',
      type: 'switch',
      label: 'Gender',
      initial_value: datum.data.gender,
      options: [
        { value: 'M', label: 'Male' },
        { value: 'F', label: 'Female' },
      ],
    },
  };

  if (!datum._new_rel_data) {
    form_creator.onDelete = deletePersonWithPostSubmit;
    form_creator.addRelative = () => addRelative?.activate(datum);
    form_creator.addRelativeCancel = () => addRelative?.onCancel();
    form_creator.addRelativeActive = addRelative?.is_active;
    form_creator.editable = false;
  }

  if (datum._new_rel_data) {
    form_creator.title = datum._new_rel_data.label;
    form_creator.new_rel = true;
    form_creator.editable = true;
    form_creator.onCancel = onCancel;
  }

  if (form_creator.onDelete) {
    form_creator.can_delete = checkIfRelativesConnectedWithoutPerson(
      datum,
      store.getData()
    );
  }

  if (editFirst) {
    form_creator.editable = true;
  }

  fields.forEach(d => {
    const field: FormField = {
      id: d.id,
      type: d.type,
      label: d.label,
      initial_value: datum.data[d.id],
    };
    form_creator.fields.push(field);
  });

  return form_creator;

  function submitFormChanges(e: SubmitEvent): void {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const form_data = new FormData(form);

    form_data.forEach((v, k) => {
      datum.data[k] = v.toString();
    });

    if (datum.to_add) {
      delete datum.to_add;
    }

    postSubmit();
  }

  function deletePersonWithPostSubmit(): void {
    if (deletePerson) {
      deletePerson();
    }
    postSubmit({ delete: true });
  }
}

export function moveToAddToAdded(datum: Person, data_stash: Person[]): Person {
  delete datum.to_add;
  return datum;
}

export function removeToAdd(datum: Person, data_stash: Person[]): boolean {
  deletePerson(datum, data_stash);
  return false;
}

export function deletePerson(
  datum: Person,
  data_stash: Person[]
): { success: boolean; error?: string } {
  if (!checkIfRelativesConnectedWithoutPerson(datum, data_stash)) {
    return { success: false, error: 'checkIfRelativesConnectedWithoutPerson' };
  }

  executeDelete();
  return { success: true };

  function executeDelete(): void {
    data_stash.forEach(d => {
      for (const k in d.rels) {
        if (!d.rels.hasOwnProperty(k)) {
          continue;
        }

        if (d.rels[k] === datum.id) {
          delete d.rels[k];
        } else if (Array.isArray(d.rels[k]) && d.rels[k].includes(datum.id)) {
          const index = d.rels[k].findIndex(did => did === datum.id);
          if (index !== -1) {
            d.rels[k].splice(index, 1);
          }
        }
      }
    });

    const index = data_stash.findIndex(d => d.id === datum.id);
    if (index !== -1) {
      data_stash.splice(index, 1);
    }

    // Remove any to_add items
    for (let i = data_stash.length - 1; i >= 0; i--) {
      if (data_stash[i].to_add) {
        deletePerson(data_stash[i], data_stash);
      }
    }

    // If all data was removed, create a new empty tree
    if (data_stash.length === 0) {
      data_stash.push(createTreeDataWithMainNode({ data: {} }).data[0]);
    }
  }
}

export function cleanupDataJson(data_json: string): string {
  const data_no_to_add = JSON.parse(data_json) as Person[];

  data_no_to_add.forEach(d => {
    if (d.to_add) {
      removeToAdd(d, data_no_to_add);
    }
  });

  data_no_to_add.forEach(d => delete d.main);
  data_no_to_add.forEach(d => delete d.hide_rels);

  return JSON.stringify(data_no_to_add, null, 2);
}

export function removeToAddFromData(data: Person[]): Person[] {
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].to_add) {
      removeToAdd(data[i], data);
    }
  }

  return data;
}
