// src/types/index.ts
import * as d3 from 'd3';

export interface PersonData {
  [key: string]: any;
  gender?: 'M' | 'F' | string;
  'first name'?: string;
  'last name'?: string;
  birthday?: string;
  avatar?: string;
}

export interface PersonRelations {
  father?: string;
  mother?: string;
  children?: string[];
  spouses?: string[];
  [key: string]: any;
}

export interface Person {
  id: string;
  data: PersonData;
  rels: PersonRelations;
  _rels?: PersonRelations;
  main?: boolean;
  hide_rels?: boolean;
  to_add?: boolean;
  _new_rel_data?: {
    rel_type: 'father' | 'mother' | 'spouse' | 'son' | 'daughter';
    label: string;
    other_parent_id?: string;
  };
}

export interface TreePerson extends d3.HierarchyNode<Person> {
  x: number;
  y: number;
  _x?: number;
  _y?: number;
  sx?: number;
  sy?: number;
  psx?: number;
  psy?: number;
  depth: number;
  is_ancestry?: boolean;
  spouse?: TreePerson;
  spouses?: TreePerson[];
  children?: TreePerson[];
  parents?: TreePerson[];
  parent?: TreePerson;
  data: Person;
  added?: boolean;
  exiting?: boolean;
  all_rels_displayed?: boolean;
}

export interface TreeDimensions {
  width: number;
  height: number;
  x_off: number;
  y_off: number;
}

export interface CalculatedTree {
  data: TreePerson[];
  dim: TreeDimensions;
  main_id: string;
  data_stash: Person[];
  is_horizontal: boolean;
}

export interface CardDimensions {
  w: number;
  h: number;
  text_x: number;
  text_y: number;
  img_w: number;
  img_h: number;
  img_x: number;
  img_y: number;
  height_auto?: boolean;
  [key: string]: number | boolean | undefined;
}

export interface StoreState {
  data: Person[];
  main_id: string | null;
  main_id_history: string[];
  node_separation: number;
  level_separation: number;
  tree?: CalculatedTree;
  single_parent_empty_card: boolean;
  single_parent_empty_card_label?: string;
  is_horizontal: boolean;
  tree_fit_on_change?: boolean;
  [key: string]: any;
}

export interface Store {
  state: StoreState;
  updateTree: (props?: { [key: string]: any }) => void;
  updateData: (data: Person[]) => void;
  updateMainId: (id: string | null) => void;
  getMainId: () => string | null;
  getData: () => Person[];
  getTree: () => CalculatedTree | undefined;
  setOnUpdate: (f: (props?: { [key: string]: any }) => void) => void;
  getMainDatum: () => Person | undefined;
  getDatum: (id: string) => Person | undefined;
  getTreeMainDatum: () => TreePerson | null;
  getTreeDatum: (id: string) => TreePerson | null;
  getLastAvailableMainDatum: () => Person;
  methods?: { [key: string]: any };
}

export interface LinkData {
  id: string;
  d: any;
  _d: () => any;
  curve?: boolean;
  depth: number;
  is_ancestry?: boolean;
  spouse?: boolean;
  source: TreePerson | TreePerson[];
  target: TreePerson | TreePerson[];
}

export interface CardProps {
  store: Store;
  svg?: SVGSVGElement;
  card_dim: CardDimensions;
  card_display: ((d: Person) => string)[];
  mini_tree?: boolean;
  link_break?: boolean;
  onCardClick?: (e: MouseEvent, d: TreePerson) => void;
  onCardUpdate?: (d: TreePerson) => void;
  onCardUpdates?: ((d: TreePerson) => void)[];
  addRelative?: (params: { d: TreePerson }) => void;
  cardEditForm?: any;
  img?: boolean;
  onMiniTreeClick?: (e: MouseEvent, d: TreePerson) => void;
  empty_card_label?: string;
  onCardMouseenter?: (e: MouseEvent, d: TreePerson) => void;
  onCardMouseleave?: (e: MouseEvent, d: TreePerson) => void;
}

export interface ViewProps {
  transition_time?: number;
  initial?: boolean;
  cardHtml?: HTMLDivElement;
  cardComponent?: HTMLDivElement;
  tree_position?: 'fit' | 'main_to_middle' | 'inherit';
  scale?: number;
}

export interface CreateChartOptions {
  cont: HTMLElement | string;
  data: Person[];
}

export interface CardInterface {
  is_html?: boolean;
  getCard: () => (d: TreePerson) => void;
  setCardDisplay: (card_display: any) => CardInterface;
  setCardDim: (card_dim: Partial<CardDimensions>) => CardInterface;
  setOnCardClick: (
    onCardClick: (e: MouseEvent, d: TreePerson) => void
  ) => CardInterface;
  resetCardDim?: () => CardInterface;
  setMiniTree: (mini_tree: boolean) => CardInterface;
  setStyle?: (style: string) => CardInterface;
  setLinkBreak?: (link_break: boolean) => CardInterface;
  setOnHoverPathToMain?: () => CardInterface;
  unsetOnHoverPathToMain?: () => CardInterface;
  setOnCardUpdate?: (onCardUpdate: (d: TreePerson) => void) => CardInterface;
  setCardTextSvg?: (cardTextSvg: (d: Person) => string) => CardInterface;
  onCardClickDefault: (e: MouseEvent, d: TreePerson) => void;
}

export interface CreateChartInterface {
  cont: HTMLElement | null;
  store: Store | null;
  svg: SVGSVGElement | null;
  getCard: (() => (d: TreePerson) => void) | null;
  node_separation: number;
  level_separation: number;
  is_horizontal: boolean;
  single_parent_empty_card: boolean;
  transition_time: number;
  is_card_html: boolean;
  beforeUpdate: ((props?: any) => void) | null;
  afterUpdate: ((props?: any) => void) | null;

  init: (cont: HTMLElement | string, data: Person[]) => void;
  updateTree: (props?: { initial?: boolean }) => CreateChartInterface;
  updateData: (data: Person[]) => CreateChartInterface;
  setCardYSpacing: (card_y_spacing: number) => CreateChartInterface;
  setCardXSpacing: (card_x_spacing: number) => CreateChartInterface;
  setOrientationVertical: () => CreateChartInterface;
  setOrientationHorizontal: () => CreateChartInterface;
  setSingleParentEmptyCard: (
    single_parent_empty_card: boolean,
    options?: { label?: string }
  ) => CreateChartInterface;
  setCard: <T extends CardInterface>(
    Card: (cont: HTMLElement, store: Store) => T
  ) => T;
  setTransitionTime: (transition_time: number) => CreateChartInterface;
  editTree: () => any;
  updateMain: (d: TreePerson) => CreateChartInterface;
  updateMainId: (id: string) => CreateChartInterface;
  getMainDatum: () => Person | undefined;
  getDataJson: () => string;
  setBeforeUpdate: (fn: (props?: any) => void) => CreateChartInterface;
  setAfterUpdate: (fn: (props?: any) => void) => CreateChartInterface;
  editTreeInstance?: any;
}
