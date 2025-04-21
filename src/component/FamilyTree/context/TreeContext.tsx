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

  // Initialize tree on component mount
  useEffect(() => {
    if (initialData && initialData.length > 0 && !state.treeData) {
      updateTree({ initial: true });
    }
  }, []);

  return (
    <TreeContext.Provider
      value={{
        state,
        updateMainId,
        updateData,
        updateConfig,
        updateTree,
        setInitialRenderComplete,
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
