// src/component/FamilyTree/hooks/useZoomPan.ts
import { useRef, useEffect, useCallback, useState } from 'react';
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
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>();
  const [isZoomReady, setIsZoomReady] = useState(false);

  // Create and initialize zoom behavior
  useEffect(() => {
    if (!svgRef.current || !viewRef.current) {
      return;
    }

    // Create and configure zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on('zoom', event => {
        if (!viewRef.current) {
          return;
        }

        const transform = event.transform;
        viewRef.current.setAttribute(
          'transform',
          `translate(${transform.x}, ${transform.y}) scale(${transform.k})`
        );

        if (onZoom) {
          onZoom(transform.x, transform.y, transform.k);
        }
      });

    // Store on DOM element for direct access - THIS IS CRITICAL
    svgRef.current.__zoomObj = zoom;

    // Apply zoom behavior to SVG element
    const selection = d3.select(svgRef.current);
    selection.on('.zoom', null); // Clear any existing handlers
    selection.call(zoom);

    // Store zoom in ref
    zoomRef.current = zoom;
    setIsZoomReady(true);

    return () => {
      if (svgRef.current) {
        selection.on('.zoom', null);
      }
    };
  }, [svgRef.current, viewRef.current, onZoom]);

  // Function to fit tree to view - IMPROVED TIMING
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
    const zoom = svg.__zoomObj || zoomRef.current;
    if (!zoom) {
      return;
    }

    // Get SVG dimensions
    const svgRect = svg.getBoundingClientRect();
    const svgWidth = svgRect.width;
    const svgHeight = svgRect.height;

    // Calculate scale to fit tree
    const scaleX = svgWidth / (dimensions.width + 50); // Add padding
    const scaleY = svgHeight / (dimensions.height + 50);
    const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in more than 1x

    // Calculate center position - CRITICAL FOR SMOOTH CENTERING
    const centerX =
      dimensions.x_off + (svgWidth - dimensions.width * scale) / (2 * scale);
    const centerY =
      dimensions.y_off + (svgHeight - dimensions.height * scale) / (2 * scale);

    // Apply transform with transition AND DELAY - key to smooth animation
    d3.select(svg)
      .transition()
      .duration(transitionTime)
      .delay(100) // This 100ms delay is crucial for smooth animation
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(centerX, centerY).scale(scale)
      );
  }, [dimensions, transitionTime]);

  // Zoom in function with smoother animation
  const zoomIn = useCallback(() => {
    if (!svgRef.current) {
      return;
    }

    const zoom = svgRef.current.__zoomObj || zoomRef.current;
    if (!zoom) {
      return;
    }

    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(zoom.scaleBy, 1.2);
  }, []);

  // Zoom out function with smoother animation
  const zoomOut = useCallback(() => {
    if (!svgRef.current) {
      return;
    }

    const zoom = svgRef.current.__zoomObj || zoomRef.current;
    if (!zoom) {
      return;
    }

    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(zoom.scaleBy, 0.8);
  }, []);

  return {
    fitTree,
    zoomIn,
    zoomOut,
    isZoomReady,
  };
}
