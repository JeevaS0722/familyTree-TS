/* eslint-disable complexity */
/* eslint-disable max-depth */
// src/component/FamilyTree/context/TreeContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import { PersonData, TreeData, TreeConfig } from '../types/familyTree';
import { calculateTree } from '../utils/treeCalculator';

interface TreeState {
  data: PersonData[];
  mainId: string | null;
  config: TreeConfig;
  treeData: TreeData | null;
  isInitialRender: boolean;
}

type TreeAction =
  | { type: 'UPDATE_MAIN_ID'; payload: string }
  | { type: 'UPDATE_DATA'; payload: PersonData[] }
  | {
      type: 'ADD_PERSON';
      payload: {
        person: PersonData;
        parentId: string;
        relationship: 'father' | 'mother' | 'spouse' | 'son' | 'daughter';
        otherParentId?: string;
      };
    }
  | { type: 'REMOVE_PERSON'; payload: string }
  | { type: 'UPDATE_CONFIG'; payload: Partial<TreeConfig> }
  | { type: 'UPDATE_TREE'; payload?: { initial?: boolean } }
  | { type: 'SET_INITIAL_RENDER_COMPLETE' }
  | {
      type: 'ADD_PERSON_AND_UPDATE';
      payload: {
        person: PersonData;
        parentId: string;
        relationship: 'father' | 'mother' | 'spouse' | 'son' | 'daughter';
        otherParentId?: string;
      };
    }
  | { type: 'REMOVE_PERSON_AND_UPDATE'; payload: string };

const initialConfig: TreeConfig = {
  nodeSeparation: 400,
  levelSeparation: 300,
  isHorizontal: false,
  transitionTime: 1000,
  cardDimensions: {
    w: 300,
    h: 155,
    text_x: 20,
    text_y: 20,
    relationship_batch_w: 128,
    relationship_batch_h: 21,
    relationship_batch_x: 0,
    relationship_batch_y: -25,
  },
  showMiniTree: true,
  linkBreak: false,
  highlightHoverPath: true,
  viewMode: false,
};

const initialState: TreeState = {
  data: [],
  mainId: null,
  config: initialConfig,
  treeData: null,
  isInitialRender: true,
};

