import {
  toggleAllRels,
  toggleRels,
} from '../CalculateTree/CalculateTree.handlers';
import { deletePerson, moveToAddToAdded } from '../CreateTree/form';
import { Datum, Store, TreeNode } from '../types';

interface CardChangeMainOptions {
  d: TreeNode;
}

export function cardChangeMain(
  store: Store,
  { d }: CardChangeMainOptions
): boolean {
  toggleAllRels(store.getTree().data, false);
  store.updateMainId(d.data.id);
  store.updateTree({ tree_position: store.state.tree_fit_on_change });
  return true;
}

interface CardEditOptions {
  d: TreeNode;
  cardEditForm: (options: {
    datum: Datum;
    postSubmit: (props?: { delete?: boolean }) => void;
    store: Store;
  }) => void;
}

export function cardEdit(
  store: Store,
  { d, cardEditForm }: CardEditOptions
): void {
  const datum = d.data;
  const postSubmit = (props?: { delete?: boolean }): void => {
    if (datum.to_add) {
      moveToAddToAdded(datum, store.getData());
    }
    if (props && props.delete) {
      if (datum.main) {
        store.updateMainId(null as unknown as string);
      }
      deletePerson(datum, store.getData());
    }
    store.updateTree();
  };
  cardEditForm({ datum, postSubmit, store });
}

interface CardShowHideRelsOptions {
  d: TreeNode;
}

export function cardShowHideRels(
  store: Store,
  { d }: CardShowHideRelsOptions
): void {
  d.data.hide_rels = !d.data.hide_rels;
  toggleRels(d, d.data.hide_rels);
  store.updateTree({ tree_position: store.state.tree_fit_on_change });
}
