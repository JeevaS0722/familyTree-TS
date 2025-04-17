import { checkIfRelativesConnectedWithoutPerson } from './checkIfRelativesConnectedWithoutPerson';
import { createTreeDataWithMainNode } from './newPerson';
import {
  Datum,
  DeleteResult,
  FormCreationOptions,
  FormCreator,
  FormField,
  Store,
} from '../types';

export function createForm({
  datum,
  store,
  fields,
  postSubmit,
  addRelative,
  deletePerson,
  onCancel,
  editFirst,
}: FormCreationOptions): FormCreator {
  const form_creator: FormCreator = {
    fields: [],
    onSubmit: submitFormChanges,
    editable: false,
  };

  if (!datum._new_rel_data) {
    form_creator.onDelete = deletePersonWithPostSubmit;
    form_creator.addRelative = () => addRelative.activate(datum);
    form_creator.addRelativeCancel = () => addRelative.onCancel();
    form_creator.addRelativeActive = addRelative.is_active;

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

  form_creator.gender_field = {
    id: 'gender',
    type: 'switch',
    label: 'Gender',
    initial_value: datum.data.gender,
    options: [
      { value: 'M', label: 'Male' },
      { value: 'F', label: 'Female' },
    ],
  };

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

  function submitFormChanges(e: Event): void {
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
    deletePerson();
    postSubmit({ delete: true });
  }
}

export function moveToAddToAdded(datum: Datum, data_stash: Datum[]): Datum {
  delete datum.to_add;
  return datum;
}

export function removeToAdd(datum: Datum, data_stash: Datum[]): boolean {
  deletePerson(datum, data_stash);
  return false;
}

export function deletePerson(datum: Datum, data_stash: Datum[]): DeleteResult {
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

        const relKey = k as keyof typeof d.rels;
        const relValue = d.rels[relKey];

        if (typeof relValue === 'string' && relValue === datum.id) {
          delete d.rels[relKey];
        } else if (Array.isArray(relValue) && relValue.includes(datum.id)) {
          const index = relValue.findIndex(did => did === datum.id);
          if (index !== -1) {
            relValue.splice(index, 1);
          }
        }
      }
    });

    const indexToRemove = data_stash.findIndex(d => d.id === datum.id);
    if (indexToRemove !== -1) {
      data_stash.splice(indexToRemove, 1);
    }

    data_stash.forEach(d => {
      if (d.to_add) {
        deletePerson(d, data_stash);
      }
    }); // full update of tree

    if (data_stash.length === 0) {
      data_stash.push(createTreeDataWithMainNode({ data: {} }).data[0]);
    }
  }
}

export function cleanupDataJson(data_json: string): string {
  const data_no_to_add: Datum[] = JSON.parse(data_json);
  data_no_to_add.forEach(d => (d.to_add ? removeToAdd(d, data_no_to_add) : d));
  data_no_to_add.forEach(d => delete d.main);
  data_no_to_add.forEach(d => delete d.hide_rels);
  return JSON.stringify(data_no_to_add, null, 2);
}

export function removeToAddFromData(data: Datum[]): Datum[] {
  data.forEach(d => (d.to_add ? removeToAdd(d, data) : d));
  return data;
}
