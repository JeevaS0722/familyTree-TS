import d3 from '../d3';
import { TreeNode } from '../types';

interface ManualZoomOptions {
  amount: number;
  svg: SVGElement & {
    __zoomObj: {
      scaleBy: (selection: any, amount: number) => void;
    };
  };
  transition_time?: number;
}

/**
 * Manually zooms the SVG by the specified amount
 */
export function manualZoom({
  amount,
  svg,
  transition_time = 500,
}: ManualZoomOptions): void {
  const zoom = svg.__zoomObj;
  d3.select(svg)
    .transition()
    .duration(transition_time || 0)
    .delay(transition_time ? 100 : 0) // delay 100 because of weird error of undefined something in d3 zoom
    .call(zoom.scaleBy, amount);
}

/**
 * Checks if all relatives of a node are displayed in the data
 */
export function isAllRelativeDisplayed(d: TreeNode, data: TreeNode[]): boolean {
  const r = d.data.rels;
  const all_rels = [
    r.father,
    r.mother,
    ...(r.spouses || []),
    ...(r.children || []),
  ].filter(v => v);
  return all_rels.every(rel_id => data.some(d => d.data.id === rel_id));
}
