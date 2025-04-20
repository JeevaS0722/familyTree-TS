// src/component/FamilyTree/components/FamilyTree/TreeView.tsx
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
import { calculateEnterAndExitPositions } from '../../utils/animationUtils';
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
    const [isTreeCalculated, setIsTreeCalculated] = useState(false);

    // Keep track of exiting nodes and previously rendered nodes
    const [exitingNodes, setExitingNodes] = useState<TreeNode[]>([]);
    const prevNodesRef = useRef<TreeNode[]>([]);

    // Initialize zoom and pan functionality
    const { fitTree, zoomIn, zoomOut, isZoomReady } = useZoomPan({
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

    // Direct D3 zoom setup for the SVG - backup approach
    useEffect(() => {
      if (!svgRef.current || !viewRef.current) {
        return;
      }

      try {
        console.log('Setting up direct D3 zoom');

        // Create zoom behavior
        const zoom = d3
          .zoom()
          .scaleExtent([0.1, 3])
          .on('zoom', event => {
            if (!viewRef.current) {
              return;
            }

            // Apply transform
            viewRef.current.setAttribute(
              'transform',
              `translate(${event.transform.x}, ${event.transform.y}) scale(${event.transform.k})`
            );
          });

        // Apply to SVG - explicitly set pointer-events
        const svg = d3.select(svgRef.current);

        // Clear any existing handlers
        svg.on('.zoom', null);

        // Apply new zoom behavior
        svg.call(zoom);

        // Store on DOM element for direct access
        svgRef.current.__zoomObj = zoom;

        // Log success
        console.log('Direct D3 zoom setup complete');

        return () => {
          if (svgRef.current) {
            svg.on('.zoom', null);
          }
        };
      } catch (error) {
        console.error('Error in direct D3 zoom setup:', error);
      }
    }, [svgRef.current, viewRef.current]);

    // Create links for all nodes
    const links = useMemo(() => {
      if (!state.treeData?.data) {
        return [];
      }

      const allLinks: TreeLink[] = [];

      // Create links for current nodes
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

    // Process entering/exiting nodes
    useEffect(() => {
      if (!state.treeData?.data) {
        return;
      }

      const currentIds = new Set(state.treeData.data.map(n => n.data.id));

      // Calculate exiting nodes
      const newExitingNodes = prevNodesRef.current
        .filter(node => !currentIds.has(node.data.id))
        .map(node => {
          // Clone node to avoid mutating shared state
          const exitingNode = { ...node, exiting: true };
          calculateEnterAndExitPositions(
            exitingNode,
            false,
            true,
            prevNodesRef.current
          );
          return exitingNode;
        });

      // Mark entering nodes
      state.treeData.data.forEach(node => {
        if (!prevNodesRef.current.some(n => n.data.id === node.data.id)) {
          calculateEnterAndExitPositions(
            node,
            true,
            false,
            state.treeData.data
          );
        }
      });

      // Update exiting nodes - they'll animate out then be removed
      setExitingNodes(newExitingNodes);

      // After transition time, clear exiting nodes
      const timer = setTimeout(() => {
        setExitingNodes([]);
      }, state.config.transitionTime + 100);

      // Remember current nodes for next update
      prevNodesRef.current = [...state.treeData.data];

      return () => clearTimeout(timer);
    }, [state.treeData?.data]);

    // Initialize tree on first render
    useEffect(() => {
      console.log('First-time tree initialization');

      // Initialize the tree
      updateTree({ initial: true });

      // Mark tree as calculated
      setIsTreeCalculated(true);
    }, []);

    // Fit tree when dimensions change or tree is calculated
    useEffect(() => {
      if (!state.treeData?.dim || !isTreeCalculated || !isZoomReady) {
        console.log('Waiting for tree dimensions or zoom to be ready');
        return;
      }

      console.log(
        'Tree dimensions and zoom ready, fitting tree',
        state.treeData.dim
      );

      // Delay fitting to ensure DOM has updated
      const timeoutId = setTimeout(() => {
        console.log('Calling fitTree after dimensions change');
        fitTree();
      }, 500);

      return () => clearTimeout(timeoutId);
    }, [state.treeData?.dim, isTreeCalculated, isZoomReady]);

    // Handle person click
    const handlePersonClick = useCallback(
      (node: TreeNode) => {
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

    // Handle path highlight
    const highlightPathToMain = useCallback(
      (node: TreeNode) => {
        if (!state.treeData || !cardsViewRef.current || !linksViewRef.current) {
          return;
        }

        // Find the main node
        const mainNode = state.treeData.data.find(n => n.data.main);
        if (!mainNode) {
          return;
        }

        // Store current hovered node for cancellation
        highlightPathRef.current = node.data.id;

        // Get path from node to main
        const { nodePath, linkPath } = findPathToMain(
          state.treeData.data,
          links,
          node,
          mainNode
        );

        // Apply highlights with staggered animation
        nodePath.forEach((pathNode, index) => {
          const nodeElement = cardsViewRef.current!.querySelector(
            `[data-id="${pathNode.data.id}"]`
          );

          if (nodeElement) {
            const cardInner = nodeElement.querySelector('.card-inner');
            if (cardInner) {
              const delay = index * 150;
              d3.select(cardInner)
                .transition()
                .duration(0)
                .delay(delay)
                .on('end', function () {
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
            const delay = index * 150;
            d3.select(linkElement)
              .transition()
              .duration(0)
              .delay(delay)
              .on('end', function () {
                if (highlightPathRef.current === node.data.id) {
                  linkElement.classList.add('f3-path-to-main');
                }
              });
          }
        });
      },
      [state.treeData, links]
    );

    // Clear highlight
    const clearPathHighlight = useCallback(() => {
      highlightPathRef.current = null;

      if (!cardsViewRef.current || !linksViewRef.current) {
        return;
      }

      // Clear all highlights with fade-out
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
      return <div>Loading tree data...</div>;
    }

    return (
      <>
        <svg
          className="main_svg"
          ref={svgRef}
          style={{
            cursor: 'grab',
            touchAction: 'none', // Prevents browser handling of drag gestures
          }}
          onMouseDown={() => {
            // Change cursor on drag start
            if (svgRef.current) {
              svgRef.current.style.cursor = 'grabbing';
            }
          }}
          onMouseUp={() => {
            // Restore cursor on drag end
            if (svgRef.current) {
              svgRef.current.style.cursor = 'grab';
            }
          }}
        >
          <SvgDefs cardDimensions={state.config.cardDimensions} />

          {/* Background rect for pan/zoom */}
          <rect
            width="100%"
            height="100%"
            fill="transparent"
            pointerEvents="all"
          />

          {/* Main view container - transformed by zoom */}
          <g className="view" ref={viewRef}>
            {/* Links layer */}
            <g className="links_view" ref={linksViewRef}>
              {links.map(link => (
                <Link
                  key={link.id}
                  link={link}
                  transitionTime={state.config.transitionTime}
                />
              ))}
            </g>

            {/* Cards layer */}
            <g className="cards_view" ref={cardsViewRef}>
              {/* Render current nodes */}
              {state.treeData.data.map(node => (
                <Card
                  key={node.data.id}
                  node={node}
                  cardDimensions={state.config.cardDimensions}
                  showMiniTree={state.config.showMiniTree}
                  transitionTime={state.config.transitionTime}
                  treeData={state.treeData}
                  onClick={handlePersonClick}
                  onEdit={
                    onPersonEdit ? () => onPersonEdit(node.data) : undefined
                  }
                  onMouseEnter={highlightPathToMain}
                  onMouseLeave={clearPathHighlight}
                />
              ))}

              {/* Render exiting nodes */}
              {exitingNodes.map(node => (
                <Card
                  key={`exit-${node.data.id}`}
                  node={node}
                  cardDimensions={state.config.cardDimensions}
                  showMiniTree={false}
                  transitionTime={state.config.transitionTime}
                  treeData={state.treeData}
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
