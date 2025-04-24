// src/component/FamilyTree/components/FamilyTree/TreeView.tsx
import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import * as d3 from 'd3';
import { useTreeContext } from '../context/TreeContext';
import { useZoomPan } from '../hooks/useZoomPan';
import { TreeNode, TreeLink } from '../types/familyTree';
import { createLinks } from '../utils/linkCreator';
import { calculateEnterAndExitPositions } from '../utils/animationUtils';
import Card from './Card/index';
import Link from './Link';
import SvgDefs from './SvgDefs';
import Toolbar from './controls/Toolbar';
import { findPathToMain } from '../utils/pathFinder';

interface TreeViewProps {
  svgRef: React.RefObject<SVGSVGElement>;
  onPersonClick?: (personId: string) => void;
  onPersonAdd?: (personId: string) => void;
  onPersonDelete?: (personId: string) => void;
}

const TreeView: React.FC<TreeViewProps> = React.memo(
  ({ svgRef, onPersonClick, onPersonAdd, onPersonDelete }: TreeViewProps) => {
    const {
      state,
      updateTree,
      updateMainId,
      setInitialRenderComplete,
      activateAddRelative,
      deactivateAddRelative,
    } = useTreeContext();
    const viewRef = useRef<SVGGElement>(null);
    const cardsViewRef = useRef<SVGGElement>(null);
    const linksViewRef = useRef<SVGGElement>(null);
    const firstFitDoneRef = useRef(false);
    const highlightPathRef = useRef<string | null>(null);

    // Keep track of exiting nodes and previously rendered nodes
    const [exitingNodes, setExitingNodes] = useState<TreeNode[]>([]);
    const prevNodesRef = useRef<TreeNode[]>([]);

    // Initialize zoom and pan functionality
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

    // Processing entering/exiting nodes for animation
    useEffect(() => {
      if (!state.treeData?.data) {
        return;
      }
      console.log(
        'Processing entering/exiting nodes for animation',
        state.treeData.data
      );

      const currentIds = new Set(state.treeData.data.map(n => n.data.id));

      // Handle exiting nodes
      const newExitingNodes = prevNodesRef.current
        .filter(node => !currentIds.has(node.data.id))
        .map(node => {
          // Make a copy to avoid mutating shared state
          const exitingNode = { ...node, exiting: true };
          calculateEnterAndExitPositions(exitingNode, false, true);
          return exitingNode;
        });

      // Mark entering nodes
      state.treeData.data.forEach(node => {
        if (!prevNodesRef.current.some(n => n.data.id === node.data.id)) {
          calculateEnterAndExitPositions(node, true, false);
        }
      });

      // Update exiting nodes
      setExitingNodes(newExitingNodes);

      // After transition time, remove exiting nodes
      const timer = setTimeout(() => {
        setExitingNodes([]);
      }, state.config.transitionTime + 100);

      // Save current nodes for next update
      prevNodesRef.current = [...state.treeData.data];

      return () => clearTimeout(timer);
    }, [state.treeData?.data, state.config.transitionTime]);

    // Fit tree when dimensions change
    useEffect(() => {
      if (!state.treeData?.dim) {
        return;
      }

      // Only fit on first render or forced fits
      if (!firstFitDoneRef.current) {
        console.log('Fitting tree initial');

        // Small delay to ensure DOM has mounted
        const timeoutId = setTimeout(() => {
          fitTree();
          firstFitDoneRef.current = true;

          // Mark initial render complete after the first fit
          setTimeout(() => {
            setInitialRenderComplete();
          }, state.config.transitionTime);
        }, 100);

        return () => clearTimeout(timeoutId);
      }
    }, [state.treeData?.dim, fitTree, state.config.transitionTime]);

    // When orientation or critical config changes, re-fit the tree
    useEffect(() => {
      if (firstFitDoneRef.current && state.treeData?.dim) {
        console.log('Re-fitting tree after config change');
        const timeoutId = setTimeout(() => {
          fitTree();
        }, 100);

        return () => clearTimeout(timeoutId);
      }
    }, [
      state.config.isHorizontal,
      state.config.nodeSeparation,
      state.config.levelSeparation,
    ]);

    // Function to open edit form for placeholder
    const openEditFormForPlaceholder = (node: TreeNode) => {
      // Extract relationship info from placeholder
      const relType = node._new_rel_data?.rel_type;
      const otherParentId = node._new_rel_data?.other_parent_id;

      // You can integrate this with your existing edit dialog
      // by setting appropriate initial values and relationship info
      // setShowEditDialog(true);
      // setEditingRelationType(relType);
      // setOtherParentId(otherParentId);
    };
    // Handle card click
    const handleCardClick = useCallback(
      (node: TreeNode) => {
        console.log('Card clicked:', node);
        console.log('Add relative mode:', state);
        if (state.addRelativeMode) {
          // If in add mode and clicked on a placeholder, open edit form
          if (node.to_add) {
            // Open edit form for this specific relationship
            openEditFormForPlaceholder(node);
          } else {
            // If clicked on regular node while in add mode, exit add mode
            deactivateAddRelative();
          }
        } else {
          // Regular node click - make it main or activate add mode
          if (node.data.id === state.mainId) {
            console.log('Clicked on main node:', node.data.id);
            // If clicked on main node, activate add relative mode
            activateAddRelative(node.data.id);
          } else {
            // If clicked on different node, make it main
            updateMainId(node.data.id);
          }
        }
      },
      [state.addRelativeMode, state.mainId]
    );

    // Highlight path to main node function
    const highlightPathToMain = useCallback(
      (node: TreeNode) => {
        if (
          !state.treeData ||
          !cardsViewRef.current ||
          !linksViewRef.current ||
          !state.config.highlightHoverPath
        ) {
          return;
        }

        const mainNode = state.treeData.data.find(n => n.data.main);
        if (!mainNode) {
          return;
        }

        // Store current hovered node for cleanup
        highlightPathRef.current = node.data.id;

        // Find path to main node
        const { nodePath, linkPath } = findPathToMain(
          state.treeData.data,
          links,
          node,
          mainNode
        );

        // Highlight nodes with sequential animation
        nodePath.forEach((pathNode, index) => {
          const nodeElement = cardsViewRef.current!.querySelector(
            `[data-id="${pathNode.data.id}"]`
          );

          if (nodeElement) {
            const cardInner = nodeElement.querySelector('.card-inner');
            if (cardInner) {
              const delay = index * 80;
              d3.select(cardInner)
                .transition('highlight')
                .duration(100)
                .delay(delay)
                .on('start', function () {
                  if (highlightPathRef.current === node.data.id) {
                    cardInner.classList.add('f3-path-to-main');
                  }
                });
            }
          }
        });

        // Highlight links with sequential animation
        linkPath.forEach((link, index) => {
          const linkElement = linksViewRef.current!.querySelector(
            `[data-link-id="${link.id}"]`
          );

          if (linkElement) {
            const delay = index * 80;
            d3.select(linkElement)
              .transition('highlight')
              .duration(100)
              .delay(delay)
              .on('start', function () {
                if (highlightPathRef.current === node.data.id) {
                  linkElement.classList.add('f3-path-to-main');
                }
              });
          }
        });
      },
      [state.treeData, links, state.config.highlightHoverPath]
    );

    // Clear highlight with smooth fadeout
    const clearPathHighlight = useCallback(() => {
      highlightPathRef.current = null;

      if (!cardsViewRef.current || !linksViewRef.current) {
        return;
      }

      // Clear highlighted cards
      const highlightedCards = cardsViewRef.current.querySelectorAll(
        '.card-inner.f3-path-to-main'
      );

      highlightedCards.forEach(el => {
        d3.select(el)
          .transition('unhighlight')
          .duration(150)
          .on('end', function () {
            el.classList.remove('f3-path-to-main');
          });
      });

      // Clear highlighted links
      const highlightedLinks = linksViewRef.current.querySelectorAll(
        '.link.f3-path-to-main'
      );

      highlightedLinks.forEach(el => {
        d3.select(el)
          .transition('unhighlight')
          .duration(150)
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
            touchAction: 'none',
          }}
          onMouseDown={() => {
            if (svgRef.current) {
              svgRef.current.style.cursor = 'grabbing';
            }
          }}
          onMouseUp={() => {
            if (svgRef.current) {
              svgRef.current.style.cursor = 'grab';
            }
          }}
        >
          <SvgDefs cardDimensions={state.config.cardDimensions} />

          {/* Background for pan/zoom */}
          <rect
            width="100%"
            height="100%"
            fill="transparent"
            pointerEvents="all"
          />

          {/* Main view container transformed by zoom */}
          <g className="view" ref={viewRef}>
            {/* Links layer */}
            <g className="links_view" ref={linksViewRef}>
              {links.map(link => (
                <Link
                  key={link.id}
                  link={link}
                  transitionTime={state.config.transitionTime}
                  treeData={state.treeData!.data}
                  initialRender={state.isInitialRender}
                />
              ))}
            </g>

            {/* Cards layer */}
            <g className="cards_view" ref={cardsViewRef}>
              {/* Current nodes */}
              {state.treeData.data.map(node => (
                <Card
                  key={node.data.id}
                  node={node}
                  showMiniTree={state.config.showMiniTree}
                  transitionTime={state.config.transitionTime}
                  treeData={state.treeData}
                  initialRender={state.isInitialRender}
                  onMouseEnter={highlightPathToMain}
                  onMouseLeave={clearPathHighlight}
                  onPersonAdd={handleCardClick}
                  onPersonDelete={onPersonDelete}
                />
              ))}

              {/* Exiting nodes */}
              {exitingNodes.map(node => (
                <Card
                  key={`exit-${node.data.id}`}
                  node={node}
                  showMiniTree={false}
                  transitionTime={state.config.transitionTime}
                  treeData={state.treeData}
                  initialRender={false}
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
