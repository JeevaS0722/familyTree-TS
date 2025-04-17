// src/CreateTree/editTree.ts
import d3 from '../d3';
import fmFamilyTree from '../index';
import addRelative from './addRelative';
import { deletePerson, moveToAddToAdded } from './form';
import { Person, Store, TreePerson } from '../types';

interface EditTreeField {
  type: string;
  label: string;
  id: string;
}

/**
 * Factory function to create an EditTree instance
 */
export default function EditTreeFactory(
  ...args: ConstructorParameters<typeof EditTree>
): EditTree {
  return new EditTree(...args);
}

/**
 * Class to handle the editing of family tree data
 */
class EditTree {
  cont: HTMLElement;
  store: Store;
  fields: EditTreeField[] = [
    { type: 'text', label: 'first name', id: 'first name' },
    { type: 'text', label: 'last name', id: 'last name' },
    { type: 'text', label: 'birthday', id: 'birthday' },
    { type: 'text', label: 'avatar', id: 'avatar' },
  ];
  form_cont: HTMLElement | null = null;
  is_fixed: boolean = true;
  history: any = null;
  no_edit: boolean = false;
  onChange: (() => void) | null = null;
  editFirst: boolean = false;
  addRelativeInstance: any;
  card_display?: any;

  /**
   * Create an EditTree instance
   *
   * @param cont - The container element
   * @param store - The data store
   */
  constructor(cont: HTMLElement, store: Store) {
    this.cont = cont;
    this.store = store;
    this.init();
    return this;
  }

  /**
   * Initialize the EditTree
   */
  init(): void {
    this.form_cont = d3
      .select(this.cont)
      .append('div')
      .classed('f3-form-cont', true)
      .node() as HTMLElement;

    this.addRelativeInstance = this.setupAddRelative();
    this.createHistory();
  }

  /**
   * Open the edit form for a person
   */
  open(datum: TreePerson | Person): void {
    const data = 'data' in datum ? datum : (datum as TreePerson).data;

    if (this.addRelativeInstance.is_active && !data._new_rel_data) {
      this.addRelativeInstance.onCancel();

      // Re-fetch the datum in case it was modified during cancel
      const updatedDatum = this.store.getDatum(data.id);
      if (updatedDatum) {
        this.cardEditForm(updatedDatum);
      }
    } else {
      this.cardEditForm(data as Person);
    }
  }

  /**
   * Open edit form without canceling the add relative mode
   */
  openWithoutRelCancel(datum: TreePerson | Person): void {
    const data = 'data' in datum ? datum : (datum as TreePerson).data;
    this.cardEditForm(data as Person);
  }

  /**
   * Create and display the card edit form
   */
  cardEditForm(datum: Person): void {
    const props: any = {};
    const is_new_rel = datum?._new_rel_data;

    if (is_new_rel) {
      props.onCancel = () => this.addRelativeInstance.onCancel();
    } else {
      props.addRelative = this.addRelativeInstance;
      props.deletePerson = () => {
        const data = this.store.getData();
        deletePerson(datum, data);
        this.store.updateData(data);

        const lastAvailableDatum = this.store.getLastAvailableMainDatum();
        if (lastAvailableDatum) {
          this.openFormWithId(lastAvailableDatum.id);
        }

        this.store.updateTree({});
      };
    }

    const form_creator = fmFamilyTree.handlers.createForm({
      store: this.store,
      datum,
      postSubmit: this.postSubmit.bind(this),
      fields: this.fields,
      card_display: this.card_display,
      addRelative: null,
      onCancel: () => {},
      editFirst: this.editFirst,
      ...props,
    });

    form_creator.no_edit = this.no_edit;

    if (!this.form_cont) {
      throw new Error('Form container not initialized');
    }

    const form_cont = fmFamilyTree.handlers.formInfoSetup(
      form_creator,
      this.closeForm.bind(this)
    );

    this.form_cont.innerHTML = '';
    this.form_cont.appendChild(form_cont);

    this.openForm();
  }

  /**
   * Handler for form submission
   */
  private postSubmit(props?: { delete?: boolean }): void {
    if (!this.datum) {
      return;
    }

    if (this.addRelativeInstance.is_active) {
      this.addRelativeInstance.onChange(this.datum);
    } else if (!props?.delete) {
      this.openFormWithId(this.datum.id);
    }

    if (!this.is_fixed) {
      this.closeForm();
    }

    this.store.updateTree({});
    this.updateHistory();
  }

  /**
   * Open the form
   */
  openForm(): void {
    d3.select(this.form_cont).classed('opened', true);
  }

  /**
   * Close the form
   */
  closeForm(): void {
    d3.select(this.form_cont).classed('opened', false).html('');
    this.store.updateTree({});
  }

  /**
   * Set the form to fixed position
   */
  fixed(): EditTree {
    this.is_fixed = true;
    d3.select(this.form_cont).style('position', 'relative');
    return this;
  }

  /**
   * Set the form to absolute position
   */
  absolute(): EditTree {
    this.is_fixed = false;
    d3.select(this.form_cont).style('position', 'absolute');
    return this;
  }

