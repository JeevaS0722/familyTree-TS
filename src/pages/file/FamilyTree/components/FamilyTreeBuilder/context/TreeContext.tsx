/* eslint-disable max-depth */
/* eslint-disable complexity */
// src/component/FamilyTree/context/TreeContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
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
        relationship: 'partner' | 'child';
      };
    }
  | { type: 'REMOVE_PERSON'; payload: string }
  | { type: 'UPDATE_CONFIG'; payload: Partial<TreeConfig> }
  | { type: 'UPDATE_TREE'; payload?: { initial?: boolean } }
  | { type: 'SET_INITIAL_RENDER_COMPLETE' };

// Initial configuration
const initialConfig: TreeConfig = {
  nodeSeparation: 400,
  levelSeparation: 300,
  singleParentEmptyCard: true,
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

// Enhanced reducer that handles orientation changes properly
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
      const { person, parentId, relationship } = action.payload;
      // Create a deep copy to avoid mutation
      const updatedData = JSON.parse(JSON.stringify(state.data));

      // Find parent in the data
      const parentIndex = updatedData.findIndex(
        (p: PersonData) => p.id === parentId
      );
      if (parentIndex === -1) {
        console.error(`Parent with ID ${parentId} not found`);
        return state;
      }

      const parent = updatedData[parentIndex];

      // Process relationships based on type
      if (relationship === 'partner') {
        // Initialize arrays if they don't exist
        if (!parent.rels.spouses) {
          parent.rels.spouses = [];
        }
        if (!person.rels.spouses) {
          person.rels.spouses = [];
        }

        // Avoid duplicate relationships
        if (!parent.rels.spouses.includes(person.id)) {
          parent.rels.spouses.push(person.id);
        }

        if (!person.rels.spouses.includes(parent.id)) {
          person.rels.spouses.push(parent.id);
        }
      } else if (relationship === 'child') {
        // Initialize arrays if they don't exist
        if (!parent.rels.children) {
          parent.rels.children = [];
        }

        // Avoid duplicate children
        if (!parent.rels.children.includes(person.id)) {
          parent.rels.children.push(person.id);
        }

        // Set parent reference based on gender
        if (parent.data.gender === 'M') {
          // If child already has a father, consider if we should replace it
          if (person.rels.father && person.rels.father !== parent.id) {
            console.warn(
              `Child already has a father (${person.rels.father}), replacing with ${parent.id}`
            );

            // Optional: Clean up previous father-child relationship
            const oldFatherIndex = updatedData.findIndex(
              p => p.id === person.rels.father
            );
            if (
              oldFatherIndex !== -1 &&
              updatedData[oldFatherIndex].rels.children
            ) {
              updatedData[oldFatherIndex].rels.children = updatedData[
                oldFatherIndex
              ].rels.children.filter(id => id !== person.id);
            }
          }
          person.rels.father = parent.id;
        } else {
          // If child already has a mother, consider if we should replace it
          if (person.rels.mother && person.rels.mother !== parent.id) {
            console.warn(
              `Child already has a mother (${person.rels.mother}), replacing with ${parent.id}`
            );

            // Optional: Clean up previous mother-child relationship
            const oldMotherIndex = updatedData.findIndex(
              p => p.id === person.rels.mother
            );
            if (
              oldMotherIndex !== -1 &&
              updatedData[oldMotherIndex].rels.children
            ) {
              updatedData[oldMotherIndex].rels.children = updatedData[
                oldMotherIndex
              ].rels.children.filter(id => id !== person.id);
            }
          }
          person.rels.mother = parent.id;
        }
      }
      // If this person already exists in the data, update it instead of adding
      const existingPersonIndex = updatedData.findIndex(
        p => p.id === person.id
      );
      if (existingPersonIndex !== -1) {
        updatedData[existingPersonIndex] = person;
      } else {
        // Add the new person to the data
        updatedData.push(person);
      }

      return {
        ...state,
        data: updatedData,
      };
    }

    case 'REMOVE_PERSON': {
      const personId = action.payload;
      // Create a deep copy without the removed person
      const updatedData = JSON.parse(
        JSON.stringify(state.data.filter(p => p.id !== personId))
      );

      // Clean up all references to this person
      updatedData.forEach((person: PersonData) => {
        if (person.rels.spouses) {
          person.rels.spouses = person.rels.spouses.filter(
            id => id !== personId
          );
          // Clean up empty arrays
          if (person.rels.spouses.length === 0) {
            delete person.rels.spouses;
          }
        }

        if (person.rels.children) {
          person.rels.children = person.rels.children.filter(
            id => id !== personId
          );
          // Clean up empty arrays
          if (person.rels.children.length === 0) {
            delete person.rels.children;
          }
        }

        // Remove parent references
        if (person.rels.father === personId) {
          delete person.rels.father;
        }

        if (person.rels.mother === personId) {
          delete person.rels.mother;
        }
      });

      // If we're removing the main person, find a new one
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

      // Critical config changes requiring immediate tree recalculation
      if (
        action.payload.isHorizontal !== undefined ||
        action.payload.nodeSeparation !== undefined ||
        action.payload.levelSeparation !== undefined ||
        action.payload.singleParentEmptyCard !== undefined
      ) {
        console.log('Critical config change - recalculating tree');

        // Calculate new tree with updated config
        const newTreeData = calculateTree({
          data: state.data,
          main_id: state.mainId,
          node_separation: newConfig.nodeSeparation,
          level_separation: newConfig.levelSeparation,
          single_parent_empty_card: newConfig.singleParentEmptyCard,
          is_horizontal: newConfig.isHorizontal,
        });

        return {
          ...state,
          config: newConfig,
          treeData: newTreeData,
          // Set isInitialRender to false to prevent initial animation
          isInitialRender: false,
        };
      }

      // Regular config changes that don't require tree recalculation
      return {
        ...state,
        config: newConfig,
      };
    }

    case 'UPDATE_TREE': {
      return {
        ...state,
        treeData: action.payload.treeData,
        isInitialRender: action.payload.initial === true,
      };
    }

    case 'SET_INITIAL_RENDER_COMPLETE':
      return {
        ...state,
        isInitialRender: false,
      };

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
  // New methods for managing people
  addPerson: (
    person: PersonData,
    parentId: string,
    relationship: 'partner' | 'child'
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

  const pendingUpdateRef = useRef(false);
  const updateTree = useCallback(
    (props?: { initial?: boolean }) => {
      // Use useRef to track if an update is already pending
      if (pendingUpdateRef.current) {
        return; // Avoid multiple calculations in the same tick
      }

      pendingUpdateRef.current = true;

      // Use requestAnimationFrame instead of setTimeout for better performance
      requestAnimationFrame(() => {
        try {
          console.log('Calculating tree layout');

          // Calculate new tree layout
          const treeData = calculateTree({
            data: state.data,
            main_id: state.mainId,
            node_separation: state.config.nodeSeparation,
            level_separation: state.config.levelSeparation,
            single_parent_empty_card: state.config.singleParentEmptyCard,
            is_horizontal: state.config.isHorizontal,
          });

          console.log('Tree layout calculated with dimensions:', treeData.dim);

          // Update state with new tree data
          dispatch({
            type: 'UPDATE_TREE',
            payload: {
              treeData,
              initial: props?.initial === true,
            },
          });
        } catch (error) {
          console.error('Error calculating tree layout:', error);
        } finally {
          pendingUpdateRef.current = false;
        }
      });
    },
    [state.data, state.mainId, state.config]
  );

  const setInitialRenderComplete = useCallback(() => {
    dispatch({ type: 'SET_INITIAL_RENDER_COMPLETE' });
  }, []);

  // New methods for managing people
  const addPerson = useCallback(
    (
      person: PersonData,
      parentId: string,
      relationship: 'partner' | 'child'
    ) => {
      dispatch({
        type: 'ADD_PERSON',
        payload: { person, parentId, relationship },
      });
      // Re-calculate tree after adding the person
      setTimeout(() => updateTree(), 0);
    },
    [updateTree]
  );

  const removePerson = useCallback(
    (personId: string) => {
      dispatch({ type: 'REMOVE_PERSON', payload: personId });
      // Re-calculate tree after removing the person
      setTimeout(() => updateTree(), 0);
    },
    [updateTree]
  );

  // Initialize tree on component mount
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
