// src/utils/linkCreator.ts
import { TreeNode, TreeLink } from '../types/familyTree';

export function createLinks({
  d,
  tree,
  is_horizontal = false,
}: {
  d: TreeNode;
  tree: TreeNode[];
  is_horizontal?: boolean;
}): TreeLink[] {
  const links: TreeLink[] = [];

  if (d.data.rels.spouses && d.data.rels.spouses.length > 0) {
    handleSpouse({ d });
  }
  handleAncestrySide({ d });
  handleProgenySide({ d });

  return links;

  function handleAncestrySide({ d }: { d: TreeNode }): void {
    if (!d.parents) {
      return;
    }
    const p1 = d.parents[0];
    const p2 = d.parents[1] || p1;

    const p = { x: getMid(p1, p2, 'x'), y: getMid(p1, p2, 'y') };

    links.push({
      d: Link(d, p),
      _d: () => {
        const _d = { x: d.x, y: d.y };
        const _p = { x: d.x, y: d.y };
        return Link(_d, _p);
      },
      curve: true,
      id: linkId(d, p1, p2),
      depth: d.depth + 1,
      is_ancestry: true,
      source: d,
      target: [p1, p2],
    });
  }

  function handleProgenySide({ d }: { d: TreeNode }): void {
    if (!d.children || d.children.length === 0) {
      return;
    }

    d.children.forEach((child, i) => {
      const other_parent = otherParent(child, d, tree) || d;
      const sx = other_parent.sx;

      const parent_pos = !is_horizontal ? { x: sx, y: d.y } : { x: d.x, y: sx };
      links.push({
        d: Link(child, parent_pos),
        _d: () =>
          Link(parent_pos, {
            x: _or(parent_pos, 'x'),
            y: _or(parent_pos, 'y'),
          }),
        curve: true,
        id: linkId(child, d, other_parent),
        depth: d.depth + 1,
        is_ancestry: false,
        source: [d, other_parent],
        target: child,
      });
    });
  }

  function handleSpouse({ d }: { d: TreeNode }): void {
    if (!d.data.rels.spouses) {
      return;
    }

    d.data.rels.spouses.forEach(sp_id => {
      const spouse = getRel(d, tree, d0 => d0.data.id === sp_id);
      if (!spouse || d.spouse) {
        return;
      }

      links.push({
        d: [
          [d.x, d.y],
          [spouse.x, spouse.y],
        ],
        _d: () => [
          d.is_ancestry ? [_or(d, 'x') - 0.0001, _or(d, 'y')] : [d.x, d.y], // add -.0001 to line to have some length if d.x === spouse.x
          d.is_ancestry
            ? [_or(spouse, 'x'), _or(spouse, 'y')]
            : [d.x - 0.0001, d.y],
        ],
        curve: false,
        id: linkId(d, spouse),
        depth: d.depth,
        spouse: true,
        is_ancestry: spouse.is_ancestry,
        source: d,
        target: spouse,
      });
    });
  }

  // Helper functions
  function getMid(
    d1: TreeNode,
    d2: TreeNode,
    side: 'x' | 'y',
    is_?: boolean
  ): number {
    if (is_) {
      return _or(d1, side) - (_or(d1, side) - _or(d2, side)) / 2;
    } else {
      return d1[side] - (d1[side] - d2[side]) / 2;
    }
  }

  function _or(d: any, k: string): number {
    return d.hasOwnProperty('_' + k) ? d['_' + k] : d[k];
  }

  function Link(d: any, p: any): [number, number][] {
    return is_horizontal ? LinkHorizontal(d, p) : LinkVertical(d, p);
  }

  function LinkVertical(d: any, p: any): [number, number][] {
    const hy = d.y + (p.y - d.y) / 2;
    return [
      [d.x, d.y],
      [d.x, hy],
      [d.x, hy],
      [p.x, hy],
      [p.x, hy],
      [p.x, p.y],
    ];
  }

  function LinkHorizontal(d: any, p: any): [number, number][] {
    const hx = d.x + (p.x - d.x) / 2;
    return [
      [d.x, d.y],
      [hx, d.y],
      [hx, d.y],
      [hx, p.y],
      [hx, p.y],
      [p.x, p.y],
    ];
  }

  function linkId(...args: TreeNode[]): string {
    return args
      .map(d => d.data.id)
      .sort()
      .join(', '); // make unique id
  }

  function otherParent(
    child: TreeNode,
    p1: TreeNode,
    data: TreeNode[]
  ): TreeNode | undefined {
    const condition = (d0: TreeNode) =>
      d0.data.id !== p1.data.id &&
      (d0.data.id === child.data.rels.mother ||
        d0.data.id === child.data.rels.father);
    return getRel(p1, data, condition);
  }

  // If there is overlapping of personas in different branches of same family tree, return the closest one
  function getRel(
    d: TreeNode,
    data: TreeNode[],
    condition: (d: TreeNode) => boolean
  ): TreeNode | undefined {
    const rels = data.filter(condition);
    const dist_xy = (a: TreeNode, b: TreeNode) =>
      Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

    if (rels.length > 1) {
      return rels.sort((d0, d1) => dist_xy(d0, d) - dist_xy(d1, d))[0];
    } else {
      return rels[0];
    }
  }
}
