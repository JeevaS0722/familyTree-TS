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
import RelationshipMenu from './RelationshipMenu';
import { safeCloneNodes } from '../utils/general';

interface TreeViewProps {
  svgRef: React.RefObject<SVGSVGElement>;
  onPersonClick?: (personId: string) => void;
  onPersonAdd?: (
    personId: string,
    relationType: string,
    otherParentId?: string
  ) => void;
  onPersonDelete?: (personId: string) => void;
}

const TreeView: React.FC<TreeViewProps> = React.memo(
  ({ svgRef, onPersonAdd, onPersonDelete }: TreeViewProps) => {
    const { state, setInitialRenderComplete } = useTreeContext();
    const viewRef = useRef<SVGGElement>(null);
    const cardsViewRef = useRef<SVGGElement>(null);
    const linksViewRef = useRef<SVGGElement>(null);
    const firstFitDoneRef = useRef(false);
    const highlightPathRef = useRef<string | null>(null);

    const [exitingNodes, setExitingNodes] = useState<TreeNode[]>([]);
    const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const prevNodesRef = useRef<TreeNode[]>([]);

    const [nodeAdditionCounter, setNodeAdditionCounter] = useState(0);

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

    const links = useMemo(() => {
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

    useEffect(() => {
      if (!state.treeData?.data) {
        return;
      }

      try {
        const currentIds = new Set(state.treeData.data.map(n => n.data.id));
        const prevIds = new Set(prevNodesRef.current.map(n => n.data.id));

        const newNodeIds = [...currentIds].filter(id => !prevIds.has(id));
        if (newNodeIds.length > 0) {
          setNodeAdditionCounter(prev => prev + 1);
        }

        const newExitingNodes = prevNodesRef.current
          .filter(node => !currentIds.has(node.data.id))
          .map(node => {
            const exitingNode = { ...node, exiting: true };
            calculateEnterAndExitPositions(exitingNode, false, true);
            return exitingNode;
          });

        state.treeData.data.forEach(node => {
          if (!prevIds.has(node.data.id)) {
            calculateEnterAndExitPositions(node, true, false);
          }
        });

        setExitingNodes(newExitingNodes);

        const timer = setTimeout(() => {
          setExitingNodes([]);
        }, state.config.transitionTime + 100);

        prevNodesRef.current = safeCloneNodes(state.treeData.data);

        return () => clearTimeout(timer);
      } catch (error) {
        setExitingNodes([]);
        prevNodesRef.current = safeCloneNodes(state.treeData.data);
      }
    }, [state.treeData?.data, state.config.transitionTime]);

    useEffect(() => {
      if (!state.treeData?.dim) {
        return;
      }

      if (!firstFitDoneRef.current) {
        const timeoutId = setTimeout(() => {
          fitTree();
          firstFitDoneRef.current = true;

          setTimeout(() => {
            setInitialRenderComplete();
          }, state.config.transitionTime);
        }, 100);

        return () => clearTimeout(timeoutId);
      }
    }, [state.treeData?.dim, fitTree, state.config.transitionTime]);

    useEffect(() => {
      if (firstFitDoneRef.current && state.treeData?.dim) {
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

    useEffect(() => {
      if (
        nodeAdditionCounter > 0 &&
        firstFitDoneRef.current &&
        state.treeData?.dim
      ) {
        const timeoutId = setTimeout(() => {
          fitTree();
        }, state.config.transitionTime * 1.1);

        return () => clearTimeout(timeoutId);
      }
    }, [
      nodeAdditionCounter,
      fitTree,
      state.config.transitionTime,
      state.treeData?.dim,
    ]);

    const handlePersonAdd = (node: TreeNode, event: React.MouseEvent) => {
      event.stopPropagation();
      setSelectedNode(node);
      setMenuPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    const handleAddRelative = (
      relationType: string,
      otherParentId?: string
    ) => {
      if (!selectedNode) {
        return;
      }
      if (onPersonAdd && selectedNode?.data?.id) {
        onPersonAdd(selectedNode.data.id, relationType, otherParentId);
      }
      setSelectedNode(null);
    };

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

        highlightPathRef.current = node.data.id;

        const { nodePath, linkPath } = findPathToMain(
          state.treeData.data,
          links,
          node,
          mainNode
        );

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

    const clearPathHighlight = useCallback(() => {
      highlightPathRef.current = null;

      if (!cardsViewRef.current || !linksViewRef.current) {
        return;
      }

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
                  treeData={state.treeData!.data}
                  initialRender={state.isInitialRender}
                />
              ))}
            </g>

            <g className="cards_view" ref={cardsViewRef}>
              {state.treeData.data.map(node => (
                <Card
                  key={`${node.data.id}-${nodeAdditionCounter}`}
                  node={node}
                  showMiniTree={state.config.showMiniTree}
                  transitionTime={state.config.transitionTime}
                  treeData={state.treeData}
                  initialRender={state.isInitialRender}
                  onMouseEnter={highlightPathToMain}
                  onMouseLeave={clearPathHighlight}
                  onPersonAdd={handlePersonAdd}
                  onPersonDelete={onPersonDelete}
                />
              ))}

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
        <Toolbar
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          fitTree={fitTree}
          svgRef={svgRef}
        />
        {selectedNode && (
          <RelationshipMenu
            node={selectedNode}
            position={menuPosition}
            existingFamilyMembers={state.treeData?.data || []}
            onAddRelative={handleAddRelative}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </>
    );
  }
);

TreeView.displayName = 'TreeView';
export default TreeView;
