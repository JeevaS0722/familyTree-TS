// src/component/FamilyTree/utils/animationUtils.ts
import { TreeNode } from '../types/familyTree';

export function calculateEnterAndExitPositions(
  node: TreeNode,
  entering: boolean,
  exiting: boolean,
  allNodes: TreeNode[]
): void {
  node.exiting = exiting;

  if (entering) {
    if (node.depth === 0 && !node.spouse) {
      node._x = node.x;
      node._y = node.y;
    } else if (node.spouse) {
      node._x = node.spouse.x;
      node._y = node.spouse.y;
    } else if (node.is_ancestry) {
      const parentNode =
        node.parent ||
        allNodes.find(
          n =>
            n.data.id === node.data.rels.father ||
            n.data.id === node.data.rels.mother
        );

      if (parentNode) {
        node._x = parentNode.x;
        node._y = parentNode.y;
      } else {
        node._x = node.x;
        node._y = node.y - 150;
      }
    } else if (node.psx !== undefined && node.psy !== undefined) {
      node._x = node.psx;
      node._y = node.psy;
    } else {
      // Default entry from parent location if available
      const parentNode = allNodes.find(
        n =>
          n.data.id === node.data.rels.father ||
          n.data.id === node.data.rels.mother
      );

      if (parentNode) {
        node._x = parentNode.x;
        node._y = parentNode.y;
      } else {
        // Fall back to entering from a distance
        node._x = node.x;
        node._y = node.y - 150;
      }
    }
  } else if (exiting) {
    // Exit animation - fly away in the direction of the node
    const x = node.x > 0 ? 1 : -1;
    const y = node.y > 0 ? 1 : -1;
    node._x = node.x + 400 * x;
    node._y = node.y + 400 * y;
  }
}
