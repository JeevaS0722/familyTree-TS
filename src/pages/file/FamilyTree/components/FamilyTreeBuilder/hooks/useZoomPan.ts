import { useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import { TreeDimensions } from '../types/familyTree';

interface UseZoomPanParams {
  svgRef: React.RefObject<SVGSVGElement>;
  viewRef: React.RefObject<SVGGElement>;
  dimensions: TreeDimensions;
  transitionTime?: number;
  onZoom?: (x: number, y: number, k: number) => void;
}

export function useZoomPan({
  svgRef,
  viewRef,
  dimensions,
  transitionTime = 2000,
  onZoom,
}: UseZoomPanParams) {
  const isInitialFit = useRef(true);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>();

  useEffect(() => {
    if (!svgRef.current || !viewRef.current) {
      return;
    }

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on('zoom', event => {
        if (!viewRef.current) {
          return;
        }

        const { x, y, k } = event.transform;
        viewRef.current.setAttribute(
          'transform',
          `translate(${x}, ${y}) scale(${k})`
        );

        if (onZoom) {
          onZoom(x, y, k);
        }
      });

    svgRef.current.__zoomObj = zoom;
    zoomBehaviorRef.current = zoom;

    d3.select(svgRef.current).call(zoom);

    return () => {
      if (svgRef.current) {
        d3.select(svgRef.current).on('.zoom', null);
      }
    };
  }, [svgRef.current, viewRef.current]);

  const fitTree = useCallback(() => {
    if (
      !svgRef.current ||
      !dimensions ||
      !dimensions.width ||
      !dimensions.height
    ) {
      return;
    }

    const svg = svgRef.current;
    const zoom = svg.__zoomObj || zoomBehaviorRef.current;
    if (!zoom) {
      return;
    }

    const svgRect = svg.getBoundingClientRect();
    const svgWidth = svgRect.width;
    const svgHeight = svgRect.height;

    let k = Math.min(
      svgWidth / dimensions.width,
      svgHeight / dimensions.height
    );
    if (k > 1) {
      k = 1;
    }

    const x = dimensions.x_off + (svgWidth - dimensions.width * k) / k / 2;
    const y = dimensions.y_off + (svgHeight - dimensions.height * k) / k / 2;

    const initialDuration = isInitialFit.current ? 0 : transitionTime;

    d3.select(svg)
      .transition()
      .duration(initialDuration)
      .call(zoom.transform, d3.zoomIdentity.scale(k).translate(x, y));

    isInitialFit.current = false;
  }, [dimensions, transitionTime]);

  const zoomIn = useCallback(() => {
    if (!svgRef.current) {
      return;
    }
    const zoom = svgRef.current.__zoomObj || zoomBehaviorRef.current;
    if (!zoom) {
      return;
    }

    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(zoom.scaleBy, 1.2);
  }, []);

  const zoomOut = useCallback(() => {
    if (!svgRef.current) {
      return;
    }
    const zoom = svgRef.current.__zoomObj || zoomBehaviorRef.current;
    if (!zoom) {
      return;
    }

    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(zoom.scaleBy, 0.8);
  }, []);

  return { fitTree, zoomIn, zoomOut };
}
