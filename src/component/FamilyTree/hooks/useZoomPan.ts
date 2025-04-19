// src/hooks/useZoomPan.ts
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

interface ZoomState {
  scale: number;
  x: number;
  y: number;
}

export function useZoomPan({
  svgRef,
  viewRef,
  dimensions,
  transitionTime = 2000,
  onZoom,
}: UseZoomPanParams) {
  const [zoomState, setZoomState] = useState<ZoomState>({
    scale: 1,
    x: 0,
    y: 0,
  });
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>();
  const isZoomingRef = useRef(false);
  const lastTransformRef = useRef({ x: 0, y: 0, k: 1 });

  // Initialize zoom behavior
  useEffect(() => {
    if (!svgRef.current || !viewRef.current) {
      return;
    }

    // Create the zoom behavior if it doesn't exist
    if (!zoomBehaviorRef.current) {
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 3])
        .on('start', () => {
          isZoomingRef.current = true;
        })
        .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
          if (!viewRef.current) {
            return;
          }

          const { transform } = event;
          lastTransformRef.current = {
            x: transform.x,
            y: transform.y,
            k: transform.k,
          };

          // Apply transform directly using D3
          d3.select(viewRef.current).attr(
            'transform',
            `translate(${transform.x}, ${transform.y}) scale(${transform.k})`
          );

          if (!isZoomingRef.current || event.sourceEvent === null) {
            setZoomState({
              scale: transform.k,
              x: transform.x,
              y: transform.y,
            });

            if (onZoom) {
              requestAnimationFrame(() => {
                onZoom(transform.x, transform.y, transform.k);
              });
            }
          }
        })
        .on('end', () => {
          isZoomingRef.current = false;

          const { x, y, k } = lastTransformRef.current;
          setZoomState({ scale: k, x, y });

          if (onZoom) {
            onZoom(x, y, k);
          }
        });

      zoomBehaviorRef.current = zoom;

      // Apply zoom behavior to SVG
      d3.select(svgRef.current).call(zoom);

      // For debugging
      if (svgRef.current) {
        svgRef.current.__zoomObj = zoom;
      }
    }

    return () => {
      if (svgRef.current) {
        try {
          d3.select(svgRef.current).on('.zoom', null);
        } catch (e) {
          console.error('Error removing zoom behavior:', e);
        }
      }
    };
  }, [svgRef.current, viewRef.current]); // Use refs directly to prevent recreation

  // Function to fit tree within viewport
  const fitTree = useCallback(() => {
    if (!svgRef.current || !zoomBehaviorRef.current || !dimensions) {
      return;
    }

    const svg = svgRef.current;
    const svgWidth = svg.clientWidth;
    const svgHeight = svg.clientHeight;

    // Calculate scale to fit tree
    const scale = Math.min(
      svgWidth / dimensions.width,
      svgHeight / dimensions.height,
      1 // Cap scale at 1
    );

    // Calculate position to center tree
    const x =
      dimensions.x_off + (svgWidth - dimensions.width * scale) / scale / 2;
    const y =
      dimensions.y_off + (svgHeight - dimensions.height * scale) / scale / 2;

    // Apply transform with transition
    isZoomingRef.current = true;

    try {
      d3.select(svg)
        .transition()
        .duration(transitionTime)
        .call(
          zoomBehaviorRef.current.transform,
          d3.zoomIdentity.scale(scale).translate(x, y)
        )
        .on('end', () => {
          isZoomingRef.current = false;
          setZoomState({ scale, x, y });

          if (onZoom) {
            onZoom(x, y, scale);
          }
        });
    } catch (e) {
      console.error('Error during fit tree:', e);
      isZoomingRef.current = false;
    }
  }, [dimensions, transitionTime, onZoom]);

  // Function to zoom in
  const zoomIn = useCallback((factor = 1.3) => {
    if (!svgRef.current || !zoomBehaviorRef.current) {
      return;
    }

    try {
      isZoomingRef.current = true;
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomBehaviorRef.current.scaleBy, factor)
        .on('end', () => {
          isZoomingRef.current = false;
        });
    } catch (e) {
      console.error('Error during zoom in:', e);
      isZoomingRef.current = false;
    }
  }, []);

  // Function to zoom out
  const zoomOut = useCallback((factor = 0.7) => {
    if (!svgRef.current || !zoomBehaviorRef.current) {
      return;
    }

    try {
      isZoomingRef.current = true;
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomBehaviorRef.current.scaleBy, factor)
        .on('end', () => {
          isZoomingRef.current = false;
        });
    } catch (e) {
      console.error('Error during zoom out:', e);
      isZoomingRef.current = false;
    }
  }, []);

  // Function to center on a specific node
  const centerNode = useCallback(
    (x: number, y: number, scale = 1) => {
      if (!svgRef.current || !zoomBehaviorRef.current) {
        return;
      }

      const svg = svgRef.current;
      const svgWidth = svg.clientWidth;
      const svgHeight = svg.clientHeight;

      const centerX = svgWidth / 2 - x * scale;
      const centerY = svgHeight / 2 - y * scale;

      isZoomingRef.current = true;

      try {
        d3.select(svg)
          .transition()
          .duration(transitionTime)
          .call(
            zoomBehaviorRef.current.transform,
            d3.zoomIdentity
              .scale(scale)
              .translate(centerX / scale, centerY / scale)
          )
          .on('end', () => {
            isZoomingRef.current = false;
            setZoomState({ scale, x: centerX / scale, y: centerY / scale });

            if (onZoom) {
              onZoom(centerX / scale, centerY / scale, scale);
            }
          });
      } catch (e) {
        console.error('Error centering node:', e);
        isZoomingRef.current = false;
      }
    },
    [transitionTime, onZoom]
  );

  // Get the current zoom behavior (for external use)
  const getZoomBehavior = useCallback(() => {
    return zoomBehaviorRef.current;
  }, []);

  return {
    zoomState,
    fitTree,
    centerNode,
    zoomIn,
    zoomOut,
    getZoomBehavior,
  };
}
