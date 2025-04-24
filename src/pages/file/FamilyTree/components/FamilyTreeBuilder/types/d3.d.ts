// src/types/d3.d.ts
import * as d3 from 'd3';

declare global {
  namespace D3 {
    interface ZoomBehavior<T extends d3.ZoomableElement, K> {
      (selection: d3.Selection<T, K, any, any>): d3.Selection<T, K, any, any>;
      transform: (
        selection: d3.Selection<T, K, any, any>,
        transform: d3.ZoomTransform
      ) => d3.Selection<T, K, any, any>;
      translateBy: (
        selection: d3.Selection<T, K, any, any>,
        x: number,
        y: number
      ) => d3.Selection<T, K, any, any>;
      translateTo: (
        selection: d3.Selection<T, K, any, any>,
        x: number,
        y: number
      ) => d3.Selection<T, K, any, any>;
      scaleBy: (
        selection: d3.Selection<T, K, any, any>,
        k: number
      ) => d3.Selection<T, K, any, any>;
      scaleTo: (
        selection: d3.Selection<T, K, any, any>,
        k: number
      ) => d3.Selection<T, K, any, any>;
    }
  }

  interface SVGSVGElement {
    __zoomObj?: d3.ZoomBehavior<SVGSVGElement, unknown>;
  }
}
