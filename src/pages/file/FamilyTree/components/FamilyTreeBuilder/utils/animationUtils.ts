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
      if (node.depth === 0 && !node.spouse) {
        node._x = node.x;
        node._y = node.y;
      } else if (node.spouse) {
        node._x = node.spouse.x;
        node._y = node.spouse.y;
      } else if (node.is_ancestry && node.parent) {
        node._x = node.parent.x;
        node._y = node.parent.y;
      } else if (node.psx !== undefined && node.psy !== undefined) {
        node._x = node.psx;
        node._y = node.psy;
      } else if (node.parent) {
        node._x = node.parent.x;
        node._y = node.parent.y;
      } else if (node.data.rels.father || node.data.rels.mother) {
        node._x = node.x;
        node._y = node.y - 150;
      } else {
        const offsetX = node.x > 0 ? -100 : 100;
        const offsetY = node.y > 0 ? -100 : 100;
        node._x = node.x + offsetX;
        node._y = node.y + offsetY;
      }
    } catch (e) {
      node._x = node.x;
      node._y = node.y;
      console.warn('Error setting animation position:', e);
    }
  } else if (exiting) {
    const x = node.x > 0 ? 1 : -1;
    const y = node.y > 0 ? 1 : -1;
    node._x = node.x + 400 * x;
    node._y = node.y + 400 * y;
  }
}

export function calculateAnimationDelay(
  node: TreeNode,
  transitionTime: number,
  treeData: TreeNode[]
): number {
  const delay_level = transitionTime * 0.3;

  const ancestry_levels = Math.max(
    ...treeData.map(d => (d.is_ancestry ? d.depth : 0))
  );

  let delay = node.depth * delay_level;

  if ((node.depth !== 0 || !!node.spouse) && !node.is_ancestry) {
    delay += ancestry_levels * delay_level;

    if (node.spouse) {
      delay += delay_level * 0.7;
    }

    delay += node.depth * delay_level * 0.8;
  }

  const maxDelay = transitionTime * 1.5;
  delay = Math.min(delay, maxDelay);

  return Math.max(delay, 50);
}
