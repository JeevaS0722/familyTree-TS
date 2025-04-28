import { TreeNode } from '../types/familyTree';

/**
 * Toggles visibility of relationships for all nodes in the tree
 */
export function toggleAllRels(treeData: TreeNode[], hideRels: boolean): void {
  treeData.forEach(node => {
    node.data.hide_rels = hideRels;
    toggleRels(node, hideRels);
  });
}

/**
 * Toggles visibility of relationships for a single node
 */
export function toggleRels(node: TreeNode, hideRels: boolean): void {
  const rels = hideRels ? 'rels' : '_rels';
  const rels_ = hideRels ? '_rels' : 'rels';

  if (node.is_ancestry || node.data.main) {
    showHideAncestry('father');
    showHideAncestry('mother');
  } else {
    showHideChildren();
  }

  function showHideAncestry(relType: 'father' | 'mother'): void {
    if (!node.data[rels] || !node.data[rels][relType]) {
      return;
    }
    if (!node.data[rels_]) {
      node.data[rels_] = {};
    }
    node.data[rels_][relType] = node.data[rels][relType];
    delete node.data[rels][relType];
  }

  function showHideChildren(): void {
    if (!node.data[rels] || !node.data[rels].children) {
      return;
    }
    const children = [...node.data[rels].children];
    const spouses = node.spouse ? [node.spouse] : node.spouses || [];

    [node, ...spouses].forEach(sp => {
      children.forEach(childId => {
        if (sp.data[rels]?.children?.includes(childId)) {
          if (!sp.data[rels_]) {
            sp.data[rels_] = {};
          }
          if (!sp.data[rels_].children) {
            sp.data[rels_].children = [];
          }
          sp.data[rels_].children.push(childId);
          const index = sp.data[rels].children.indexOf(childId);
          if (index !== -1) {
            sp.data[rels].children.splice(index, 1);
          }
        }
      });
    });
  }
}

/**
 * Toggle visibility for a single node's relationships
 */
export function toggleNodeVisibility(
  node: TreeNode,
  updateTree: () => void
): void {
  node.data.hide_rels = !node.data.hide_rels;
  toggleRels(node, node.data.hide_rels);
  updateTree();
}
