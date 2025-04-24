// src/component/FamilyTree/utils/animationUtils.ts
import { TreeNode } from '../types/familyTree';

export function calculateEnterAndExitPositions(
  node: TreeNode,
  entering: boolean,
  exiting: boolean
): void {
  node.exiting = exiting;

  if (entering) {
    try {
      // Main node (depth 0) with no spouse - start at target position
      if (node.depth === 0 && !node.spouse) {
        node._x = node.x;
        node._y = node.y;
      }
      // Spouse node - start at spouse position
      else if (node.spouse) {
        node._x = node.spouse.x;
        node._y = node.spouse.y;
      }
      // Ancestry node (parents, grandparents) - start at child position
      else if (node.is_ancestry && node.parent) {
        node._x = node.parent.x;
        node._y = node.parent.y;
      }
      // Children - start at parent-spouse position
      else if (node.psx !== undefined && node.psy !== undefined) {
        node._x = node.psx;
        node._y = node.psy;
      }
      // Fallback - use parent position if available
      else if (node.parent) {
        node._x = node.parent.x;
        node._y = node.parent.y;
      }
      // Another fallback for children with father/mother relationship but no parent reference
      else if (node.data.rels.father || node.data.rels.mother) {
        // For children where the TreeNode parent reference might be missing
        // but we know they have a parent from the data relationships
        node._x = node.x;
        node._y = node.y - 150; // Start slightly above final position
      }
      // Last resort fallback
      else {
        // Start slightly offset from final position
        const offsetX = node.x > 0 ? -100 : 100;
        const offsetY = node.y > 0 ? -100 : 100;
        node._x = node.x + offsetX;
        node._y = node.y + offsetY;
      }

      // Log the calculated position for debugging
      console.log(`Node ${node.data.id} entering position calculated:`, {
        finalPos: { x: node.x, y: node.y },
        startPos: { x: node._x, y: node._y },
        depth: node.depth,
        isAncestry: node.is_ancestry,
        hasSpouse: !!node.spouse,
        hasParent: !!node.parent,
        hasParentSpousePos: node.psx !== undefined && node.psy !== undefined,
      });
    } catch (e) {
      // Emergency fallback in case of any errors
      node._x = node.x;
      node._y = node.y;
      console.warn('Error setting animation position:', e);
    }
  }
  // Exiting nodes - fly away from center
  else if (exiting) {
    const x = node.x > 0 ? 1 : -1;
    const y = node.y > 0 ? 1 : -1;
    node._x = node.x + 400 * x;
    node._y = node.y + 400 * y;
  }
}

/**
 * Calculate delay for sequential animations
 * Modified to reduce delays for non-initial animations to make new nodes appear faster
 */
export function calculateAnimationDelay(
  node: TreeNode,
  transitionTime: number,
  treeData: TreeNode[]
): number {
  // Base delay unit per level - reduced for better responsiveness
  const delay_level = transitionTime * 0.3; // Reduced from 0.4

  // Find max depth of ancestry nodes
  const ancestry_levels = Math.max(
    ...treeData.map(d => (d.is_ancestry ? d.depth : 0))
  );

  // Initial delay based on depth
  let delay = node.depth * delay_level;

  // Special handling for non-ancestry nodes (not parents/grandparents)
  if ((node.depth !== 0 || !!node.spouse) && !node.is_ancestry) {
    // Wait for all ancestry nodes first
    delay += ancestry_levels * delay_level;

    // Spouses appear after their partners
    if (node.spouse) {
      delay += delay_level * 0.7; // Reduced multiplier
    }

    // Extra delay based on depth for better sequencing - reduced
    delay += node.depth * delay_level * 0.8; // Reduced multiplier
  }

  // Cap maximum delay to prevent very long waits
  const maxDelay = transitionTime * 1.5;
  delay = Math.min(delay, maxDelay);

  // Ensure a minimum delay for better visibility
  return Math.max(delay, 50); // Reduced minimum delay
}
