// src/types/familyTree.ts

export interface PersonData {
  id: string;
  data: {
    gender: 'M' | 'F' | '';
    firstName: string;
    lastName: string;
    dOB?: string;
    decDt?: string | null;
    deceased?: boolean | null;
    age?: number | null;
    city?: string | null;
    state?: string | null;
    address?: string | null;
    fileId?: number;
    heir?: boolean | null;
    research_inheritance?: boolean | null;
    is_new_notes?: boolean | null;
    [key: string]: any;
  };
  rels: {
    father?: string;
    mother?: string;
    spouses?: string[];
    children?: string[];
    _rels?: any; // For hidden relationships
  };
  main?: boolean;
  hide_rels?: boolean;
  to_add?: boolean;
  relation_type?: string; // For displaying relationship to file
  _new_rel_data?: {
    rel_type: 'father' | 'mother' | 'spouse' | 'son' | 'daughter';
    label: string;
    other_parent_id?: string;
  };
}

export interface TreeNode {
  data: PersonData;
  x: number; // X coordinate
  y: number; // Y coordinate
  _x?: number; // Entry/exit animation X coordinate
  _y?: number; // Entry/exit animation Y coordinate
  sx?: number; // Spouse connection X
  sy?: number; // Spouse connection Y
  psx?: number; // Parent-spouse X
  psy?: number; // Parent-spouse Y
  depth: number;
  spouse?: TreeNode;
  spouses?: TreeNode[];
  parents?: TreeNode[];
  children?: TreeNode[];
  is_ancestry?: boolean;
  added?: boolean;
  exiting?: boolean;
  all_rels_displayed?: boolean;
  parent?: TreeNode; // D3 hierarchy parent reference
}

export interface TreeLink {
  id: string;
  d: [number, number][] | ((d: any, i?: number) => [number, number][]);
  _d: () => [number, number][];
  curve: boolean;
  depth: number;
  is_ancestry?: boolean;
  spouse?: boolean;
  source: TreeNode | TreeNode[];
  target: TreeNode | TreeNode[];
}

export interface TreeDimensions {
  width: number;
  height: number;
  x_off: number;
  y_off: number;
}

export interface TreeData {
  data: TreeNode[];
  data_stash: PersonData[];
  dim: TreeDimensions;
  main_id: string | null;
  is_horizontal: boolean;
}

export interface TreeConfig {
  nodeSeparation: number;
  levelSeparation: number;
  singleParentEmptyCard: boolean;
  isHorizontal: boolean;
  transitionTime: number;
  cardDimensions: CardDimensions;
  showMiniTree: boolean;
  linkBreak: boolean;
}

export interface CardDimensions {
  w: number;
  h: number;
  text_x: number;
  text_y: number;
  relationship_batch_w: number;
  relationship_batch_h: number;
  relationship_batch_x: number;
  relationship_batch_y: number;
}
