// src/component/FamilyTree/components/FamilyTree/Card/types.ts
import { TreeNode, TreeData } from '../../../types/familyTree';

export interface CardProps {
  node: TreeNode;
  cardDimensions: {
    w: number;
    h: number;
    text_x: number;
    text_y: number;
    relationship_batch_w: number;
    relationship_batch_h: number;
    relationship_batch_x: number;
    relationship_batch_y: number;
  };
  showMiniTree: boolean;
  transitionTime: number;
  treeData: TreeData | null;
  onClick?: (node: TreeNode) => void;
  onEdit?: (node: TreeNode) => void;
  onMouseEnter?: (node: TreeNode) => void;
  onMouseLeave?: (node: TreeNode) => void;
  onAddChild?: (node: TreeNode) => void;
  onAddPartner?: (node: TreeNode) => void;
  onDelete?: (nodeId: string) => void;
  onUpdateRelationship?: (node: TreeNode, newType: string) => void;
  onPersonAdd?: (node: TreeNode) => void;
}

export interface RelationshipBadgeProps {
  node: TreeNode;
  isDeceased: boolean;
  position: { x: number; y: number };
  showRelationDropdown: boolean;
  setShowRelationDropdown: (show: boolean) => void;
  badgeHovered: boolean;
  setBadgeHovered: (hovered: boolean) => void;
  onRelationshipSelect: (relationship: string) => void;
}

export interface CardHeaderProps {
  node: TreeNode;
  cardDimensions: { w: number; h: number };
  isDeceased: boolean;
  headerHovered: boolean;
  setHeaderHovered: (hovered: boolean) => void;
  onCardClick: () => void;
  onAddClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
}

export interface CardBodyProps {
  node: TreeNode;
  cardDimensions: { w: number; h: number };
  colors: { primary: string; secondary: string };
  isDeceased: boolean;
  showCountyOfDeath: boolean;
  hasNotes: boolean;
  contactId: number | undefined;
  fileId: number | undefined;
  offerAmount: string;
  showOfferPopup: boolean;
  setShowOfferPopup: (show: boolean) => void;
}

export interface BottomBarProps {
  cardDimensions: { w: number; h: number };
  arrowRotated: boolean;
  notesPanelClosing: boolean;
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
