// src/component/FamilyTree/hooks/useZoomPan.ts - COMPLETELY REWRITTEN
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
  // Create a local state to track when zoom is ready
  const [isZoomReady, setIsZoomReady] = useState(false);

  // Store zoom behavior in a ref
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>();

  // Create and initialize zoom behavior
  useEffect(() => {
    if (!svgRef.current || !viewRef.current) {
      console.log('SVG or view refs not available yet');
      return;
    }

    try {
      console.log('Setting up zoom behavior', { svg: svgRef.current });

      // Create and configure zoom behavior
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 3]) // Allow zooming from 0.1x to 3x
        .on('zoom', event => {
          if (!viewRef.current) {
            return;
          }

          // Apply transform to the view group
          const transform = event.transform;
          viewRef.current.setAttribute(
            'transform',
            `translate(${transform.x}, ${transform.y}) scale(${transform.k})`
          );

          // Call callback if provided
          if (onZoom) {
            onZoom(transform.x, transform.y, transform.k);
          }
        });

      // Get the selection and clear any existing handlers
      const selection = d3.select(svgRef.current);
      selection.on('.zoom', null);

      // Apply zoom behavior to SVG element - explicitly enable drag
      selection.call(zoom);

      // Store zoom in ref
      zoomRef.current = zoom;

      // Mark zoom as ready
      setIsZoomReady(true);

      // Log success
      console.log('Zoom behavior initialized successfully');

      // Clean up zoom behavior on unmount
      return () => {
        console.log('Cleaning up zoom behavior');
        if (svgRef.current) {
          selection.on('.zoom', null);
        }
      };
    } catch (error) {
      console.error('Error setting up zoom behavior:', error);
    }
  }, [svgRef.current, viewRef.current]); // Depend on refs themselves

  // Function to fit tree to view
  const fitTree = useCallback(() => {
    // Ensure we have all requirements
    if (!svgRef.current) {
      console.error('Cannot fit tree: svgRef not available');
      return;
    }

    if (!zoomRef.current) {
      console.error('Cannot fit tree: zoom behavior not initialized yet');
      return;
    }

    if (!dimensions || !dimensions.width || !dimensions.height) {
      console.error('Cannot fit tree: invalid dimensions', dimensions);
      return;
    }

    try {
      console.log('Fitting tree to view with dimensions:', dimensions);

      const svg = svgRef.current;
      const zoom = zoomRef.current;

      // Get SVG dimensions
      const svgRect = svg.getBoundingClientRect();
      const svgWidth = svgRect.width;
      const svgHeight = svgRect.height;

      console.log('SVG dimensions:', { width: svgWidth, height: svgHeight });

      // Calculate scale to fit tree with 10% margin
      const scaleX = (svgWidth * 0.9) / dimensions.width;
      const scaleY = (svgHeight * 0.9) / dimensions.height;
      let scale = Math.min(scaleX, scaleY, 3); // Don't zoom in more than 3x

      // Ensure reasonable scale bounds
      scale = Math.max(0.1, Math.min(scale, 2));

      // Calculate center position
      const centerX =
        dimensions.x_off + (svgWidth - dimensions.width * scale) / (2 * scale);
      const centerY =
        dimensions.y_off +
        (svgHeight - dimensions.height * scale) / (2 * scale);

      console.log('Calculated fit transform:', { scale, centerX, centerY });

      // Apply transform with transition
      d3.select(svg)
        .transition()
        .duration(transitionTime)
        .call(
          zoom.transform,
          d3.zoomIdentity.translate(centerX, centerY).scale(scale)
        );

      console.log('Fit tree transition applied');
    } catch (error) {
      console.error('Error during fitTree:', error);
    }
  }, [dimensions, transitionTime]);

  // Initial fit when zoom is ready and dimensions are available
  useEffect(() => {
    if (isZoomReady && dimensions && dimensions.width && dimensions.height) {
      console.log('Attempting initial fit on mount');
      // Delay the initial fit slightly to ensure DOM is ready
      const timer = setTimeout(() => {
        fitTree();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isZoomReady, dimensions?.width, dimensions?.height]);

  // Zoom in function
  const zoomIn = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) {
      console.error('Cannot zoom in: missing refs');
      return;
    }

    try {
      console.log('Zooming in');
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 1.3);
    } catch (error) {
      console.error('Error during zoom in:', error);
    }
  }, []);

  // Zoom out function
  const zoomOut = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) {
      console.error('Cannot zoom out: missing refs');
      return;
    }

    try {
      console.log('Zooming out');
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 0.7);
    } catch (error) {
      console.error('Error during zoom out:', error);
    }
  }, []);

  // Return zoom controls
  return {
    fitTree,
    zoomIn,
    zoomOut,
    isZoomReady,
  };
}
