// src/handlers/cardMethods.ts
import {
  toggleAllRels,
  toggleRels,
} from '../CalculateTree/CalculateTree.handlers';
import { deletePerson, moveToAddToAdded } from '../CreateTree/form';
import { Store, TreePerson } from '../types';

interface CardMethodParams {
  d: TreePerson;
  cardEditForm?: (params: CardEditFormParams) => void;
}

interface CardEditFormParams {
  datum: any;
  postSubmit: (props?: { delete?: boolean }) => void;
  store: Store;
}

export function cardChangeMain(
  store: Store,
  { d }: { d: TreePerson }
): boolean {
  if (!store.getTree()) {
    return false;
  }

  toggleAllRels(store.getTree()!.data, false);
  store.updateMainId(d.data.id);
  store.updateTree({ tree_position: store.state.tree_fit_on_change });

  return true;
}

export function cardEdit(
  store: Store,
  { d, cardEditForm }: CardMethodParams
): void {
  if (!cardEditForm) {
    return;
  }

  const datum = d.data,
    postSubmit = (props?: { delete?: boolean }) => {
      if (datum.to_add) {
        moveToAddToAdded(datum, store.getData());
      }
      if (props && props.delete) {
        if (datum.main) {
          store.updateMainId(null);
        }
        deletePerson(datum, store.getData());
      }
      store.updateTree();
    };

  cardEditForm({ datum, postSubmit, store });
}

export function cardShowHideRels(store: Store, { d }: { d: TreePerson }): void {
  d.data.hide_rels = !d.data.hide_rels;
  toggleRels(d, d.data.hide_rels);
  store.updateTree({ tree_position: store.state.tree_fit_on_change });
}
