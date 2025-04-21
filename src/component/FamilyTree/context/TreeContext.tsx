// src/context/TreeContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react';
import { PersonData, TreeData, TreeConfig } from '../types/familyTree';
import { calculateTree } from '../utils/treeCalculator';

interface TreeState {
  data: PersonData[];
  mainId: string | null;
  config: TreeConfig;
  treeData: TreeData | null;
}

type TreeAction =
  | { type: 'UPDATE_MAIN_ID'; payload: string }
  | { type: 'UPDATE_DATA'; payload: PersonData[] }
  | { type: 'UPDATE_CONFIG'; payload: Partial<TreeConfig> }
  | { type: 'UPDATE_TREE'; payload?: { initial?: boolean } };

const initialConfig: TreeConfig = {
  nodeSeparation: 400, // Increased for larger cards
  levelSeparation: 300, // Increased for larger cards
  singleParentEmptyCard: true,
  isHorizontal: false,
  transitionTime: 1000,
  cardDimensions: {
    w: 300, // From Figma 300px
    h: 155, // From Figma 155px
    text_x: 20,
    text_y: 20,
    relationship_batch_w: 128, // From Figma 141px
    relationship_batch_h: 21, // From Figma 21px
    relationship_batch_x: 0, // Position it above the card
    relationship_batch_y: -25, // Position it above the card
  },
  showMiniTree: true,
  linkBreak: false,
  highlightHoverPath: true, // Default to true for path highlighting
  viewMode: false, // Default to edit mode
};

const initialState: TreeState = {
  data: [],
  mainId: null,
  config: initialConfig,
  treeData: null,
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
    case 'UPDATE_CONFIG': {
      const newConfig = {
        ...state.config,
        ...action.payload,
      };

      // Immediate tree update for critical config changes
      if (
        action.payload.isHorizontal !== undefined ||
        action.payload.nodeSeparation !== undefined ||
        action.payload.levelSeparation !== undefined ||
        action.payload.singleParentEmptyCard !== undefined
      ) {
        console.log('Critical config change - recalculating tree');

        return {
          ...state,
          config: newConfig,
          treeData: calculateTree({
            data: state.data,
            main_id: state.mainId,
            node_separation: newConfig.nodeSeparation,
            level_separation: newConfig.levelSeparation,
            single_parent_empty_card: newConfig.singleParentEmptyCard,
            is_horizontal: newConfig.isHorizontal,
          }),
        };
      }
      // Normal config change
      return {
        ...state,
        config: newConfig,
      };
    }
    // Update in TreeContext.tsx reducer:

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

  return (
    <TreeContext.Provider
      value={{
        state,
        updateMainId,
        updateData,
        updateConfig,
        updateTree,
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
