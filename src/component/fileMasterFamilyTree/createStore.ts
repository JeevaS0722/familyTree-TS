// src/createStore.ts
import CalculateTree from './CalculateTree/CalculateTree';
import { Person, Store, StoreState, TreePerson, CalculatedTree } from './types';

export default function createStore(initial_state: Partial<StoreState>): Store {
  let onUpdate: ((props?: any) => void) | undefined;

  const state: StoreState = {
    data: initial_state.data || [],
    main_id: initial_state.main_id || null,
    main_id_history: initial_state.main_id_history || [],
    node_separation: initial_state.node_separation || 250,
    level_separation: initial_state.level_separation || 150,
    single_parent_empty_card:
      initial_state.single_parent_empty_card !== undefined
        ? initial_state.single_parent_empty_card
        : true,
    is_horizontal: initial_state.is_horizontal || false,
    ...initial_state,
  };

  state.main_id_history = [];

  const store: Store = {
    state,
    updateTree: props => {
      state.tree = calcTree();
      if (!state.main_id && state.tree) {
        updateMainId(state.tree.main_id);
      }
      if (onUpdate) {
        onUpdate(props);
      }
    },
    updateData: data => (state.data = data),
    updateMainId,
    getMainId: () => state.main_id,
    getData: () => state.data,
    getTree: () => state.tree,
    setOnUpdate: f => (onUpdate = f),

    getMainDatum,
    getDatum,
    getTreeMainDatum,
    getTreeDatum,
    getLastAvailableMainDatum,

    methods: {},
  };

  return store;

  function calcTree(): CalculatedTree | undefined {
    if (!state.data || state.data.length === 0) {
      return undefined;
    }

    return CalculateTree({
      data: state.data,
      main_id: state.main_id,
      node_separation: state.node_separation,
      level_separation: state.level_separation,
      single_parent_empty_card: state.single_parent_empty_card,
      is_horizontal: state.is_horizontal,
    });
  }

  function getMainDatum(): Person | undefined {
    if (!state.main_id) {
      return undefined;
    }
    return state.data.find(d => d.id === state.main_id);
  }

  function getDatum(id: string): Person | undefined {
    return state.data.find(d => d.id === id);
  }

  function getTreeMainDatum(): TreePerson | null {
    if (!state.tree || !state.main_id) {
      return null;
    }
    return state.tree.data.find(d => d.data.id === state.main_id) || null;
  }

  function getTreeDatum(id: string): TreePerson | null {
    if (!state.tree) {
      return null;
    }
    return state.tree.data.find(d => d.data.id === id) || null;
  }

  function updateMainId(id: string | null): void {
    if (id === state.main_id) {
      return;
    }
    if (id) {
      state.main_id_history = state.main_id_history
        .filter(d => d !== id)
        .slice(-10);
      state.main_id_history.push(id);
    }
    state.main_id = id;
  }

  // if main_id is deleted, get the last available main_id
  function getLastAvailableMainDatum(): Person {
    let main_id = state.main_id_history
      .slice(0)
      .reverse()
      .find(id => getDatum(id));

    if (!main_id && state.data.length > 0) {
      main_id = state.data[0].id;
    }
    if (main_id !== state.main_id) {
      updateMainId(main_id);
    }

    return getDatum(main_id as string) as Person;
  }
}
