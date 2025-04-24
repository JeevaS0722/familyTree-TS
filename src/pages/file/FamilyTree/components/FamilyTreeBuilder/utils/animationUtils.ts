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
      // Last resort fallback
      else {
        // Start slightly offset from final position
        const offsetX = node.x > 0 ? -100 : 100;
        const offsetY = node.y > 0 ? -100 : 100;
        node._x = node.x + offsetX;
        node._y = node.y + offsetY;
      }
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
 * This precisely matches the original implementation's timing logic with
 * added minimum delay for non-initial animations
 */
export function calculateAnimationDelay(
  node: TreeNode,
  transitionTime: number,
  treeData: TreeNode[]
): number {
  // Base delay unit per level
  const delay_level = transitionTime * 0.4;

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
      delay += delay_level;
    }

    // Extra delay based on depth for better sequencing
    delay += node.depth * delay_level;
  }

  // Ensure a minimum delay for better visibility
  return Math.max(delay, 100);
}
