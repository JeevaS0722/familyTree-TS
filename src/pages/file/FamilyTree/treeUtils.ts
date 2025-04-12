// src/components/FamilyTree/utils.ts
import {
  FamilyMember,
  CARD_WIDTH,
  CARD_HEIGHT,
  HORIZONTAL_SPACING,
  PARTNER_SPACING,
  VERTICAL_SPACING,
} from './types';

/**
 * Find member by ID with improved circular reference protection
 */
export const findMemberById = (
  root: FamilyMember,
  id: string,
  visited: Set<string> = new Set()
): FamilyMember | null => {
  // Prevent infinite loops with circular references
  if (visited.has(root.id)) {
    return null;
  }
  visited.add(root.id);

  if (root.id === id) {
    return root;
  }

  // Check partner
  if (root.partner && root.partner.id === id) {
    return root.partner;
  }

  // Check multiple partners if available
  if (root.partners) {
    for (const partner of root.partners) {
      if (partner.id === id) {
        return partner;
      }
    }
  }

  // Check children recursively
  if (root.children) {
    for (const child of root.children) {
      const found = findMemberById(child, id, visited);
      if (found) {
        return found;
      }
    }
  }

  // Check partner's children if they exist separately
  if (root.partner && root.partner.children) {
    for (const child of root.partner.children) {
      if (!root.children?.some(c => c.id === child.id)) {
        // Avoid duplicates
        const found = findMemberById(child, id, visited);
        if (found) {
          return found;
        }
      }
    }
  }

  return null;
};

/**
 * Update member by ID with improved relationship preservation
 */
export const updateMemberById = (
  root: FamilyMember,
  updatedMember: FamilyMember,
  visited: Set<string> = new Set()
): boolean => {
  // Prevent infinite loops with circular references
  if (visited.has(root.id)) {
    return false;
  }
  visited.add(root.id);

  if (root.id === updatedMember.id) {
    // Save references to preserve relationships
    const preserveFields = {
      children: root.children,
      partner: root.partner,
      partners: root.partners,
      partnerChildrenMap: root.partnerChildrenMap,
      childrenRefs: root.childrenRefs,
      parentId: root.parentId,
      isPartnerOf: root.isPartnerOf,
    };

    // Update the member data
    Object.assign(root, updatedMember);

    // Restore relationship fields if not explicitly changed
    Object.entries(preserveFields).forEach(([key, value]) => {
      if (value !== undefined && (updatedMember as any)[key] === undefined) {
        (root as any)[key] = value;
      }
    });

    return true;
  }

  // Check current partner
  if (root.partner && root.partner.id === updatedMember.id) {
    // Preserve relationship fields
    const preserveFields = {
      children: root.partner.children,
      partner: root.partner.partner,
      partners: root.partner.partners,
      childrenRefs: root.partner.childrenRefs,
      parentId: root.partner.parentId,
      isPartnerOf: root.partner.isPartnerOf,
    };

    Object.assign(root.partner, updatedMember);

    // Restore relationship fields
    Object.entries(preserveFields).forEach(([key, value]) => {
      if (value !== undefined && (updatedMember as any)[key] === undefined) {
        (root.partner as any)[key] = value;
      }
    });

    return true;
  }

  // Check multiple partners if available
  if (root.partners) {
    for (let i = 0; i < root.partners.length; i++) {
      if (root.partners[i].id === updatedMember.id) {
        // Preserve relationship fields
        const preserveFields = {
          children: root.partners[i].children,
          partner: root.partners[i].partner,
          partners: root.partners[i].partners,
          childrenRefs: root.partners[i].childrenRefs,
          parentId: root.partners[i].parentId,
          isPartnerOf: root.partners[i].isPartnerOf,
        };

        Object.assign(root.partners[i], updatedMember);

        // Restore relationship fields
        Object.entries(preserveFields).forEach(([key, value]) => {
          if (
            value !== undefined &&
            (updatedMember as any)[key] === undefined
          ) {
            (root.partners[i] as any)[key] = value;
          }
        });

        return true;
      }
    }
  }

  // Check children recursively
  if (root.children) {
    for (const child of root.children) {
      if (updateMemberById(child, updatedMember, visited)) {
        return true;
      }
    }
  }

  // Check partner's children if they exist separately
  if (root.partner && root.partner.children) {
    for (const child of root.partner.children) {
      if (!root.children?.some(c => c.id === child.id)) {
        // Avoid duplicates
        if (updateMemberById(child, updatedMember, visited)) {
          return true;
        }
      }
    }
  }

  return false;
};

