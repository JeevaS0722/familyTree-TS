// src/view/view.handlers.ts
import d3 from '../d3';
import { TreeDimensions, TreePerson } from '../types';

interface PositionTreeParams {
  t: { k: number; x: number; y: number };
  svg: SVGSVGElement;
  transition_time?: number;
}

interface TreeFitParams {
  svg: SVGSVGElement;
  svg_dim: DOMRect;
  tree_dim: TreeDimensions;
  with_transition?: boolean;
  transition_time?: number;
}

interface CardToMiddleParams {
  datum: TreePerson;
  svg: SVGSVGElement;
  svg_dim: DOMRect;
  scale?: number;
  transition_time?: number;
}

function positionTree({
  t,
  svg,
  transition_time = 2000,
}: PositionTreeParams): void {
  const el_listener = svg.__zoomObj ? svg : (svg.parentNode as Element); // if we need listener for svg and html, we will use parent node
  const zoom = (el_listener as any).__zoomObj;

  if (!zoom) {
    return;
  }

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
}: TreeFitParams): void {
  const t = calculateTreeFit(svg_dim, tree_dim);
  positionTree({ t, svg, with_transition, transition_time });
}

export function calculateTreeFit(
  svg_dim: DOMRect,
  tree_dim: TreeDimensions
): { k: number; x: number; y: number } {
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
}: CardToMiddleParams): void {
  const k = scale || 1;
  const x = svg_dim.width / 2 - datum.x * k;
  const y = svg_dim.height / 2 - datum.y;
  const t = { k, x: x / k, y: y / k };

  positionTree({ t, svg, with_transition: true, transition_time });
}