function treeReducer(state: TreeState, action: TreeAction): TreeState {
  switch (action.type) {
    case 'UPDATE_MAIN_ID':
      return {
        ...state,
        mainId: action.payload,
      };

    case 'UPDATE_DATA':
      return {
        ...state,
        data: action.payload,
      };

    case 'ADD_PERSON': {
      const { person, parentId, relationship, otherParentId } = action.payload;
      const updatedData = JSON.parse(JSON.stringify(state.data));

      const parentIndex = updatedData.findIndex(
        (p: PersonData) => p.id === parentId
      );
      if (parentIndex === -1) {
        return state;
      }

      const parent = updatedData[parentIndex];

      let otherParent;
      if (otherParentId) {
        const otherParentIndex = updatedData.findIndex(
          (p: PersonData) => p.id === otherParentId
        );
        if (otherParentIndex !== -1) {
          otherParent = updatedData[otherParentIndex];
        }
      }

      if (relationship === 'spouse') {
        if (!parent.rels.spouses) {
          parent.rels.spouses = [];
        }
        if (!person.rels.spouses) {
          person.rels.spouses = [];
        }

        parent.rels.spouses.push(person.id);
        person.rels.spouses.push(parent.id);
      } else if (relationship === 'son' || relationship === 'daughter') {
        if (!parent.rels.children) {
          parent.rels.children = [];
        }

        parent.rels.children.push(person.id);

        if (parent.data.gender === 'M') {
          person.rels.father = parent.id;

          if (otherParent && otherParent.data.gender === 'F') {
            person.rels.mother = otherParent.id;
            if (!otherParent.rels.children) {
              otherParent.rels.children = [];
            }
            if (!otherParent.rels.children.includes(person.id)) {
              otherParent.rels.children.push(person.id);
            }
          }
        } else {
          person.rels.mother = parent.id;

          if (otherParent && otherParent.data.gender === 'M') {
            person.rels.father = otherParent.id;
            if (!otherParent.rels.children) {
              otherParent.rels.children = [];
            }
            if (!otherParent.rels.children.includes(person.id)) {
              otherParent.rels.children.push(person.id);
            }
          }
        }
      } else if (relationship === 'father') {
        person.rels.father = parent.id;
        if (!parent.rels.children) {
          parent.rels.children = [];
        }
        parent.rels.children.push(person.id);
      } else if (relationship === 'mother') {
        person.rels.mother = parent.id;
        if (!parent.rels.children) {
          parent.rels.children = [];
        }
        parent.rels.children.push(person.id);
      }

      updatedData.push(person);

      return {
        ...state,
        data: updatedData,
      };
    }

    case 'REMOVE_PERSON': {
      const personId = action.payload;
      const updatedData = JSON.parse(
        JSON.stringify(state.data.filter(p => p.id !== personId))
      );

      updatedData.forEach((person: PersonData) => {
        if (person.rels.spouses) {
          person.rels.spouses = person.rels.spouses.filter(
            id => id !== personId
          );
          if (person.rels.spouses.length === 0) {
            delete person.rels.spouses;
          }
        }

        if (person.rels.children) {
          person.rels.children = person.rels.children.filter(
            id => id !== personId
          );
          if (person.rels.children.length === 0) {
            delete person.rels.children;
          }
        }

        if (person.rels.father === personId) {
          delete person.rels.father;
        }

        if (person.rels.mother === personId) {
          delete person.rels.mother;
        }
      });

      let newMainId = state.mainId;
      if (state.mainId === personId && updatedData.length > 0) {
        newMainId = updatedData[0].id;
      }

      return {
        ...state,
        data: updatedData,
        mainId: newMainId,
      };
    }

    case 'UPDATE_CONFIG': {
      const newConfig = {
        ...state.config,
        ...action.payload,
      };

      if (
        action.payload.isHorizontal !== undefined ||
        action.payload.nodeSeparation !== undefined ||
        action.payload.levelSeparation !== undefined
      ) {
        const newTreeData = calculateTree({
          data: state.data,
          main_id: state.mainId,
          node_separation: newConfig.nodeSeparation,
          level_separation: newConfig.levelSeparation,
          is_horizontal: newConfig.isHorizontal,
        });

        return {
          ...state,
          config: newConfig,
          treeData: newTreeData,
          isInitialRender: false,
        };
      }

      return {
        ...state,
        config: newConfig,
      };
    }

    case 'UPDATE_TREE': {
      const treeData = calculateTree({
        data: state.data,
        main_id: state.mainId,
        node_separation: state.config.nodeSeparation,
        level_separation: state.config.levelSeparation,
        is_horizontal: state.config.isHorizontal,
      });

      return {
        ...state,
        treeData,
        isInitialRender: action.payload?.initial === true,
      };
    }

    case 'SET_INITIAL_RENDER_COMPLETE':
      return {
        ...state,
        isInitialRender: false,
      };

    case 'ADD_PERSON_AND_UPDATE': {
      const { person, parentId, relationship, otherParentId } = action.payload;
      const updatedData = JSON.parse(JSON.stringify(state.data));

      const parentIndex = updatedData.findIndex(p => p.id === parentId);
      if (parentIndex === -1) {
        return state;
      }

      const parent = updatedData[parentIndex];

      let otherParent;
      if (otherParentId) {
        const otherParentIndex = updatedData.findIndex(
          p => p.id === otherParentId
        );
        if (otherParentIndex !== -1) {
          otherParent = updatedData[otherParentIndex];
        }
      }

      if (relationship === 'spouse') {
        if (!parent.rels.spouses) {
          parent.rels.spouses = [];
        }
        if (!person.rels.spouses) {
          person.rels.spouses = [];
        }

        if (!parent.rels.spouses.includes(person.id)) {
          parent.rels.spouses.push(person.id);
        }

        if (!person.rels.spouses.includes(parent.id)) {
          person.rels.spouses.push(parent.id);
        }
      } else if (relationship === 'son' || relationship === 'daughter') {
        if (!parent.rels.children) {
          parent.rels.children = [];
        }

        if (!parent.rels.children.includes(person.id)) {
          parent.rels.children.push(person.id);
        }

        if (parent.data.gender === 'M') {
          person.rels.father = parent.id;

          if (otherParent && otherParent.data.gender === 'F') {
            person.rels.mother = otherParent.id;
            if (!otherParent.rels.children) {
              otherParent.rels.children = [];
            }
            if (!otherParent.rels.children.includes(person.id)) {
              otherParent.rels.children.push(person.id);
            }
          }
        } else {
          person.rels.mother = parent.id;

          if (otherParent && otherParent.data.gender === 'M') {
            person.rels.father = otherParent.id;
            if (!otherParent.rels.children) {
              otherParent.rels.children = [];
            }
            if (!otherParent.rels.children.includes(person.id)) {
              otherParent.rels.children.push(person.id);
            }
          }
        }
      } else if (relationship === 'father') {
        person.rels.father = parent.id;
        if (!parent.rels.children) {
          parent.rels.children = [];
        }
        if (!parent.rels.children.includes(person.id)) {
          parent.rels.children.push(person.id);
        }
      } else if (relationship === 'mother') {
        person.rels.mother = parent.id;
        if (!parent.rels.children) {
          parent.rels.children = [];
        }
        if (!parent.rels.children.includes(person.id)) {
          parent.rels.children.push(person.id);
        }
      }

      updatedData.push(person);

      const treeData = calculateTree({
        data: updatedData,
        main_id: state.mainId,
        node_separation: state.config.nodeSeparation,
        level_separation: state.config.levelSeparation,
        is_horizontal: state.config.isHorizontal,
      });

      return {
        ...state,
        data: updatedData,
        treeData,
        isInitialRender: false,
      };
    }

    case 'REMOVE_PERSON_AND_UPDATE': {
      const personId = action.payload;

      const personToRemove = state.data.find(p => p.id === personId);
      if (personToRemove?.isPhantom) {
        return state;
      }

      const updatedData = JSON.parse(
        JSON.stringify(
          state.data.filter(
            p =>
              p.id !== personId &&
              (!p.isPhantom || !p.rels.spouses?.includes(personId))
          )
        )
      );

      updatedData.forEach((person: PersonData) => {
        if (person.rels.spouses) {
          person.rels.spouses = person.rels.spouses.filter(
            id => id !== personId
          );
          if (person.rels.spouses.length === 0) {
            delete person.rels.spouses;
          }
        }

        if (person.rels.children) {
          person.rels.children = person.rels.children.filter(
            id => id !== personId
          );
          if (person.rels.children.length === 0) {
            delete person.rels.children;
          }
        }

        if (person.rels.father === personId) {
          delete person.rels.father;
        }

        if (person.rels.mother === personId) {
          delete person.rels.mother;
        }
      });

      let newMainId = state.mainId;
      if (state.mainId === personId && updatedData.length > 0) {
        const newMain = updatedData.find(p => !p.isPhantom);
        if (newMain) {
          newMainId = newMain.id;
        } else {
          newMainId = updatedData[0].id;
        }
      }

      const treeData = calculateTree({
        data: updatedData,
        main_id: newMainId,
        node_separation: state.config.nodeSeparation,
        level_separation: state.config.levelSeparation,
        is_horizontal: state.config.isHorizontal,
      });

      return {
        ...state,
        data: updatedData,
        mainId: newMainId,
        treeData,
        isInitialRender: false,
      };
    }

    default:
      return state;
  }
}

