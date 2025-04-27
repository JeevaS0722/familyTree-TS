// src/component/FamilyTree/components/FamilyTree/Card/types.ts
import { TreeNode, TreeData } from '../../types/familyTree';

export interface CardProps {
  node: TreeNode;
  cardDimensions?: { width: number; height: number };
  showMiniTree?: boolean;
  transitionTime?: number;
  treeData?: TreeData | null;
  initialRender?: boolean;
  onClick?: (node: TreeNode) => void;
  onMouseEnter?: (node: TreeNode) => void;
  onMouseLeave?: (node: TreeNode) => void;
  onPersonAdd?: (
    node: TreeNode,
    event: React.MouseEvent<HTMLDivElement>
  ) => void;
  onPersonDelete?: (personId: string) => void;
}

export interface RelationshipBadgeProps {
  relationshipType: string;
  isDeceased: boolean;
}

export interface CardHeaderProps {
  data: {
    displayName: string;
    personId: string;
    altNames: string[];
    titles: string[];
  };
  onPersonAdd?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onPersonDelete?: (personId: string) => void;
  cardWidth: number;
}

export interface LeftContainerState {
  isMale: boolean;
  age: string | number;
  birth: string;
  death: string;
  address: string;
  leftColumnWidth: number;
}
export interface LeftContainerProps {
  data: LeftContainerState;
}

export interface RightContainerState {
  contactId?: number | null;
  fileId?: number | null;
  isMale: boolean;
  divisionOfInterest: string;
  ownership: string;
  isDeceased: boolean;
  leftColumnWidth: number;
  offerIconHovered: boolean;
  setOfferIconHovered: (hovered: boolean) => void;
  offer: {
    offerId?: string | null;
    amount?: string | null;
    offer_type?: string | null;
    grantors?: string | null;
  };
}
export interface RightContainerProps {
  data: RightContainerState;
}

export interface CardFooterProps {
  arrowRotated: boolean;
  toggleNotesPanel: () => void;
}

export interface NotesPanelProps {
  node: TreeNode;
  cardDimensions: { w: number; h: number };
  showNotesPanel: boolean;
  notesPanelClosing: boolean;
  toggleNotesPanel: () => void;
  activeTab: 'list' | 'create';
  setActiveTab: (tab: 'list' | 'create') => void;
  notes: Note[];
  newNote: { type: string; content: string };
  setNewNote: (note: { type: string; content: string }) => void;
  isSaving: boolean;
  error: string | null;
  onSaveNote: () => void;
  onCancelCreate: () => void;
  isLoading: boolean;
}

export interface Note {
  id: string;
  type: string;
  content: string;
  createdBy: string;
  createdDate: string;
}