/**
 * Get all family members as a flat array with enhanced circular reference protection
 */
// Updated getAllMembers function that correctly handles both array and object formats for children

export const getAllMembers = (
  root: FamilyMember,
  level = 0,
  result: FamilyMember[] = [],
  visited: Set<string> = new Set()
): FamilyMember[] => {
  console.log('getAllMembers:', root, level, result, visited);
  // Prevent infinite loops
  if (visited.has(root.id)) {
    return result;
  }
  visited.add(root.id);

  // Add the root member with its level
  const rootWithLevel = { ...root, level };
  result.push(rootWithLevel);

  // Add current partner if exists
  if (root.partner && !visited.has(root.partner.id)) {
    visited.add(root.partner.id);
    const partnerWithLevel = { ...root.partner, level };
    result.push(partnerWithLevel);

    // Only process partner's children that aren't already processed
    if (root.partner.children) {
      processChildren(
        root.partner.children,
        level + 1,
        result,
        visited,
        root.children
      );
    }
  }

  // Add all past partners if available
  if (root.partners) {
    for (const partner of root.partners) {
      if (!visited.has(partner.id)) {
        visited.add(partner.id);
        const partnerWithLevel = { ...partner, level };
        result.push(partnerWithLevel);

        // Only process partner's children that aren't already processed
        if (partner.children) {
          processChildren(
            partner.children,
            level + 1,
            result,
            visited,
            root.children
          );
        }
      }
    }
  }

  // Process children (handles both array and object formats)
  if (root.children) {
    processChildren(root.children, level + 1, result, visited);
  }

  return result;
};

// Helper function to process children in either format
const processChildren = (
  children: FamilyMember[] | Record<string, FamilyMember[]>,
  level: number,
  result: FamilyMember[],
  visited: Set<string>,
  skipChildren?: FamilyMember[] | Record<string, FamilyMember[]>
) => {
  // If children is an array, process each child
  if (Array.isArray(children)) {
    for (const child of children) {
      // Skip if this child is in skipChildren
      if (
        skipChildren &&
        ((Array.isArray(skipChildren) &&
          skipChildren.some(c => c.id === child.id)) ||
          (!Array.isArray(skipChildren) &&
            Object.values(skipChildren)
              .flat()
              .some(c => c.id === child.id)))
      ) {
        continue;
      }
      getAllMembers(child, level, result, visited);
    }
  }
  // If children is an object (Record<string, FamilyMember[]>)
  else {
    // Process each partner's children array
    Object.values(children).forEach(childrenArray => {
      if (Array.isArray(childrenArray)) {
        for (const child of childrenArray) {
          // Skip if this child is in skipChildren
          if (
            skipChildren &&
            ((Array.isArray(skipChildren) &&
              skipChildren.some(c => c.id === child.id)) ||
              (!Array.isArray(skipChildren) &&
                Object.values(skipChildren)
                  .flat()
                  .some(c => c.id === child.id)))
          ) {
            continue;
          }
          getAllMembers(child, level, result, visited);
        }
      }
    });
  }
};

/**
 * Group family members by their hierarchical level
 */
export const getMembersByLevel = (
  familyData: FamilyMember
): Record<number, FamilyMember[]> => {
  const allMembers = getAllMembers(familyData);

  return allMembers.reduce(
    (acc, member) => {
      const level = member.level || 0;
      if (!acc[level]) {
        acc[level] = [];
      }
      acc[level].push(member);
      return acc;
    },
    {} as Record<number, FamilyMember[]>
  );
};