interface TreeContextValue {
  state: TreeState;
  updateMainId: (id: string) => void;
  updateData: (data: PersonData[]) => void;
  updateConfig: (config: Partial<TreeConfig>) => void;
  updateTree: (props?: { initial?: boolean }) => void;
  setInitialRenderComplete: () => void;
  addPerson: (
    person: PersonData,
    parentId: string,
    relationship: 'father' | 'mother' | 'spouse' | 'son' | 'daughter',
    otherParentId?: string
  ) => void;
  removePerson: (personId: string) => void;
}

const TreeContext = createContext<TreeContextValue | undefined>(undefined);

export function TreeProvider({
  children,
  initialData,
  initialMainId,
}: {
  children: React.ReactNode;
  initialData?: PersonData[];
  initialMainId?: string;
}) {
  const [state, dispatch] = useReducer(treeReducer, {
    ...initialState,
    data: initialData || [],
    mainId:
      initialMainId ||
      (initialData && initialData.length > 0 ? initialData[0].id : null),
  });

  const updateMainId = useCallback((id: string) => {
    dispatch({ type: 'UPDATE_MAIN_ID', payload: id });
  }, []);

  const updateData = useCallback((data: PersonData[]) => {
    dispatch({ type: 'UPDATE_DATA', payload: data });
  }, []);

  const updateConfig = useCallback((config: Partial<TreeConfig>) => {
    dispatch({ type: 'UPDATE_CONFIG', payload: config });
  }, []);

  const updateTree = useCallback((props?: { initial?: boolean }) => {
    dispatch({ type: 'UPDATE_TREE', payload: props });
  }, []);

  const setInitialRenderComplete = useCallback(() => {
    dispatch({ type: 'SET_INITIAL_RENDER_COMPLETE' });
  }, []);

  const addPerson = useCallback(
    (
      person: PersonData,
      parentId: string,
      relationship: 'father' | 'mother' | 'spouse' | 'son' | 'daughter',
      otherParentId?: string
    ) => {
      dispatch({
        type: 'ADD_PERSON_AND_UPDATE',
        payload: { person, parentId, relationship, otherParentId },
      });
    },
    []
  );

  const removePerson = useCallback((personId: string) => {
    dispatch({
      type: 'REMOVE_PERSON_AND_UPDATE',
      payload: personId,
    });
  }, []);

  useEffect(() => {
    if (initialData && initialData.length > 0 && !state.treeData) {
      updateTree({ initial: true });
    }
  }, [initialData, state.treeData, updateTree]);

  return (
    <TreeContext.Provider
      value={{
        state,
        updateMainId,
        updateData,
        updateConfig,
        updateTree,
        setInitialRenderComplete,
        addPerson,
        removePerson,
      }}
    >
      {children}
    </TreeContext.Provider>
  );
}

export function useTreeContext() {
  const context = useContext(TreeContext);
  if (context === undefined) {
    throw new Error('useTreeContext must be used within a TreeProvider');
  }
  return context;
}
