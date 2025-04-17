// src/view/elements/Form.ts
import { Person, Store } from '../../types';

interface FormProps {
  datum: Person;
  rel_datum?: Person;
  store: Store;
  rel_type?: string;
  card_edit: Array<{
    type: string;
    key: string;
    placeholder: string;
  }>;
  postSubmit: (props?: { delete?: boolean }) => void;
  card_display: ((d: Person) => string)[];
  edit: {
    el: HTMLElement;
    open: () => void;
    close: () => void;
  };
}

export function Form({
  datum,
  rel_datum,
  store,
  rel_type,
  card_edit,
  postSubmit,
  card_display,
  edit: { el, open, close },
}: FormProps): void {
  setupFromHtml();
  open();

  function setupFromHtml(): void {
    el.innerHTML = `
      <div class="modal-content">
        <form>
          <div>
            <div style="text-align: left">
              <span style="display: ${datum.to_add || !!rel_datum ? 'none' : null}; float: right; cursor: pointer" class="red-text delete">delete</span>
            </div>
            <div>
              <label><input type="radio" name="gender" value="M" ${datum.data.gender === 'M' ? 'checked' : ''}><span>male</span></label><br>
              <label><input type="radio" name="gender" value="F" ${datum.data.gender === 'F' ? 'checked' : ''}><span>female</span></label><br>
            </div>
          </div>
          ${getEditFields(card_edit)}
          ${rel_type === 'son' || rel_type === 'daughter' ? otherParentSelect() : ''}
          <br><br>
          <div style="text-align: center">
            <button type="submit" class="btn">submit</button>
          </div>
        </form>
      </div>
    `;

    const form = el.querySelector('form');
    if (form) {
      form.addEventListener('submit', submitFormChanges);
    }

    const deleteBtn = el.querySelector('.delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', deletePerson);
    }
  }

  function otherParentSelect(): string {
    const data_stash = store.getData();

    if (
      !rel_datum ||
      !rel_datum.rels.spouses ||
      rel_datum.rels.spouses.length === 0
    ) {
      return '';
    }

    const options = rel_datum.rels.spouses
      .map((sp_id, i) => {
        const spouse = data_stash.find(d => d.id === sp_id);
        if (!spouse) {
          return '';
        }

        return `<option value="${sp_id}" ${i === 0 ? 'selected' : ''}>${card_display[0](spouse)}</option>`;
      })
      .join('\n');

    return `
      <div>
        <label>Select other</label>
        <select name="other_parent" style="display: block">
          ${options}
          <option value="${'_new'}">NEW</option>
        </select>
      </div>
    `;
  }

  function submitFormChanges(e: Event): void {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    formData.forEach((v, k) => {
      datum.data[k] = v.toString();
    });

    close();
    postSubmit();
  }

  function deletePerson(): void {
    close();
    postSubmit({ delete: true });
  }

  function getEditFields(
    card_edit: Array<{
      type: string;
      key: string;
      placeholder: string;
    }>
  ): string {
    return card_edit
      .map(d =>
        d.type === 'text'
          ? `<input type="text" name="${d.key}" placeholder="${d.placeholder}" value="${datum.data[d.key] || ''}">`
          : d.type === 'textarea'
            ? `<textarea class="materialize-textarea" name="${d.key}" placeholder="${d.placeholder}">${datum.data[d.key] || ''}</textarea>`
            : ''
      )
      .join('\n');
  }
}