  /**
   * Set up the card click to open the edit form
   */
  setCardClickOpen(card: any): EditTree {
    card.setOnCardClick((e: MouseEvent, d: TreePerson) => {
      if (this.addRelativeInstance.is_active) {
        this.open(d);
        return;
      }
      this.open(d);
      this.store.updateMainId(d.data.id);
      this.store.updateTree({});
    });

    return this;
  }

  /**
   * Open the form for a person by ID
   */
  openFormWithId(d_id?: string): void {
    if (d_id) {
      const d = this.store.getDatum(d_id);
      if (d) {
        this.openWithoutRelCancel({ data: d });
      }
    } else {
      const d = this.store.getMainDatum();
      if (d) {
        this.openWithoutRelCancel({ data: d });
      }
    }
  }

  /**
   * Create the history tracking for undo/redo
   */
  createHistory(): EditTree {
    this.history = fmFamilyTree.handlers.createHistory(
      this.store,
      this.getStoreData.bind(this),
      this.historyUpdateTree.bind(this)
    );

    this.history.controls = fmFamilyTree.handlers.createHistoryControls(
      this.cont,
      this.history
    );

    this.history.changed();
    this.history.controls.updateButtons();

    return this;
  }

  /**
   * Update the tree when history changes
   */
  private historyUpdateTree(): void {
    if (this.addRelativeInstance.is_active) {
      this.addRelativeInstance.onCancel();
    }

    this.store.updateTree({ initial: false });
    this.history.controls.updateButtons();

    const mainDatum = this.store.getMainDatum();
    if (mainDatum) {
      this.openFormWithId(mainDatum.id);
    }
  }

  /**
   * Disable editing
   */
  setNoEdit(): EditTree {
    this.no_edit = true;
    return this;
  }

  /**
   * Enable editing
   */
  setEdit(): EditTree {
    this.no_edit = false;
    return this;
  }

  /**
   * Set the fields to display in the form
   */
  setFields(fields: Array<string | EditTreeField>): EditTree {
    const new_fields: EditTreeField[] = [];

    if (!Array.isArray(fields)) {
      console.error('fields must be an array');
      return this;
    }

    for (const field of fields) {
      if (typeof field === 'string') {
        new_fields.push({ type: 'text', label: field, id: field });
      } else if (typeof field === 'object') {
        if (!field.id) {
          console.error('fields must be an array of objects with id property');
        } else {
          new_fields.push(field);
        }
      } else {
        console.error('fields must be an array of strings or objects');
      }
    }

    this.fields = new_fields;
    return this;
  }

  /**
   * Set the onChange callback
   */
  setOnChange(fn: () => void): EditTree {
    this.onChange = fn;
    return this;
  }

  /**
   * Open the add relative form
   */
  addRelative(datum?: Person): EditTree {
    if (!datum) {
      datum = this.store.getMainDatum();
    }

    if (datum) {
      this.addRelativeInstance.activate(datum);
    }

    return this;
  }

  /**
   * Set up the add relative functionality
   */
  setupAddRelative(): any {
    return addRelative(
      this.store,
      this.cancelCallback.bind(this),
      this.onSubmitCallback.bind(this)
    );
  }

  /**
   * Callback when a relative is added
   */
  private onSubmitCallback(datum: Person, new_rel_datum: Person): void {
    this.store.updateMainId(datum.id);
    this.openFormWithId(datum.id);
  }

  /**
   * Callback when adding a relative is cancelled
   */
  private cancelCallback(datum: Person): void {
    this.store.updateMainId(datum.id);
    this.store.updateTree({});
    this.openFormWithId(datum.id);
  }

  /**
   * Set whether to start in edit mode
   */
  setEditFirst(editFirst: boolean): EditTree {
    this.editFirst = editFirst;
    return this;
  }

  /**
   * Check if currently adding a relative
   */
  isAddingRelative(): boolean {
    return this.addRelativeInstance.is_active;
  }

  /**
   * Set labels for add relative buttons
   */
  setAddRelLabels(add_rel_labels: Record<string, string>): EditTree {
    this.addRelativeInstance.setAddRelLabels(add_rel_labels);
    return this;
  }

  /**
   * Get the current store data
   */
  getStoreData(): Person[] {
    if (this.addRelativeInstance.is_active) {
      return this.addRelativeInstance.getStoreData();
    } else {
      return this.store.getData();
    }
  }

  /**
   * Get the data as JSON
   */
  getDataJson(): string {
    const data = this.getStoreData();
    return fmFamilyTree.handlers.cleanupDataJson(JSON.stringify(data));
  }

  /**
   * Update the history
   */
  updateHistory(): void {
    if (this.history) {
      this.history.changed();
      this.history.controls.updateButtons();
    }

    if (this.onChange) {
      this.onChange();
    }
  }

  /**
   * Clean up and remove the edit tree
   */
  destroy(): EditTree {
    if (this.history && this.history.controls) {
      this.history.controls.destroy();
    }

    this.history = null;
    d3.select(this.cont).select('.f3-form-cont').remove();

    if (this.addRelativeInstance.onCancel) {
      this.addRelativeInstance.onCancel();
    }

    this.store.updateTree({});
    return this;
  }
}