/**
 * Get all partnership groups on each level
 * This helps to place partners together correctly
 */
export const getPartnerGroups = (
  membersByLevel: Record<number, FamilyMember[]>
): Record<number, Array<FamilyMember[]>> => {
  const partnerGroups: Record<number, Array<FamilyMember[]>> = {};

  Object.entries(membersByLevel).forEach(([levelStr, members]) => {
    const level = parseInt(levelStr);
    partnerGroups[level] = [];

    // Track processed members
    const processed = new Set<string>();

    members.forEach(member => {
      if (processed.has(member.id)) {
        return;
      }

      // Start a new partner group
      const group: FamilyMember[] = [member];
      processed.add(member.id);

      // Add current partner if available
      if (member.partner && members.some(m => m.id === member.partner!.id)) {
        group.push(member.partner);
        processed.add(member.partner.id);
      }

      // Add past partners if they're on this level
      if (member.partners) {
        member.partners.forEach(partner => {
          if (
            !processed.has(partner.id) &&
            members.some(m => m.id === partner.id)
          ) {
            group.push(partner);
            processed.add(partner.id);
          }
        });
      }

      partnerGroups[level].push(group);
    });
  });

  return partnerGroups;
};

/**
 * Get child-parent relationships to determine optimal positioning
 */
export const getChildParentMap = (
  familyData: FamilyMember
): Map<string, string[]> => {
  const childToParents = new Map<string, string[]>();
  const visited = new Set<string>();

  const processNode = (node: FamilyMember) => {
    if (visited.has(node.id)) {
      return;
    }
    visited.add(node.id);

    // Process children
    if (node.children) {
      node.children.forEach(child => {
        // Map child to parent
        if (!childToParents.has(child.id)) {
          childToParents.set(child.id, []);
        }

        const parents = childToParents.get(child.id)!;
        parents.push(node.id);

        // If node has a partner, also add them as a parent
        if (node.partner) {
          parents.push(node.partner.id);
        }

        // Process child recursively
        processNode(child);
      });
    }

    // Process partner
    if (node.partner) {
      processNode(node.partner);
    }

    // Process other partners
    if (node.partners) {
      node.partners.forEach(partner => {
        processNode(partner);
      });
    }
  };

  processNode(familyData);
  return childToParents;
};

/**
 * Calculate optimal tree layout using advanced algorithms
 * inspired by BALKANGraph/FamilyTreeJS
 */
/**
 * Calculate optimal tree layout using advanced algorithms
 * inspired by BALKANGraph/FamilyTreeJS
 */
export const calculateOptimalTreeLayout = (
  familyData: FamilyMember,
  containerWidth: number
): Record<string, { x: number; y: number }> => {
  const positions: Record<string, { x: number; y: number }> = {};

  // Get members by level
  const membersByLevel = getMembersByLevel(familyData);
  console.log('Members by level:', membersByLevel);

  // Calculate positions level by level
  const maxLevel = Math.max(...Object.keys(membersByLevel).map(Number), 0);

  for (let level = 0; level <= maxLevel; level++) {
    const membersAtLevel = membersByLevel[level] || [];

    // Calculate total width of members at this level
    const totalWidth =
      membersAtLevel.length * CARD_WIDTH +
      (membersAtLevel.length - 1) * HORIZONTAL_SPACING;

    // Center the level
    const startX = Math.max(0, (containerWidth - totalWidth) / 2);

    // Position members
    membersAtLevel.forEach((member, index) => {
      positions[member.id] = {
        x: startX + index * (CARD_WIDTH + HORIZONTAL_SPACING),
        y: level * (CARD_HEIGHT + VERTICAL_SPACING),
      };
    });
  }

  console.log('Calculated positions:', positions);
  return positions;
};

/**
 * Calculate tree dimensions for setting container size
 */
