import * as d3 from 'd3';
import { PersonData, TreeData, TreeNode } from '../types/familyTree';

export function calculateTree({
  data,
  main_id = null,
  node_separation = 250,
  level_separation = 150,
  is_horizontal = false,
}: {
  data: PersonData[];
  main_id?: string | null;
  node_separation?: number;
  level_separation?: number;
  is_horizontal?: boolean;
}): TreeData {
  if (!data || !data.length) {
    return {
      data: [],
      data_stash: [],
      dim: { width: 0, height: 0, x_off: 0, y_off: 0 },
      main_id: null,
      is_horizontal,
    };
  }

  if (is_horizontal) {
    [node_separation, level_separation] = [level_separation, node_separation];
  }

  const data_stash = JSON.parse(JSON.stringify(data)) as PersonData[];

  sortChildrenWithSpouses(data_stash);

  const main =
    (main_id !== null && data_stash.find(d => d.id === main_id)) ||
    data_stash[0];

  const tree_children = calculateTreePositions(main, 'children', false);
  const tree_parents = calculateTreePositions(main, 'parents', true);

  data_stash.forEach(d => (d.main = d.id === main.id));

  levelOutEachSide(tree_parents, tree_children);

  const tree = mergeSides(tree_parents, tree_children);

  setupChildrenAndParents({ tree });

  setupSpouses({ tree, node_separation });

  setupProgenyParentsPos({ tree });

  nodePositioning({ tree, is_horizontal });

  tree.forEach(d => {
    d.all_rels_displayed = isAllRelativeDisplayed(d, tree);
  });

  const dim = calculateTreeDim(
    tree,
    node_separation,
    level_separation,
    is_horizontal
  );

  return { data: tree, data_stash, dim, main_id: main.id, is_horizontal };

  function calculateTreePositions(
    datum: PersonData,
    rt: 'children' | 'parents',
    is_ancestry: boolean
  ): TreeNode[] {
    const hierarchyGetter =
      rt === 'children' ? hierarchyGetterChildren : hierarchyGetterParents;
    const d3_tree = d3
      .tree<PersonData>()
      .nodeSize([node_separation, level_separation])
      .separation(separation);

    const root = d3.hierarchy<PersonData>(datum, hierarchyGetter);
    d3_tree(root);

    return root.descendants() as TreeNode[];

    function separation(
      a: d3.HierarchyNode<PersonData>,
      b: d3.HierarchyNode<PersonData>
    ): number {
      let offset = 1;
      if (!is_ancestry) {
        if (!sameParent(a, b)) {
          offset += 0.25;
        }
        if (someSpouses(a, b)) {
          offset += offsetOnPartners(a, b);
        }
        if (sameParent(a, b) && !sameBothParents(a, b)) {
          offset += 0.125;
        }
      }
      return offset;
    }

    function sameParent(
      a: d3.HierarchyNode<PersonData>,
      b: d3.HierarchyNode<PersonData>
    ): boolean {
      return a.parent === b.parent;
    }

    function sameBothParents(
      a: d3.HierarchyNode<PersonData>,
      b: d3.HierarchyNode<PersonData>
    ): boolean {
      return (
        a.data.rels.father === b.data.rels.father &&
        a.data.rels.mother === b.data.rels.mother
      );
    }

    function hasSpouses(d: d3.HierarchyNode<PersonData>): boolean {
      return !!(d.data.rels.spouses && d.data.rels.spouses.length > 0);
    }

    function someSpouses(
      a: d3.HierarchyNode<PersonData>,
      b: d3.HierarchyNode<PersonData>
    ): boolean {
      return hasSpouses(a) || hasSpouses(b);
    }

    function hierarchyGetterChildren(d: PersonData): PersonData[] {
      return [...(d.rels.children || [])].map(
        id => data_stash.find(d => d.id === id)!
      );
    }

    function hierarchyGetterParents(d: PersonData): PersonData[] {
      return [d.rels.father, d.rels.mother]
        .filter(Boolean)
        .map(id => data_stash.find(d => d.id === id)!);
    }

    function offsetOnPartners(
      a: d3.HierarchyNode<PersonData>,
      b: d3.HierarchyNode<PersonData>
    ): number {
      return (
        ((a.data.rels.spouses || []).length +
          (b.data.rels.spouses || []).length) *
        0.5
      );
    }
  }

  function levelOutEachSide(parents: TreeNode[], children: TreeNode[]): void {
    const mid_diff = (parents[0].x - children[0].x) / 2;
    parents.forEach(d => (d.x -= mid_diff));
    children.forEach(d => (d.x += mid_diff));
  }

  function mergeSides(parents: TreeNode[], children: TreeNode[]): TreeNode[] {
    parents.forEach(d => {
      d.is_ancestry = true;
    });
    parents.forEach(d => (d.depth === 1 ? (d.parent = children[0]) : null));

    return [...children, ...parents.slice(1)];
  }

  function nodePositioning({
    tree,
    is_horizontal,
  }: {
    tree: TreeNode[];
    is_horizontal: boolean;
  }): void {
    tree.forEach(d => {
      d.y *= d.is_ancestry ? -1 : 1;
      if (is_horizontal) {
        const d_x = d.x;
        d.x = d.y;
        d.y = d_x;
      }
    });
  }

  function setupSpouses({
    tree,
    node_separation,
  }: {
    tree: TreeNode[];
    node_separation: number;
  }): void {
    for (let i = tree.length; i--; ) {
      const d = tree[i];
      if (
        !d.is_ancestry &&
        d.data.rels.spouses &&
        d.data.rels.spouses.length > 0
      ) {
        const side = d.data.data.gender === 'M' ? -1 : 1;
        d.x += (d.data.rels.spouses.length / 2) * node_separation * side;
        d.data.rels.spouses.forEach((sp_id, i) => {
          const spouse_data = data_stash.find(d0 => d0.id === sp_id)!;
          const spouse: TreeNode = {
            data: spouse_data,
            added: true,
            x: d.x - node_separation * (i + 1) * side,
            y: d.y,
            sx:
              i > 0
                ? d.x - node_separation * (i + 1) * side
                : d.x -
                  node_separation * (i + 1) * side +
                  (node_separation / 2) * side,
            sy: i > 0 ? d.y : d.y + (node_separation / 2) * side,
            depth: d.depth,
            spouse: d,
          };

          if (!d.spouses) {
            d.spouses = [];
          }
          d.spouses.push(spouse);
          tree.push(spouse);
        });
      }
      if (d.parents && d.parents.length === 2) {
        const p1 = d.parents[0];
        const p2 = d.parents[1];
        const midd = p1.x - (p1.x - p2.x) / 2;
        const x = (d: TreeNode, sp: TreeNode) =>
          midd + (node_separation / 2) * (d.x < sp.x ? 1 : -1);

        p2.x = x(p1, p2);
        p1.x = x(p2, p1);
      }
    }
  }

  function setupProgenyParentsPos({ tree }: { tree: TreeNode[] }): void {
    tree.forEach(d => {
      if (d.is_ancestry) {
        return;
      }
      if (d.depth === 0) {
        return;
      }
      if (d.added) {
        return;
      }

      const m = findDatum(d.data.rels.mother);
      const f = findDatum(d.data.rels.father);

      // Single parent cases
      if (m && !f) {
        // Has only mother
        m.sx = m.x; // Ensure sx is set
        m.sy = m.y; // Ensure sy is set
        setupParentPos(d, m);
      } else if (f && !m) {
        // Has only father
        f.sx = f.x; // Ensure sx is set
        f.sy = f.y; // Ensure sy is set
        setupParentPos(d, f);
      } else if (m && f) {
        // Has both parents
        // Find which parent is the "added spouse" (has added=true)
        if (!m.added && !f.added) {
          console.error(
            'Child has two parents but neither is marked as added:',
            d
          );
        }

        // Use the "added spouse" parent for positioning
        const added_spouse = m.added ? m : f;

        // Make sure sx/sy are properly set
        if (added_spouse.sx === undefined) {
          added_spouse.sx = added_spouse.x;
        }
        if (added_spouse.sy === undefined) {
          added_spouse.sy = added_spouse.y;
        }

        setupParentPos(d, added_spouse);
      }
    });

    function setupParentPos(d: TreeNode, p: TreeNode): void {
      d.psx = !is_horizontal ? p.sx : p.y;
      d.psy = !is_horizontal ? p.y : p.sx;
    }
  }

  function findDatum(id?: string): TreeNode | undefined {
    if (!id) {
      return undefined;
    }
    return tree.find(d => d.data.id === id);
  }

  function setupChildrenAndParents({ tree }: { tree: TreeNode[] }): void {
    tree.forEach(d0 => {
      delete d0.children;
      tree.forEach(d1 => {
        if (d1.parent === d0) {
          if (d1.is_ancestry) {
            if (!d0.parents) {
              d0.parents = [];
            }
            d0.parents.push(d1);
          } else {
            if (!d0.children) {
              d0.children = [];
            }
            d0.children.push(d1);
          }
        }
      });
    });
  }

  function calculateTreeDim(
    tree: TreeNode[],
    node_separation: number,
    level_separation: number,
    is_horizontal: boolean
  ): { width: number; height: number; x_off: number; y_off: number } {
    if (is_horizontal) {
      [node_separation, level_separation] = [level_separation, node_separation];
    }
    const w_extent = d3.extent(tree, d => d.x) as [number, number];
    const h_extent = d3.extent(tree, d => d.y) as [number, number];
    return {
      width: w_extent[1] - w_extent[0] + node_separation,
      height: h_extent[1] - h_extent[0] + level_separation,
      x_off: -w_extent[0] + node_separation / 2,
      y_off: -h_extent[0] + level_separation / 2,
    };
  }
}

