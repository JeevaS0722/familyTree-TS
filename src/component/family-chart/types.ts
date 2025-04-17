// Types for family-chart

// NewPerson related types
export interface NewPersonOptions {
  data?: PersonData;
  rels?: Relation;
}

export interface NewPersonWithGenderOptions {
  data?: PersonData;
  rel_type: string;
  rel_datum: Datum;
}

export interface HandleNewRelOptions {
  datum: Datum;
  new_rel_datum: Datum;
  data_stash: Datum[];
}

export interface HandleRelsOptions {
  datum: Datum;
  data_stash: Datum[];
  rel_type: string;
  rel_datum: Datum;
}

export interface AddNewPersonOptions {
  data_stash: Datum[];
  datum: Datum;
}

export interface CreateTreeDataOptions {
  data: PersonData;
  version?: string;
}

export interface AddNewPersonAndHandleRelsOptions {
  datum: Datum;
  data_stash: Datum[];
  rel_type: string;
  rel_datum: Datum;
}

// Form related types
export interface FormField {
  id: string;
  type: string;
  label: string;
  initial_value?: string;
  options?: Array<{ value: string; label: string }>;
}

export interface FormCreator {
  fields: FormField[];
  gender_field: FormField;
  onSubmit: (e: Event) => void;
  onDelete?: () => void;
  addRelative?: (datum: Datum) => void;
  addRelativeCancel?: () => void;
  addRelativeActive?: boolean;
  can_delete?: boolean;
  editable: boolean;
  title?: string;
  new_rel?: boolean;
  no_edit?: boolean;
  onCancel?: () => void;
  other_parent_field?: {
    id: string;
    label: string;
    initial_value: string;
    options: Array<{ value: string; label: string }>;
  };
}