export const calculateTreeDimensions = (familyData: FamilyMember) => {
  const allMembers = getAllMembers(familyData);
  const maxLevel = Math.max(...allMembers.map(m => m.level || 0), 0);

  // Calculate level widths
  const membersByLevel = getMembersByLevel(familyData);
  const partnerGroups = getPartnerGroups(membersByLevel);

  let maxWidth = 0;

  // Calculate max width across all levels
  Object.entries(partnerGroups).forEach(([levelStr, groups]) => {
    let levelWidth = 0;

    groups.forEach(group => {
      // Partner groups take width of all members + spacing
      levelWidth +=
        group.length * CARD_WIDTH + (group.length - 1) * PARTNER_SPACING;
    });

    // Add spacing between partner groups
    if (groups.length > 1) {
      levelWidth += (groups.length - 1) * HORIZONTAL_SPACING;
    }

    maxWidth = Math.max(maxWidth, levelWidth);
  });

  // Calculate height based on max level
  const height = (maxLevel + 1) * (CARD_HEIGHT + VERTICAL_SPACING);

  // Ensure minimum dimensions
  return {
    width: Math.max(maxWidth, CARD_WIDTH * 2),
    height: Math.max(height, CARD_HEIGHT * 2),
  };
};

/**
 * Function to get badge connection point
 */
export const getBadgeConnectionPoint = (node: { x: number; y: number }) => {
  // Badge starts 15px from left edge
  const badgeLeft = node.x + 15;
  // Connect at approximately 1/3 of the badge width
  return badgeLeft + 40;
};

/**
 * Initial sample data
 */

// src/components/FamilyTree/treeUtils.ts
// Fixed initialFamilyData with proper IDs and bidirectional relationships

export const initialFamilyData: FamilyMember = {
  id: '1',
  name: 'John Smith',
  gender: 'male',
  age: '65',
  birthDate: '01/15/1960',
  deathDate: '',
  address: '123 Main St, Anytown, USA',
  divisionOfInterest: 'Primary Interest',
  percentage: '25.000 %',
  relationshipType: 'Primary File',
  children: [
    {
      id: '3',
      name: 'New Child',
      gender: 'female',
      age: '63',
      birthDate: '03/22/1962',
      deathDate: '',
      address: '123 Main St, Anytown, USA',
      divisionOfInterest: 'Marital Interest',
      percentage: '25.000 %',
      relationshipType: 'Child',
      partner: {
        id: '4',
        name: 'new child partner',
        gender: 'female',
        age: '63',
        birthDate: '03/22/1962',
        deathDate: '',
        address: '123 Main St, Anytown, USA',
        divisionOfInterest: 'Marital Interest',
        percentage: '25.000 %',
        relationshipType: 'Partner',
        childrenRefs: ['child-1741850976290'],
      },
      children: [],
      // children: [
      //   {
      //     id: 'child-1741850976290',
      //     name: 'great grand child',
      //     gender: 'male',
      //     age: '00',
      //     birthDate: '00/00/00',
      //     deathDate: '00/00/00',
      //     divisionOfInterest: 'Division of Interest',
      //     percentage: '0.000 %',
      //     relationshipType: 'Child',
      //     children: [],
      //     parentId: '3',
      //   },
      // ],
      // partnerChildrenMap: {
      //   '4': ['child-1741850976290'],
      // },
    },
    {
      id: 'child-1741850957591',
      name: 'New Child 2',
      gender: 'male',
      age: '00',
      birthDate: '00/00/00',
      deathDate: '00/00/00',
      divisionOfInterest: 'Division of Interest',
      percentage: '0.000 %',
      relationshipType: 'Child',
      children: [],
      parentId: '1',
    },
  ],
  partner: {
    id: '2',
    name: 'Mary Smith',
    gender: 'female',
    age: '63',
    birthDate: '03/22/1962',
    deathDate: '',
    address: '123 Main St, Anytown, USA',
    divisionOfInterest: 'Marital Interest',
    percentage: '25.000 %',
    relationshipType: 'Partner',
    childrenRefs: ['child-1741850957591'],
  },
  partnerChildrenMap: {
    '2': ['child-1741850957591'],
  },
};

export default initialFamilyData;
