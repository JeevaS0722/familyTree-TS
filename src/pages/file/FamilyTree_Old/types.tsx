// src/components/FamilyTree/types.ts
export interface Person {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  age?: string;
  birthDate?: string;
  deathDate?: string;
  address?: string;
  countyOfDeath?: string;
  divisionOfInterest?: string;
  percentage?: string;
  relationshipType?: string;
  isSelected?: boolean;
  isDeceased?: boolean;
  isNewNotes?: boolean; // New property to indicate if there are notes/tasks
}

export interface FamilyMember extends Person {
  // Core relationship properties
  children?: FamilyMember[] | Record<string, FamilyMember[]>; // Direct children of this member (can be array or object)
  partner?: FamilyMember; // Current partner (for backward compatibility)
  partners?: FamilyMember[]; // All partners (current and past)

  // Reference properties for bidirectional traversal
  parentId?: string; // ID of the parent node
  isPartnerOf?: string; // ID of the primary partner (if this is a secondary partner)
  childrenRefs?: string[]; // References to children IDs (for non-primary parents)

  // Complex relationship tracking
  level?: number; // Level in the tree hierarchy
  partnerChildrenMap?: Record<string, string[]>; // Maps partner IDs to child IDs for complex cases

  // Layout properties
  x?: number; // X coordinate for positioning
  y?: number; // Y coordinate for positioning
  collapsed?: boolean; // Whether this node's children are hidden
  leftNeighborId?: string; // ID of the left neighbor for layout optimization
  rightNeighborId?: string; // ID of the right neighbor for layout optimization

  // Reference properties for data integration
  fileId?: string | number; // ID of the file this member belongs to
  contactId?: string | number; // ID of the contact this member is associated with
  originalContact?: any; // Original contact data reference
}

export interface NodePosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Constants for layout calculations
export const CARD_WIDTH = 300;
export const CARD_HEIGHT = 176;
export const VERTICAL_SPACING = 200; // Space between parent and children
export const HORIZONTAL_SPACING = 40; // Space between siblings
export const PARTNER_SPACING = 30; // Space between partners
export const MIN_LEVEL_WIDTH = 800; // Minimum width for any level

// Colors from Figma
export const COLORS = {
  deceased: '#FF0000',
  filenameBox: '#FFFFFF',
  maleLeft: '#7EADFF',
  maleRight: '#C8DCFF',
  femaleLeft: '#FF96BC',
  femaleRight: '#FFC8DC',
  bottomArrowContainer: '#D9D9D9',
  relationshipBadge: '#D9D9D9',
  text: '#000000',
  connection: '#2E7D32', // Changed to a green color for better visibility
  selectionHighlight: '#FFC107',
};
