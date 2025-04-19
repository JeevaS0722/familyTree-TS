// src/components/FamilyTree/TreeView.tsx
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import * as d3 from 'd3';
import { useTreeContext } from '../../context/TreeContext';
import { useZoomPan } from '../../hooks/useZoomPan';
import { PersonData, TreeNode, TreeLink } from '../../types/familyTree';
import { createLinks } from '../../utils/linkCreator';
import Card from './Card';
import Link from './Link';
import SvgDefs from './SvgDefs';
import Toolbar from './controls/Toolbar';

interface TreeViewProps {
  svgRef: React.RefObject<SVGSVGElement>;
  onPersonClick?: (personId: string) => void;
  onPersonEdit?: (person: PersonData) => void;
}

const TreeView: React.FC<TreeViewProps> = React.memo(
  ({ svgRef, onPersonClick, onPersonEdit }) => {
    const { state, updateTree } = useTreeContext();
    const viewRef = useRef<SVGGElement>(null);
    const cardsViewRef = useRef<SVGGElement>(null);
    const linksViewRef = useRef<SVGGElement>(null);
    const [containerSize, setContainerSize] = useState({
      width: 1000,
      height: 600,
    });

    // Use a ref for viewport position to avoid re-renders
    const viewportPositionRef = useRef({ x: 0, y: 0, scale: 1 });
    const [, forceUpdate] = useState({});

    // Throttle zoom updates
    const handleZoom = useCallback((x: number, y: number, k: number) => {
      // Store new position in ref without causing re-render
      viewportPositionRef.current = { x, y, scale: k };

      // Force re-render for virtualization, but throttled
      requestAnimationFrame(() => {
        forceUpdate({});
      });
    }, []);

    const { fitTree, centerNode, zoomIn, zoomOut, getZoomBehavior } =
      useZoomPan({
        svgRef,
        viewRef,
        dimensions: state.treeData?.dim || {
          width: 0,
          height: 0,
          x_off: 0,
          y_off: 0,
        },
        transitionTime: state.config.transitionTime,
        onZoom: handleZoom,
      });

    // Get virtualized nodes (only those in view)
    const visibleNodes = useMemo(() => {
      if (!state.treeData?.data) {
        return [];
      }

      // If there are fewer than 100 nodes, don't virtualize
      if (state.treeData.data.length < 100) {
        return state.treeData.data;
      }

      const vp = viewportPositionRef.current;

      // Simple virtualization logic with buffer zone
      const buffer = 300;
      const viewportLeft = -vp.x / vp.scale - buffer;
      const viewportTop = -vp.y / vp.scale - buffer;
      const viewportRight =
        viewportLeft + containerSize.width / vp.scale + buffer * 2;
      const viewportBottom =
        viewportTop + containerSize.height / vp.scale + buffer * 2;

      return state.treeData.data.filter(node => {
        const nodeLeft = node.x - 150; // Increased buffer for node width
        const nodeTop = node.y - 75; // Increased buffer for node height
        const nodeRight = node.x + 150;
        const nodeBottom = node.y + 75;

        return (
          nodeRight >= viewportLeft &&
          nodeLeft <= viewportRight &&
          nodeBottom >= viewportTop &&
          nodeTop <= viewportBottom
        );
      });
    }, [state.treeData?.data, containerSize, forceUpdate]);

    // Only create links for visible nodes
    const links = useMemo(() => {
      if (!state.treeData) {
        return [];
      }

      const allLinks: TreeLink[] = [];
      const visibleNodeIds = new Set(visibleNodes.map(node => node.data.id));

      // Only create links for nodes that are visible
      visibleNodes.forEach(node => {
        createLinks({
          d: node,
          tree: state.treeData!.data,
          is_horizontal: state.config.isHorizontal,
        }).forEach(link => {
          // Check if link is already in our collection to avoid duplicates
          if (!allLinks.some(l => l.id === link.id)) {
            allLinks.push(link);
          }
        });
      });

      return allLinks;
    }, [visibleNodes, state.treeData, state.config.isHorizontal]);

    // Measure container size
    useEffect(() => {
      if (!svgRef.current) {
        return;
      }

      const updateSize = () => {
        if (svgRef.current) {
          setContainerSize({
            width: svgRef.current.clientWidth,
            height: svgRef.current.clientHeight,
          });
        }
      };

      updateSize(); // Initial measurement

      const resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(svgRef.current);

      return () => {
        if (svgRef.current) {
          resizeObserver.unobserve(svgRef.current);
        }
        resizeObserver.disconnect();
      };
    }, [svgRef.current]);

    // Initialize tree on first render
    useEffect(() => {
      updateTree({ initial: true });
    }, []);

    // Fit tree when it changes
    useEffect(() => {
      if (state.treeData) {
        // Wait for a short delay to ensure all components are rendered
        const timeoutId = setTimeout(() => {
          fitTree();
        }, 100);

        return () => clearTimeout(timeoutId);
      }
    }, [state.treeData, fitTree]);

    // Handle person click
    const handlePersonClick = useCallback(
      (node: TreeNode) => {
        if (onPersonClick) {
          onPersonClick(node.data.id);
        }
      },
      [onPersonClick]
    );

    if (!state.treeData) {
      return <div>Loading...</div>;
    }

    return (
      <>
        <svg className="main_svg" ref={svgRef}>
          <SvgDefs cardDimensions={state.config.cardDimensions} />
          <rect
            width="100%"
            height="100%"
            fill="transparent"
            pointerEvents="all"
          />
          <g className="view" ref={viewRef}>
            <g className="links_view" ref={linksViewRef}>
              {links.map(link => (
                <Link
                  key={link.id}
                  link={link}
                  transitionTime={state.config.transitionTime}
                />
              ))}
            </g>
            <g className="cards_view" ref={cardsViewRef}>
              {visibleNodes.map(node => (
                <Card
                  key={node.data.id}
                  node={node}
                  cardDimensions={state.config.cardDimensions}
                  showMiniTree={state.config.showMiniTree}
                  transitionTime={state.config.transitionTime}
                  onClick={handlePersonClick}
                  onEdit={
                    onPersonEdit ? () => onPersonEdit(node.data) : undefined
                  }
                />
              ))}
            </g>
          </g>
        </svg>

        <Toolbar zoomIn={zoomIn} zoomOut={zoomOut} fitTree={fitTree} />
      </>
    );
  }
);

TreeView.displayName = 'TreeView';
export default TreeView;
