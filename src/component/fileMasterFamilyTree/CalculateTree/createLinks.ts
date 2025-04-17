// src/CalculateTree/createLinks.ts
import { TreePerson, LinkData } from '../types';
import { Selection } from 'd3';

type LinkPoint = { x: number; y: number };
type LinkArray = [number, number][];

interface CreateLinksParams {
  d: TreePerson;
  tree: TreePerson[];
  is_horizontal?: boolean;
}

export function createLinks({
  d,
  tree,
  is_horizontal = false,
}: CreateLinksParams): LinkData[] {
  const links: LinkData[] = [];

  if (d.data.rels.spouses && d.data.rels.spouses.length > 0) {
    handleSpouse({ d });
  }

  handleAncestrySide({ d });
  handleProgenySide({ d });

  return links;

  function handleAncestrySide({ d }: { d: TreePerson }): void {
    if (!d.parents) {
      return;
    }

    const p1 = d.parents[0];
    const p2 = d.parents[1] || p1;

    const p = {
      x: getMid(p1, p2, 'x'),
      y: getMid(p1, p2, 'y'),
    };

    links.push({
      d: Link(d, p),
      _d: () => {
        const _d = { x: d.x, y: d.y },
          _p = { x: d.x, y: d.y };
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

  function handleProgenySide({ d }: { d: TreePerson }): void {
    if (!d.children || d.children.length === 0) {
      return;
    }

    d.children.forEach(child => {
      const other_parent = otherParent(child, d, tree) || d;
      const sx = other_parent.sx;

      const parent_pos = !is_horizontal
        ? { x: sx || 0, y: d.y }
        : { x: d.x, y: sx || 0 };

      links.push({
        d: Link(child, parent_pos),
        _d: () => {
          return Link(parent_pos, {
            x: _or(parent_pos, 'x'),
            y: _or(parent_pos, 'y'),
          });
        },
        curve: true,
        id: linkId(child, d, other_parent),
        depth: d.depth + 1,
        is_ancestry: false,
        source: [d, other_parent],
        target: child,
      });
    });
  }

  function handleSpouse({ d }: { d: TreePerson }): void {
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
        ] as LinkArray,
        _d: () =>
          [
            d.is_ancestry ? [_or(d, 'x') - 0.0001, _or(d, 'y')] : [d.x, d.y], // add -.0001 to line to have some length if d.x === spouse.x
            d.is_ancestry
              ? [_or(spouse, 'x'), _or(spouse, 'y')]
              : [d.x - 0.0001, d.y],
          ] as LinkArray,
        curve: false,
        id: linkId(d, spouse),
        depth: d.depth,
        spouse: true,
        is_ancestry: spouse.is_ancestry || false,
        source: d,
        target: spouse,
      });
    });
  }

  // Helper functions
  function getMid(d1: TreePerson, d2: TreePerson, side: 'x' | 'y'): number {
    return d1[side] - (d1[side] - d2[side]) / 2;
  }

  function _or(d: TreePerson | LinkPoint, k: 'x' | 'y'): number {
    const key = `_${k}` as keyof typeof d;
    return d[key] !== undefined ? d[key] : d[k];
  }

  function Link(
    d: TreePerson | LinkPoint,
    p: TreePerson | LinkPoint
  ): LinkArray {
    return is_horizontal ? LinkHorizontal(d, p) : LinkVertical(d, p);
  }

  function LinkVertical(
    d: TreePerson | LinkPoint,
    p: TreePerson | LinkPoint
  ): LinkArray {
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

  function LinkHorizontal(
    d: TreePerson | LinkPoint,
    p: TreePerson | LinkPoint
  ): LinkArray {
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

  function linkId(...args: TreePerson[]): string {
    return args
      .map(d => d.data.id)
      .sort()
      .join(', '); // make unique id
  }

  function otherParent(
    child: TreePerson,
    p1: TreePerson,
    data: TreePerson[]
  ): TreePerson | undefined {
    const condition = (d0: TreePerson) =>
      d0.data.id !== p1.data.id &&
      (d0.data.id === child.data.rels.mother ||
        d0.data.id === child.data.rels.father);

    return getRel(p1, data, condition);
  }

  // if there is overlapping of personas in different branches of same family tree, return the closest one
  function getRel(
    d: TreePerson,
    data: TreePerson[],
    condition: (d0: TreePerson) => boolean
  ): TreePerson | undefined {
    const rels = data.filter(condition);
    const dist_xy = (a: TreePerson, b: TreePerson) =>
      Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

    if (rels.length > 1) {
      return rels.sort((d0, d1) => dist_xy(d0, d) - dist_xy(d1, d))[0];
    } else {
      return rels[0];
    }
  }
}

export function pathToMain(
  cards: Selection<Element, TreePerson, Element, unknown>,
  links: Selection<Element, LinkData, Element, unknown>,
  datum: TreePerson,
  main_datum: TreePerson
): [
  Array<{ card: TreePerson; node: Element }>,
  Array<{ link: LinkData; node: Element }>,
] {
  const is_ancestry = datum.is_ancestry;
  const links_data = links.data();
  const links_node_to_main: Array<{ link: LinkData; node: Element }> = [];
  const cards_node_to_main: Array<{ card: TreePerson; node: Element }> = [];

  if (is_ancestry) {
    const links_to_main: LinkData[] = [];

    const parent = datum;
    let itteration1 = 0;
    while (child !== main_datum.data && itteration1 < 100) {
      itteration1++; // to prevent infinite loop
      const child_link = links_data.find(
        d => d.target === child && Array.isArray(d.source)
      );
      if (child_link) {
        const sourceArray = child_link.source as TreePerson[];
        const spouse_link = links_data.find(
          d => d.spouse === true && sameArray([d.source, d.target], sourceArray)
        );

        links_to_main.push(child_link);
        if (spouse_link) {
          links_to_main.push(spouse_link);
          child = spouse_link.source as TreePerson;
        } else {
          child = sourceArray[0];
        }
      } else {
        const spouse_link = links_data.find(
          d => d.target === child && !Array.isArray(d.source)
        ); // spouse link

        if (!spouse_link) {
          break;
        }
        links_to_main.push(spouse_link);
        child = spouse_link.source as TreePerson;
      }
    }

    links.each(function (d) {
      if (links_to_main.includes(d)) {
        links_node_to_main.push({ link: d, node: this });
      }
    });

    const cards_to_main = getCardsToMain(main_datum, links_to_main);
    cards.each(function (d) {
      if (cards_to_main.includes(d)) {
        cards_node_to_main.push({ card: d, node: this });
      }
    });
  }

  return [cards_node_to_main, links_node_to_main];

  function sameArray(arr1: unknown[], arr2: unknown[]): boolean {
    return arr1.every(d1 => arr2.some(d2 => d1 === d2));
  }

  function getCardsToMain(
    first_parent: TreePerson,
    links_to_main: LinkData[]
  ): TreePerson[] {
    const all_cards = links_to_main
      .filter(Boolean)
      .reduce((acc: TreePerson[], d) => {
        if (Array.isArray(d.target)) {
          acc.push(...d.target);
        } else {
          acc.push(d.target);
        }

        if (Array.isArray(d.source)) {
          acc.push(...d.source);
        } else {
          acc.push(d.source);
        }

        return acc;
      }, []);

    const cards_to_main = [main_datum, datum];
    getChildren(first_parent);
    return cards_to_main;

    function getChildren(d: TreePerson): void {
      if (d.data.rels.children) {
        d.data.rels.children.forEach(child_id => {
          const child = all_cards.find(d0 => d0.data.id === child_id);
          if (child) {
            cards_to_main.push(child);
            getChildren(child);
          }
        });
      }
    }
  }
}