export interface FormCreationOptions {
  datum: Datum;
  store: Store;
  fields: Field[];
  postSubmit: (props?: any) => void;
  addRelative?: any;
  deletePerson?: () => void;
  onCancel?: () => void;
  editFirst?: boolean;
  card_display?: any;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

// EditTree related types
export interface EditTreeOptions {
  cont: HTMLElement;
  store: Store;
}

export interface HistoryControls {
  back_btn: HTMLButtonElement;
  forward_btn: HTMLButtonElement;
  updateButtons: () => void;
  destroy: () => void;
}

export interface History {
  changed: () => void;
  back: () => void;
  forward: () => void;
  canForward: () => boolean;
  canBack: () => boolean;
  controls?: HistoryControls;
}

export interface Field {
  type: string;
  label: string;
  id: string;
}

export interface EditTree {
  cont: HTMLElement;
  store: Store;
  fields: Field[];
  form_cont: HTMLElement | null;
  is_fixed: boolean;
  history: History | null;
  no_edit: boolean;
  onChange: ((data?: any) => void) | null;
  editFirst: boolean;
  addRelativeInstance: AddRelative;
  card_display?: any;
  init: () => void;
  open: (datum: any) => void;
  openWithoutRelCancel: (datum: any) => void;
  cardEditForm: (datum: any) => void;
  openForm: () => void;
  closeForm: () => void;
  fixed: () => EditTree;
  absolute: () => EditTree;
  setCardClickOpen: (card: any) => EditTree;
  openFormWithId: (d_id: string | null) => void;
  createHistory: () => EditTree;
  setNoEdit: () => EditTree;
  setEdit: () => EditTree;
  setFields: (fields: Array<string | Field>) => EditTree;
  setOnChange: (fn: (data?: any) => void) => EditTree;
  addRelative: (datum?: Datum) => EditTree;
  setupAddRelative: () => AddRelative;
  setEditFirst: (editFirst: boolean) => EditTree;
  isAddingRelative: () => boolean;
  setAddRelLabels: (add_rel_labels: Partial<AddRelativeLabels>) => EditTree;
  getStoreData: () => Datum[];
  getDataJson: () => string;
  updateHistory: () => void;
  destroy: () => EditTree;
}

// AddRelative related types
export interface AddRelativeLabels {
  father: string;
  mother: string;
  spouse: string;
  son: string;
  daughter: string;
  [key: string]: string;
}

export interface NewRelData {
  rel_type: string;
  label: string;
  other_parent_id?: string;
}

export interface AddRelative {
  store: Store;
  cancelCallback: (datum: Datum) => void;
  onSubmitCallback: (datum: Datum, new_rel_datum: Datum) => void;
  datum: Datum | null;
  onChange: ((updated_datum: Datum) => void) | null;
  onCancel: (() => void) | null;
  is_active: boolean;
  store_data: Datum[] | null;
  addRelLabels: AddRelativeLabels;
  activate: (datum: Datum) => void;
  setAddRelLabels: (add_rel_labels: Partial<AddRelativeLabels>) => AddRelative;
  addRelLabelsDefault: () => AddRelativeLabels;
  getStoreData: () => Datum[] | null;
}

// Link related types
export interface LinkPosition {
  x: number;
  y: number;
}

export interface LinkData {
  d:
    | Array<[number, number]>
    | ((d1: LinkPosition, d2: LinkPosition) => Array<[number, number]>);
  _d: () => Array<[number, number]>;
  curve: boolean;
  id: string;
  depth: number;
  spouse?: boolean;
  is_ancestry: boolean;
  source: TreeNode | TreeNode[];
  target: TreeNode | TreeNode[];
}

export interface CreateLinksOptions {
  d: TreeNode;
  tree: TreeNode[];
  is_horizontal?: boolean;
}

export interface CardNodePair {
  card: TreeNode;
  node: Element;
}

export interface LinkNodePair {
  link: LinkData;
  node: Element;
}

// CalculateTree related types
export interface HierarchyNode extends d3.HierarchyNode<Datum> {
  x: number;
  y: number;
  children?: HierarchyNode[];
  parent?: HierarchyNode;
  data: Datum;
  depth: number;
}

// CalculateTree handlers related types
export interface ToggleRelsOptions {
  tree_datum: TreeNode;
  hide_rels: boolean;
}

// Chart related types
export interface CreateChartOptions {
  cont: HTMLElement | string;
  data: Datum[];
}

export interface ChartUpdateProps {
  initial?: boolean;
  [key: string]: any;
}

export interface CardDimensions {
  w?: number;
  h?: number;
  text_x?: number;
  text_y?: number;
  img_w?: number;
  img_h?: number;
  img_x?: number;
  img_y?: number;
  [key: string]: any;
}

export interface Card {
  getCard: () => any;
  setCardDisplay: (card_display: any) => Card;
  setCardDim: (card_dim: Partial<CardDimensions>) => Card;
  setOnCardClick: (onCardClick: (e: MouseEvent, d: TreeNode) => void) => Card;
  resetCardDim?: () => Card;
  setMiniTree: (mini_tree: boolean) => Card;
  setStyle?: (style: string) => Card;
  setLinkBreak?: (link_break: boolean) => Card;
  setOnHoverPathToMain?: () => Card;
  unsetOnHoverPathToMain?: () => Card;
  setOnCardUpdate?: (onCardUpdate: (d: TreeNode) => void) => Card;
  setCardTextSvg?: (cardTextSvg: (d: Datum) => string) => Card;
  onCardClickDefault: (e: MouseEvent, d: TreeNode) => void;
  [key: string]: any;
}

export interface EditTreeInstance {
  addRelativeInstance: {
    is_active: boolean;
    onCancel: () => void;
  };
  [key: string]: any;
}

export interface Relation {
  father?: string;
  mother?: string;
  spouses?: string[];
  children?: string[];
  [key: string]: any;
}

export interface PersonData {
  gender?: 'M' | 'F';
  [key: string]: any;
}

export interface Datum {
  id: string;
  data: PersonData;
  rels: Relation;
  main?: boolean;
  to_add?: boolean;
  hide_rels?: boolean;
  _new_rel_data?: {
    rel_type: string;
    label: string;
    other_parent_id?: string;
  };
  _rels?: Relation;
}

export interface TreeDimension {
  width: number;
  height: number;
  x_off: number;
  y_off: number;
}

export interface TreeNode {
  data: Datum;
  x: number;
  y: number;
  _x?: number;
  _y?: number;
  depth: number;
  is_ancestry?: boolean;
  spouse?: TreeNode;
  spouses?: TreeNode[];
  parent?: TreeNode;
  parents?: TreeNode[];
  children?: TreeNode[];
  all_rels_displayed?: boolean;
  added?: boolean;
  sx?: number;
  sy?: number;
  psx?: number;
  psy?: number;
  exiting?: boolean;
}

export interface Tree {
  data: TreeNode[];
  data_stash: Datum[];
  dim: TreeDimension;
  main_id: string | null;
  is_horizontal: boolean;
}

export interface UpdateProps {
  initial?: boolean;
  transition_time?: number;
  tree_position?: string;
  cardHtml?: HTMLElement;
  cardComponent?: HTMLElement;
  scale?: number;
  [key: string]: any;
}

export interface StoreState {
  data: Datum[];
  main_id?: string;
  main_id_history: string[];
  tree?: Tree;
  node_separation?: number;
  level_separation?: number;
  single_parent_empty_card?: boolean;
  single_parent_empty_card_label?: string;
  is_horizontal?: boolean;
}

export interface Store {
  state: StoreState;
  updateTree: (props?: UpdateProps) => void;
  updateData: (data: Datum[]) => void;
  updateMainId: (id: string) => void;
  getMainId: () => string | undefined;
  getData: () => Datum[];
  getTree: () => Tree | undefined;
  setOnUpdate: (f: (props?: UpdateProps) => void) => void;
  getMainDatum: () => Datum | undefined;
  getDatum: (id: string) => Datum | undefined;
  getTreeMainDatum: () => TreeNode | null;
  getTreeDatum: (id: string) => TreeNode | undefined;
  getLastAvailableMainDatum: () => Datum;
  methods: { [key: string]: any };
}

export interface CalculateTreeProps {
  data: Datum[];
  main_id?: string | null;
  node_separation?: number;
  level_separation?: number;
  single_parent_empty_card?: boolean;
  is_horizontal?: boolean;
}