function sortChildrenWithSpouses(data: PersonData[]): void {
  data.forEach(datum => {
    if (!datum.rels.children) {
      return;
    }
    const spouses = datum.rels.spouses || [];
    datum.rels.children.sort((a, b) => {
      const a_d = data.find(d => d.id === a),
        b_d = data.find(d => d.id === b),
        a_p2 = otherParent(a_d!, datum, data) || {},
        b_p2 = otherParent(b_d!, datum, data) || {},
        a_i = spouses.indexOf(a_p2.id),
        b_i = spouses.indexOf(b_p2.id);

      if (datum.data.gender === 'M') {
        return a_i - b_i;
      } else {
        return b_i - a_i;
      }
    });
  });
}

function otherParent(
  d: PersonData,
  p1: PersonData,
  data: PersonData[]
): PersonData | undefined {
  return data.find(
    d0 =>
      d0.id !== p1.id && (d0.id === d.rels.mother || d0.id === d.rels.father)
  );
}

function isAllRelativeDisplayed(d: TreeNode, data: TreeNode[]): boolean {
  const r = d.data.rels;
  const all_rels = [
    r.father,
    r.mother,
    ...(r.spouses || []),
    ...(r.children || []),
  ].filter(Boolean);
  return all_rels.every(rel_id => data.some(d => d.data.id === rel_id));
}
