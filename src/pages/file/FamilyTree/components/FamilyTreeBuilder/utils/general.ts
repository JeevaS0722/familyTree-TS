import { TreeNode } from '../types/familyTree';

export function safeCloneNodes(nodes: TreeNode[]): TreeNode[] {
  if (!nodes || !nodes.length) {
    return [];
  }

  return nodes.map(node => {
    const clonedNode: Partial<TreeNode> = {
      data: node.data,
      x: node.x,
      y: node.y,
      _x: node._x,
      _y: node._y,
      depth: node.depth,
      is_ancestry: node.is_ancestry,
      exiting: node.exiting,
    };

    if (node.parent) {
      clonedNode.parent = { data: { id: node.parent.data.id } } as TreeNode;
    }

    if (node.spouse) {
      clonedNode.spouse = { data: { id: node.spouse.data.id } } as TreeNode;
    }

    if (node.psx !== undefined) {
      clonedNode.psx = node.psx;
    }
    if (node.psy !== undefined) {
      clonedNode.psy = node.psy;
    }
    if (node.sx !== undefined) {
      clonedNode.sx = node.sx;
    }
    if (node.sy !== undefined) {
      clonedNode.sy = node.sy;
    }

    return clonedNode;
  });
}
