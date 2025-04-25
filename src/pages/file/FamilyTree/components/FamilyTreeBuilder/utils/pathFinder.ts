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

  if (sourceNode.data.id === mainNode.data.id) {
    return { nodePath: [], linkPath: [] };
  }

  if (sourceNode.is_ancestry) {
    traverseAncestry();
  } else if (
    sourceNode.spouse &&
    sourceNode.spouse.data.id === mainNode.data.id
  ) {
    traverseSpouse();
  } else {
    traverseDescendants();
  }

  return { nodePath, linkPath };

  function traverseAncestry() {
    let current = sourceNode;

    let iterations = 0;
    while (current && current.data.id !== mainNode.data.id && iterations < 20) {
      iterations++;
      nodePath.push(current);

      const parentLink = links.find(link => {
        if (Array.isArray(link.target)) {
          return link.target.some(t => t.data.id === current.data.id);
        } else {
          return link.target.data.id === current.data.id;
        }
      });

      if (parentLink) {
        linkPath.push(parentLink);

        if (Array.isArray(parentLink.source)) {
          const nextParent = parentLink.source.find(
            s => s.data.id !== current.data.id
          );
          if (nextParent) {
            current = nextParent;
          } else {
            break;
          }
        } else {
          current = parentLink.source;
        }
      } else {
        break;
      }
    }
  }

  function traverseSpouse() {
    nodePath.push(sourceNode);

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

  function traverseDescendants() {
    let pathToMain: {
      path: TreeNode[];
      links: TreeLink[];
    } = findPathUp(mainNode);

    if (pathToMain.path.length === 0) {
      const mainAncestors = findAllAncestors(mainNode);

      for (const ancestor of mainAncestors) {
        const pathThroughAncestor = findPathUp(ancestor);
        if (pathThroughAncestor.path.length > 0) {
          const pathFromAncestorToMain = findPathDown(ancestor, mainNode);

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

      if (current.data.id === target.data.id) {
        path.push(current);
        break;
      }
    }

    return { path, links: pathLinks };
  }

  function findPathDown(
    source: TreeNode,
    target: TreeNode
  ): { path: TreeNode[]; links: TreeLink[] } {
    const path: TreeNode[] = [];
    const pathLinks: TreeLink[] = [];

    const queue: { node: TreeNode; path: TreeNode[]; links: TreeLink[] }[] = [
      { node: source, path: [source], links: [] },
    ];
    const visited = new Set<string>([source.data.id]);

    while (queue.length > 0) {
      const { node, path: currentPath, links: currentLinks } = queue.shift()!;

      if (node.data.id === target.data.id) {
        return { path: currentPath, links: currentLinks };
      }

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

    return { path: [], links: [] };
  }

  function findAllAncestors(node: TreeNode): TreeNode[] {
    const ancestors: TreeNode[] = [];
    let current = node;

    const visited = new Set<string>([node.data.id]);
    let iterations = 0;

    while (current && iterations < 20) {
      iterations++;

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
