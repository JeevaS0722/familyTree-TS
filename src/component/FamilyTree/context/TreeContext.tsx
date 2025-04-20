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
  nodeSeparation: 250,
  levelSeparation: 150,
  singleParentEmptyCard: true,
  isHorizontal: false,
  transitionTime: 2000,
  cardDimensions: {
    w: 220,
    h: 70,
    text_x: 75,
    text_y: 15,
    img_w: 60,
    img_h: 60,
    img_x: 5,
    img_y: 5,
  },
  showMiniTree: true,
  linkBreak: false,
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
    case 'UPDATE_CONFIG':
      return {
        ...state,
        config: {
          ...state.config,
          ...action.payload,
        },
      };
    case 'UPDATE_TREE':
      return {
        ...state,
        treeData: calculateTree({
          data: state.data,
          main_id: state.mainId,
          node_separation: state.config.nodeSeparation,
          level_separation: state.config.levelSeparation,
          single_parent_empty_card: state.config.singleParentEmptyCard,
          is_horizontal: state.config.isHorizontal,
        }),
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
