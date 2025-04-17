// src/handlers/general.ts
import d3 from '../d3';
import { TreePerson } from '../types';

interface ManualZoomParams {
  amount: number;
  svg: SVGSVGElement;
  transition_time?: number;
}

export function manualZoom({
  amount,
  svg,
  transition_time = 500,
}: ManualZoomParams): void {
  const zoom = svg.__zoomObj;
  if (!zoom) {
    return;
  }

  d3.select(svg)
    .transition()
    .duration(transition_time || 0)
    .delay(transition_time ? 100 : 0) // delay 100 because of weird error of undefined something in d3 zoom
    .call(zoom.scaleBy, amount);
}

export function isAllRelativeDisplayed(
  d: TreePerson,
  data: TreePerson[]
): boolean {
  const r = d.data.rels,
    all_rels = [
      r.father,
      r.mother,
      ...(r.spouses || []),
      ...(r.children || []),
    ].filter(Boolean);

  return all_rels.every(rel_id => data.some(d => d.data.id === rel_id));
}
