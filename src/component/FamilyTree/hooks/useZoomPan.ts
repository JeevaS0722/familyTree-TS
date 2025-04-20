// src/hooks/useZoomPan.ts - Complete rewrite for reliability
import { useRef, useEffect, useState, useCallback } from 'react';
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
  // Store zoom behavior in a ref so it persists across renders
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>();

  // Flag to track if zoom behavior is initialized
  const isInitializedRef = useRef(false);

  // Initialize zoom behavior ONCE and store it
  useEffect(() => {
    // Only initialize once
    if (isInitializedRef.current) {
      return;
    }

    if (!svgRef.current || !viewRef.current) {
      return;
    }

    console.log('Initializing zoom behavior');

    // Create zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on('zoom', event => {
        if (!viewRef.current) {
          return;
        }

        // Apply transform
        d3.select(viewRef.current).attr(
          'transform',
          `translate(${event.transform.x}, ${event.transform.y}) scale(${event.transform.k})`
        );

        // Notify listeners
        if (onZoom) {
          onZoom(event.transform.x, event.transform.y, event.transform.k);
        }
      });

    // Store zoom behavior in ref
    zoomBehaviorRef.current = zoom;

    // CRITICAL: Directly attach to DOM element for debugging and direct access
    svgRef.current.__zoomObj = zoom;

    // Apply zoom behavior to SVG element
    d3.select(svgRef.current).call(zoom);

    // Mark as initialized
    isInitializedRef.current = true;

    console.log('Zoom behavior initialized', zoom);

    return () => {
      if (svgRef.current) {
        try {
          d3.select(svgRef.current).on('.zoom', null);
        } catch (e) {
          console.error('Error removing zoom:', e);
        }
      }
    };
  }, [svgRef.current, viewRef.current, onZoom]);

  // Fit tree function with robust error handling
  const fitTree = useCallback(() => {
    if (!svgRef.current) {
      console.error('SVG ref not available for fitTree');
      return;
    }

    if (!dimensions) {
      console.error('Dimensions not available for fitTree');
      return;
    }

    // RELIABLE way to get zoom behavior - try ref first, then DOM
    const zoom = zoomBehaviorRef.current || svgRef.current.__zoomObj;

    if (!zoom) {
      console.error('Zoom behavior not found for fitTree');
      return;
    }

    console.log('Fitting tree with zoom:', zoom);

    const svg = svgRef.current;
    const svgWidth = svg.clientWidth;
    const svgHeight = svg.clientHeight;

    // Calculate scale to fit tree
    const scale = Math.min(
      svgWidth / dimensions.width,
      svgHeight / dimensions.height,
      0.95 // Limit scale for padding
    );

    // Calculate position to center tree
    const x =
      dimensions.x_off + (svgWidth - dimensions.width * scale) / scale / 2;
    const y =
      dimensions.y_off + (svgHeight - dimensions.height * scale) / scale / 2;

    try {
      // Apply transform with transition
      d3.select(svg)
        .transition()
        .duration(transitionTime)
        .call(zoom.transform, d3.zoomIdentity.scale(scale).translate(x, y));

      console.log('Tree fitted with transform:', { scale, x, y });
    } catch (e) {
      console.error('Error during fit tree:', e);
    }
  }, [dimensions, transitionTime, zoomBehaviorRef.current, svgRef.current]);

  // Zoom in function with robust error handling
  const zoomIn = useCallback(() => {
    if (!svgRef.current) {
      console.error('SVG ref not available for zoomIn');
      return;
    }

    // RELIABLE way to get zoom behavior - try ref first, then DOM
    const zoom = zoomBehaviorRef.current || svgRef.current.__zoomObj;

    if (!zoom) {
      console.error('Zoom behavior not found for zoom in');
      return;
    }

    console.log('Zooming in with zoom:', zoom);

    try {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoom.scaleBy, 1.3);
    } catch (e) {
      console.error('Error during zoom in:', e);
    }
  }, [zoomBehaviorRef.current, svgRef.current]);

  // Zoom out function with robust error handling
  const zoomOut = useCallback(() => {
    if (!svgRef.current) {
      console.error('SVG ref not available for zoomOut');
      return;
    }

    // RELIABLE way to get zoom behavior - try ref first, then DOM
    const zoom = zoomBehaviorRef.current || svgRef.current.__zoomObj;

    if (!zoom) {
      console.error('Zoom behavior not found for zoom out');
      return;
    }

    console.log('Zooming out with zoom:', zoom);

    try {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoom.scaleBy, 0.7);
    } catch (e) {
      console.error('Error during zoom out:', e);
    }
  }, [zoomBehaviorRef.current, svgRef.current]);

  return { fitTree, zoomIn, zoomOut };
}
