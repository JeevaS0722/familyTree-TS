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
import { findPathToMain } from '../../utils/pathFinder';

interface TreeViewProps {
  svgRef: React.RefObject<SVGSVGElement>;
  onPersonClick?: (personId: string) => void;
  onPersonEdit?: (person: PersonData) => void;
}

const TreeView: React.FC<TreeViewProps> = React.memo(
  ({ svgRef, onPersonClick, onPersonEdit }) => {
    const { state, updateTree, updateMainId } = useTreeContext();
    const viewRef = useRef<SVGGElement>(null);
    const cardsViewRef = useRef<SVGGElement>(null);
    const linksViewRef = useRef<SVGGElement>(null);
    const highlightPathRef = useRef<string | null>(null);
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

    const { fitTree, zoomIn, zoomOut } = useZoomPan({
      svgRef,
      viewRef,
      dimensions: state.treeData?.dim || {
        width: 0,
        height: 0,
        x_off: 0,
        y_off: 0,
      },
      transitionTime: state.config.transitionTime,
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
    const links = React.useMemo(() => {
      if (!state.treeData?.data) {
        return [];
      }

      const allLinks: TreeLink[] = [];

      state.treeData.data.forEach(node => {
        createLinks({
          d: node,
          tree: state.treeData!.data,
          is_horizontal: state.config.isHorizontal,
        }).forEach(link => {
          if (!allLinks.some(l => l.id === link.id)) {
            allLinks.push(link);
          }
        });
      });

      return allLinks;
    }, [state.treeData, state.config.isHorizontal]);

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
      console.log('Initializing tree');
      updateTree({ initial: true });
    }, []);

    // Fit tree when dimensions change
    useEffect(() => {
      if (state.treeData?.dim) {
        console.log(
          'Tree dimensions changed, fitting tree',
          state.treeData.dim
        );

        // Slight delay to ensure DOM is ready
        const timeoutId = setTimeout(() => {
          console.log('Calling fitTree');
          fitTree();
        }, 200);

        return () => clearTimeout(timeoutId);
      }
    }, [state.treeData?.dim, fitTree]);

    // Handle person click
    const handlePersonClick = useCallback(
      (node: TreeNode) => {
        console.log('Person clicked:', node.data.id);

        // Update main ID
        updateMainId(node.data.id);

        // Update tree
        updateTree({});

        // Call external handler if provided
        if (onPersonClick) {
          onPersonClick(node.data.id);
        }
      },
      [updateMainId, updateTree, onPersonClick]
    );

    // In TreeView.tsx - update the highlight function for smooth animation
    const highlightPathToMain = useCallback(
      (node: TreeNode) => {
        if (!state.treeData || !cardsViewRef.current || !linksViewRef.current) {
          return;
        }

        // Find the main node
        const mainNode = state.treeData.data.find(n => n.data.main);
        if (!mainNode) {
          console.error('Main node not found');
          return;
        }

        // Store a reference to the hovered node for cancellation
        highlightPathRef.current = node.data.id;

        // Find path from node to main
        const { nodePath, linkPath } = findPathToMain(
          state.treeData.data,
          links,
          node,
          mainNode
        );

        // Calculate "distance" from hovered node for each element in the path
        const nodeDistances = new Map<string, number>();
        nodePath.forEach((pathNode, index) => {
          nodeDistances.set(pathNode.data.id, index);
        });

        // Apply highlight classes with staggered animation
        nodePath.forEach((pathNode, index) => {
          const nodeElement = cardsViewRef.current!.querySelector(
            `[data-id="${pathNode.data.id}"]`
          );

          if (nodeElement) {
            const cardInner = nodeElement.querySelector('.card-inner');
            if (cardInner) {
              // Calculate delay based on position in path
              const delay = index * 150 + 50; // 200ms delay between each node

              // Use d3 for a smooth transition
              d3.select(cardInner)
                .transition()
                .duration(0)
                .delay(delay)
                .on('end', function () {
                  // Check if we're still highlighting the same path
                  if (highlightPathRef.current === node.data.id) {
                    cardInner.classList.add('f3-path-to-main');
                  }
                });
            }
          }
        });

        // Apply highlight to links with staggered animation
        linkPath.forEach((link, index) => {
          const linkElement = linksViewRef.current!.querySelector(
            `[data-link-id="${link.id}"]`
          );

          if (linkElement) {
            // Calculate delay based on the nodes this link connects
            let nodeIndex = 0;
            if (Array.isArray(link.source)) {
              // For links with multiple sources, find the earliest in the path
              nodeIndex = Math.min(
                ...link.source
                  .map(s => nodeDistances.get(s.data.id) || Infinity)
                  .filter(n => n !== Infinity)
              );
            } else {
              nodeIndex = nodeDistances.get(link.source.data.id) || 0;
            }

            // Delay link highlighting to appear between node highlights
            const delay = nodeIndex * 150; // 100ms after the source node

            d3.select(linkElement)
              .transition()
              .duration(0)
              .delay(delay)
              .on('end', function () {
                // Check if we're still highlighting the same path
                if (highlightPathRef.current === node.data.id) {
                  linkElement.classList.add('f3-path-to-main');
                }
              });
          }
        });
      },
      [state.treeData, links]
    );

    // Update clear highlight function
    const clearPathHighlight = useCallback(() => {
      // Clear the current highlight reference
      highlightPathRef.current = null;

      if (!cardsViewRef.current || !linksViewRef.current) {
        return;
      }

      // Clear card highlights with fade-out animation
      const highlightedCards = cardsViewRef.current.querySelectorAll(
        '.card-inner.f3-path-to-main'
      );
      highlightedCards.forEach(el => {
        d3.select(el)
          .transition()
          .duration(300)
          .on('end', function () {
            el.classList.remove('f3-path-to-main');
          });
      });

      // Clear link highlights with fade-out animation
      const highlightedLinks = linksViewRef.current.querySelectorAll(
        '.link.f3-path-to-main'
      );
      highlightedLinks.forEach(el => {
        d3.select(el)
          .transition()
          .duration(200)
          .on('end', function () {
            el.classList.remove('f3-path-to-main');
          });
      });
    }, []);

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
              {state.treeData.data.map(node => (
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
                  onMouseEnter={() => highlightPathToMain(node)}
                  onMouseLeave={clearPathHighlight}
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
