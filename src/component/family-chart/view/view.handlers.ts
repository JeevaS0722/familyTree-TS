import d3 from '../d3';
import { TreeDimension, TreeNode } from '../types';

interface TransformData {
  k: number;
  x: number;
  y: number;
}

interface PositionTreeProps {
  t: TransformData;
  svg: SVGElement & {
    __zoomObj?: any;
    parentNode: HTMLElement & {
      __zoomObj?: any;
    };
  };
  transition_time?: number;
  with_transition?: boolean;
}

interface TreeFitProps {
  svg: SVGElement & {
    __zoomObj?: any;
    parentNode: HTMLElement & {
      __zoomObj?: any;
    };
  };
  svg_dim: DOMRect;
  tree_dim: TreeDimension;
  with_transition?: boolean;
  transition_time?: number;
}

interface CardToMiddleProps {
  datum: TreeNode;
  svg: SVGElement & {
    __zoomObj?: any;
    parentNode: HTMLElement & {
      __zoomObj?: any;
    };
  };
  svg_dim: DOMRect;
  scale?: number;
  transition_time?: number;
}

function positionTree({
  t,
  svg,
  transition_time = 2000,
}: PositionTreeProps): void {
  const el_listener = svg.__zoomObj ? svg : svg.parentNode; // if we need listener for svg and html, we will use parent node
  const zoom = el_listener.__zoomObj;

  d3.select(el_listener)
    .transition()
    .duration(transition_time || 0)
    .delay(transition_time ? 100 : 0) // delay 100 because of weird error of undefined something in d3 zoom
    .call(zoom.transform, d3.zoomIdentity.scale(t.k).translate(t.x, t.y));
}

export function treeFit({
  svg,
  svg_dim,
  tree_dim,
  with_transition,
  transition_time,
}: TreeFitProps): void {
  const t = calculateTreeFit(svg_dim, tree_dim);
  positionTree({ t, svg, with_transition, transition_time });
}

export function calculateTreeFit(
  svg_dim: DOMRect,
  tree_dim: TreeDimension
): TransformData {
  let k = Math.min(
    svg_dim.width / tree_dim.width,
    svg_dim.height / tree_dim.height
  );
  if (k > 1) {
    k = 1;
  }
  const x = tree_dim.x_off + (svg_dim.width - tree_dim.width * k) / k / 2;
  const y = tree_dim.y_off + (svg_dim.height - tree_dim.height * k) / k / 2;

  return { k, x, y };
}

export function cardToMiddle({
  datum,
  svg,
  svg_dim,
  scale,
  transition_time,
}: CardToMiddleProps): void {
  const k = scale || 1;
  const x = svg_dim.width / 2 - datum.x * k;
  const y = svg_dim.height / 2 - datum.y;
  const t = { k, x: x / k, y: y / k };

  positionTree({ t, svg, with_transition: true, transition_time });
}
