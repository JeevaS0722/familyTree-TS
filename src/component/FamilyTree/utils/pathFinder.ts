// src/utils/pathFinder.ts
import { TreeNode, TreeLink } from '../types/familyTree';

export function findPathToMain(
  nodes: TreeNode[],
  links: TreeLink[],
  sourceNode: TreeNode,
  mainNode: TreeNode
): { nodePath: TreeNode[]; linkPath: TreeLink[] } {
  const nodePath: TreeNode[] = [];
  const linkPath: TreeLink[] = [];

  // Already at main node
  if (sourceNode.data.id === mainNode.data.id) {
    return { nodePath: [], linkPath: [] };
  }

  // For ancestors (parents, grandparents, etc.)
  if (sourceNode.is_ancestry) {
    traverseAncestry();
  }
  // For spouses of main
  else if (
    sourceNode.spouse &&
    sourceNode.spouse.data.id === mainNode.data.id
  ) {
    traverseSpouse();
  }
  // For descendants or other relationships
  else {
    traverseDescendants();
  }

  return { nodePath, linkPath };

  // Handle ancestry path (going up the tree)
  function traverseAncestry() {
    let current = sourceNode;

    // Traverse up the tree until we reach the main node or run out of parents
    let iterations = 0; // Safety counter
    while (current && current.data.id !== mainNode.data.id && iterations < 20) {
      iterations++;
      nodePath.push(current);

      // Find the parent relationship
      const parentLink = links.find(link => {
        if (Array.isArray(link.target)) {
          // If target is an array, see if it includes current node
          return link.target.some(t => t.data.id === current.data.id);
        } else {
          // Direct target match
          return link.target.data.id === current.data.id;
        }
      });

      if (parentLink) {
        linkPath.push(parentLink);

        // Move to parent
        if (Array.isArray(parentLink.source)) {
          // If source is an array, find the first one that isn't the current node
          const nextParent = parentLink.source.find(
            s => s.data.id !== current.data.id
          );
          if (nextParent) {
            current = nextParent;
          } else {
            break; // No more parents
          }
        } else {
          // Direct parent
          current = parentLink.source;
        }
      } else {
        break; // No more links found
      }
    }
  }

  // Handle spouse relationship
  function traverseSpouse() {
    nodePath.push(sourceNode);

    // Find the spouse link
    const spouseLink = links.find(link => {
      return (
        link.spouse &&
        ((link.source.data?.id === sourceNode.data.id &&
          link.target.data?.id === mainNode.data.id) ||
          (link.target.data?.id === sourceNode.data.id &&
            link.source.data?.id === mainNode.data.id))
      );
    });

    if (spouseLink) {
      linkPath.push(spouseLink);
    }
  }

  // Handle descendant path (going down the tree)
  function traverseDescendants() {
    // First try to find a direct path up to common ancestor
    let pathToMain: {
      path: TreeNode[];
      links: TreeLink[];
    } = findPathUp(mainNode);

    // If no direct path, try to find a path through main node's ancestors
    if (pathToMain.path.length === 0) {
      // Find ancestors of main node
      const mainAncestors = findAllAncestors(mainNode);

      // Try to find a path through each ancestor
      for (const ancestor of mainAncestors) {
        const pathThroughAncestor = findPathUp(ancestor);
        if (pathThroughAncestor.path.length > 0) {
          // Found a path! Now trace from ancestor to main
          const pathFromAncestorToMain = findPathDown(ancestor, mainNode);

          // Combine paths
          pathToMain = {
            path: [...pathThroughAncestor.path, ...pathFromAncestorToMain.path],
            links: [
              ...pathThroughAncestor.links,
              ...pathFromAncestorToMain.links,
            ],
          };
          break;
        }
      }
    }

    // Add all nodes and links to our result
    for (const node of pathToMain.path) {
      if (!nodePath.includes(node)) {
        nodePath.push(node);
      }
    }

    for (const link of pathToMain.links) {
      if (!linkPath.includes(link)) {
        linkPath.push(link);
      }
    }
  }

  // Helper to find a path up the tree from source to target
  function findPathUp(target: TreeNode): {
    path: TreeNode[];
    links: TreeLink[];
  } {
    const path: TreeNode[] = [];
    const pathLinks: TreeLink[] = [];
    let current = sourceNode;

    let iterations = 0;
    while (current && current.data.id !== target.data.id && iterations < 20) {
      iterations++;
      path.push(current);

      // Look for parent relationships
      const parentLink = links.find(link => {
        if (Array.isArray(link.target)) {
          return link.target.some(t => t.data.id === current.data.id);
        } else {
          return link.target.data.id === current.data.id;
        }
      });

      if (!parentLink) {
        break;
      }

      pathLinks.push(parentLink);

      // Move to parent
      if (Array.isArray(parentLink.source)) {
        const nextParent = parentLink.source.find(s => nodes.includes(s));
        if (nextParent) {
          current = nextParent;
        } else {
          break;
        }
      } else {
        current = parentLink.source;
      }

      // If we found the target, add it to the path
      if (current.data.id === target.data.id) {
        path.push(current);
        break;
      }
    }

    return { path, links: pathLinks };
  }

  // Helper to find a path down the tree from source to target
  function findPathDown(
    source: TreeNode,
    target: TreeNode
  ): { path: TreeNode[]; links: TreeLink[] } {
    const path: TreeNode[] = [];
    const pathLinks: TreeLink[] = [];

    // Simple BFS to find the shortest path
    const queue: { node: TreeNode; path: TreeNode[]; links: TreeLink[] }[] = [
      { node: source, path: [source], links: [] },
    ];
    const visited = new Set<string>([source.data.id]);

    while (queue.length > 0) {
      const { node, path: currentPath, links: currentLinks } = queue.shift()!;

      if (node.data.id === target.data.id) {
        // Found it!
        return { path: currentPath, links: currentLinks };
      }

      // Find all child relationships
      const childLinks = links.filter(link => {
        if (Array.isArray(link.source)) {
          return link.source.some(s => s.data.id === node.data.id);
        } else {
          return link.source.data.id === node.data.id;
        }
      });

      for (const link of childLinks) {
        let nextNodes: TreeNode[] = [];

        if (Array.isArray(link.target)) {
          nextNodes = link.target.filter(t => !visited.has(t.data.id));
        } else if (!visited.has(link.target.data.id)) {
          nextNodes = [link.target];
        }

        for (const nextNode of nextNodes) {
          visited.add(nextNode.data.id);
          queue.push({
            node: nextNode,
            path: [...currentPath, nextNode],
            links: [...currentLinks, link],
          });
        }
      }
    }

    // No path found
    return { path: [], links: [] };
  }

  // Helper to find all ancestors of a node
  function findAllAncestors(node: TreeNode): TreeNode[] {
    const ancestors: TreeNode[] = [];
    let current = node;

    const visited = new Set<string>([node.data.id]);
    let iterations = 0;

    // Find direct ancestors (parents, grandparents, etc.)
    while (current && iterations < 20) {
      iterations++;

      // Find parent link
      const parentLink = links.find(link => {
        if (Array.isArray(link.target)) {
          return link.target.some(t => t.data.id === current.data.id);
        } else {
          return link.target.data.id === current.data.id;
        }
      });

      if (!parentLink) {
        break;
      }

      // Add parents to ancestors
      if (Array.isArray(parentLink.source)) {
        for (const parent of parentLink.source) {
          if (!visited.has(parent.data.id)) {
            visited.add(parent.data.id);
            ancestors.push(parent);
          }
        }
      } else if (!visited.has(parentLink.source.data.id)) {
        visited.add(parentLink.source.data.id);
        ancestors.push(parentLink.source);
        current = parentLink.source;
      } else {
        break;
      }
    }

    return ancestors;
  }
}
