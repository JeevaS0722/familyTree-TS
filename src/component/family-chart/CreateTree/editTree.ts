import d3 from '../d3';
import f3 from '../index';
import addRelative from './addRelative';
import { deletePerson } from './form';
import { AddRelative, Datum, EditTree, Field, History, Store } from '../types';

export default function (...args: any[]): EditTree {
  return new EditTreeClass(...(args as [HTMLElement, any]));
}

class EditTreeClass implements EditTree {
  public cont: HTMLElement;
  public store: Store;
  public fields: Field[] = [
    { type: 'text', label: 'first name', id: 'first name' },
    { type: 'text', label: 'last name', id: 'last name' },
    { type: 'text', label: 'birthday', id: 'birthday' },
    { type: 'text', label: 'avatar', id: 'avatar' },
  ];
  public form_cont: HTMLElement | null = null;
  public is_fixed: boolean = true;
  public history: History | null = null;
  public no_edit: boolean = false;
  public onChange: ((data?: any) => void) | null = null;
  public editFirst: boolean = false;
  public addRelativeInstance!: AddRelative;
  public card_display?: any;

  constructor(cont: HTMLElement, store: any) {
    this.cont = cont;
    this.store = store;
    this.init();
    return this;
  }

  init(): void {
    this.form_cont = d3
      .select(this.cont)
      .append('div')
      .classed('f3-form-cont', true)
      .node() as HTMLElement;
    this.addRelativeInstance = this.setupAddRelative();
    this.createHistory();
  }

  open(datum: any): void {
    if (datum.data.data) {
      datum = datum.data;
    }
    if (this.addRelativeInstance.is_active && !datum._new_rel_data) {
      this.addRelativeInstance.onCancel!();
      datum = this.store.getDatum(datum.id);
    }

    this.cardEditForm(datum);
  }

  openWithoutRelCancel(datum: any): void {
    if (datum.data.data) {
      datum = datum.data;
    }
    this.cardEditForm(datum);
  }

  cardEditForm(datum: any): void {
    const props: any = {};
    const is_new_rel = datum?._new_rel_data;
    if (is_new_rel) {
      props.onCancel = () => this.addRelativeInstance.onCancel!();
    } else {
      props.addRelative = this.addRelativeInstance;
      props.deletePerson = () => {
        const data = this.store.getData();
        deletePerson(datum, data);
        this.store.updateData(data);
        this.openFormWithId(this.store.getLastAvailableMainDatum().id);

        this.store.updateTree({});
      };
    }

    const form_creator = f3.handlers.createForm({
      store: this.store,
      datum,
      postSubmit: postSubmit.bind(this),
      fields: this.fields,
      card_display: this.card_display,
      addRelative: null,
      onCancel: () => {},
      editFirst: this.editFirst,
      ...props,
    });

    form_creator.no_edit = this.no_edit;
    const form_cont = f3.handlers.formInfoSetup(
      form_creator,
      this.closeForm.bind(this)
    );

    if (this.form_cont) {
      this.form_cont.innerHTML = '';
      this.form_cont.appendChild(form_cont);
    }

    this.openForm();

    function postSubmit(this: EditTreeClass, props?: any): void {
      if (this.addRelativeInstance.is_active) {
        this.addRelativeInstance.onChange!(datum);
      } else if (!props?.delete) {
        this.openFormWithId(datum.id);
      }

      if (!this.is_fixed) {
        this.closeForm();
      }

      this.store.updateTree({});

      this.updateHistory();
    }
  }

  openForm(): void {
    d3.select(this.form_cont).classed('opened', true);
  }

  closeForm(): void {
    d3.select(this.form_cont).classed('opened', false).html('');
    this.store.updateTree({});
  }

  fixed(): EditTree {
    this.is_fixed = true;
    d3.select(this.form_cont).style('position', 'relative');
    return this;
  }

  absolute(): EditTree {
    this.is_fixed = false;
    d3.select(this.form_cont).style('position', 'absolute');
    return this;
  }

  setCardClickOpen(card: any): EditTree {
    card.setOnCardClick((e: Event, d: any) => {
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

  openFormWithId(d_id: string | null): void {
    if (d_id) {
      const d = this.store.getDatum(d_id);
      this.openWithoutRelCancel({ data: d });
    } else {
      const d = this.store.getMainDatum();
      this.openWithoutRelCancel({ data: d });
    }
  }

  createHistory(): EditTree {
    this.history = f3.handlers.createHistory(
      this.store,
      this.getStoreData.bind(this),
      historyUpdateTree.bind(this)
    );
    this.history.controls = f3.handlers.createHistoryControls(
      this.cont,
      this.history
    );
    this.history.changed();
    this.history.controls.updateButtons();

    return this;

    function historyUpdateTree(this: EditTreeClass): void {
      if (this.addRelativeInstance.is_active) {
        this.addRelativeInstance.onCancel!();
      }
      this.store.updateTree({ initial: false });
      this.history!.controls!.updateButtons();
      this.openFormWithId(this.store.getMainDatum()?.id);
    }
  }

  setNoEdit(): EditTree {
    this.no_edit = true;
    return this;
  }

  setEdit(): EditTree {
    this.no_edit = false;
    return this;
  }

  setFields(fields: Array<string | Field>): EditTree {
    const new_fields: Field[] = [];
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

  setOnChange(fn: (data?: any) => void): EditTree {
    this.onChange = fn;
    return this;
  }

  addRelative(datum?: Datum): EditTree {
    if (!datum) {
      datum = this.store.getMainDatum();
    }
    this.addRelativeInstance.activate(datum);
    return this;
  }

  setupAddRelative(): AddRelative {
    return addRelative(
      this.store,
      cancelCallback.bind(this),
      onSubmitCallback.bind(this)
    );

    function onSubmitCallback(
      this: EditTreeClass,
      datum: Datum,
      new_rel_datum: Datum
    ): void {
      this.store.updateMainId(datum.id);
      this.openFormWithId(datum.id);
    }

    function cancelCallback(this: EditTreeClass, datum: Datum): void {
      this.store.updateMainId(datum.id);
      this.store.updateTree({});
      this.openFormWithId(datum.id);
    }
  }

  setEditFirst(editFirst: boolean): EditTree {
    this.editFirst = editFirst;
    return this;
  }

  isAddingRelative(): boolean {
    return this.addRelativeInstance.is_active;
  }

  setAddRelLabels(add_rel_labels: Partial<Record<string, string>>): EditTree {
    this.addRelativeInstance.setAddRelLabels(add_rel_labels);
    return this;
  }

  getStoreData(): Datum[] {
    if (this.addRelativeInstance.is_active) {
      return this.addRelativeInstance.getStoreData()!;
    } else {
      return this.store.getData();
    }
  }

  getDataJson(): string {
    const data = this.getStoreData();
    return f3.handlers.cleanupDataJson(JSON.stringify(data));
  }

  updateHistory(): void {
    if (this.history) {
      this.history.changed();
      this.history.controls!.updateButtons();
    }

    if (this.onChange) {
      this.onChange();
    }
  }

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
