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
  | { type: 'SET_INITIAL_RENDER_COMPLETE' }
  | {
      type: 'ADD_PERSON_AND_UPDATE';
      payload: {
        person: PersonData;
        parentId: string;
        relationship: 'partner' | 'child';
      };
    }
  | { type: 'REMOVE_PERSON_AND_UPDATE'; payload: string };

// Initial configuration
const initialConfig: TreeConfig = {
  nodeSeparation: 400,
  levelSeparation: 300,
  singleParentEmptyCard: false,
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

        // Add bidirectional spouse relationship
        parent.rels.spouses.push(person.id);
        person.rels.spouses.push(parent.id);
      } else if (relationship === 'child') {
        // Initialize arrays if they don't exist
        if (!parent.rels.children) {
          parent.rels.children = [];
        }

        // Add parent-child relationship
        parent.rels.children.push(person.id);

        // Set parent reference based on gender
        if (parent.data.gender === 'M') {
          person.rels.father = parent.id;
        } else {
          person.rels.mother = parent.id;
        }
      }

      // Add the new person to the data
      updatedData.push(person);

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

      return {
        ...state,
        treeData,
        // If initial is true, set isInitialRender to true
        isInitialRender: action.payload?.initial === true,
      };
    }

    case 'SET_INITIAL_RENDER_COMPLETE':
      return {
        ...state,
        isInitialRender: false,
      };
    // Add these cases to your existing treeReducer function:
    case 'ADD_PERSON_AND_UPDATE': {
      const { person, parentId, relationship, otherParentId } = action.payload;
      const updatedData = JSON.parse(JSON.stringify(state.data));

      const parentIndex = updatedData.findIndex(p => p.id === parentId);
      if (parentIndex === -1) {
        return state;
      }

      const parent = updatedData[parentIndex];

      // Find other parent if specified
      let otherParent;
      if (otherParentId) {
        const otherParentIndex = updatedData.findIndex(
          p => p.id === otherParentId
        );
        if (otherParentIndex !== -1) {
          otherParent = updatedData[otherParentIndex];
        }
      }

      // Process relationship type
      if (relationship === 'partner') {
        // Handle spouse relationship - same as before
        if (!parent.rels.spouses) {
          parent.rels.spouses = [];
        }
        if (!person.rels.spouses) {
          person.rels.spouses = [];
        }
        parent.rels.spouses.push(person.id);
        person.rels.spouses.push(parent.id);
      } else if (relationship === 'child') {
        // Handle child relationship - now with other parent
        if (!parent.rels.children) {
          parent.rels.children = [];
        }
        parent.rels.children.push(person.id);

        // Set parent reference based on gender
        if (parent.data.gender === 'M') {
          person.rels.father = parent.id;

          // Add relationship with other parent if specified
          if (otherParent && otherParent.data.gender === 'F') {
            person.rels.mother = otherParent.id;
            if (!otherParent.rels.children) {
              otherParent.rels.children = [];
            }
            otherParent.rels.children.push(person.id);
          }
        } else {
          person.rels.mother = parent.id;

          // Add relationship with other parent if specified
          if (otherParent && otherParent.data.gender === 'M') {
            person.rels.father = otherParent.id;
            if (!otherParent.rels.children) {
              otherParent.rels.children = [];
            }
            otherParent.rels.children.push(person.id);
          }
        }
      }

      // Add the new person to the data
      updatedData.push(person);

      // Calculate tree
      const treeData = calculateTree({
        data: updatedData,
        main_id: state.mainId,
        node_separation: state.config.nodeSeparation,
        level_separation: state.config.levelSeparation,
        single_parent_empty_card: false, // Force to false here too
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
      // Copy your existing REMOVE_PERSON case logic here
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

        // ... other cleanup from your existing code
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

      // If we're removing the main person, find a new one
      let newMainId = state.mainId;
      if (state.mainId === personId && updatedData.length > 0) {
        newMainId = updatedData[0].id;
      }

      // Calculate the tree immediately
      const treeData = calculateTree({
        data: updatedData,
        main_id: newMainId,
        node_separation: state.config.nodeSeparation,
        level_separation: state.config.levelSeparation,
        single_parent_empty_card: state.config.singleParentEmptyCard,
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

  const updateTree = useCallback((props?: { initial?: boolean }) => {
    dispatch({ type: 'UPDATE_TREE', payload: props });
  }, []);

  const setInitialRenderComplete = useCallback(() => {
    dispatch({ type: 'SET_INITIAL_RENDER_COMPLETE' });
  }, []);

  // New methods for managing people
  const addPerson = useCallback(
    (
      person: PersonData,
      parentId: string,
      relationship: 'partner' | 'child',
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
