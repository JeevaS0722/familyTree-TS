import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TreeNode, TreeData } from '../types/familyTree';
import { calculateAnimationDelay } from '../utils/animationUtils';

export function useNodeAnimation(
  nodeRef: React.RefObject<SVGGElement>,
  node: TreeNode,
  transitionTime: number,
  treeData: TreeData | null,
  initialRender: boolean = false
) {
  const animationStarted = useRef(false);
  const nodeId = useRef(node.data.id);

  useEffect(() => {
    if (!nodeRef.current || !treeData) {
      return;
    }

    const nodeElement = d3.select(nodeRef.current);

    if (nodeId.current !== node.data.id) {
      animationStarted.current = false;
      nodeId.current = node.data.id;
    }

    let delay = 0;
    try {
      delay = initialRender
        ? calculateAnimationDelay(node, transitionTime, treeData.data)
        : Math.min(100, transitionTime * 0.05);
    } catch (e) {
      console.warn('Error calculating animation delay', e);
      delay = 0;
    }

    nodeElement.interrupt();

    if (
      !animationStarted.current &&
      (node._x !== undefined || node._y !== undefined)
    ) {
      const startX = node._x !== undefined ? node._x : node.x;
      const startY = node._y !== undefined ? node._y : node.y;

      nodeElement
        .attr('transform', `translate(${startX}, ${startY})`)
        .style('opacity', 0.1);
    }

    nodeElement
      .transition()
      .duration(transitionTime)
      .delay(delay)
      .attr('transform', `translate(${node.x}, ${node.y})`)
      .style('opacity', node.exiting ? 0 : 1)
      .on('start', () => {
        animationStarted.current = true;
      })
      .on('end', () => {
        if (!node.exiting) {
          nodeElement.style('opacity', 1);
        }
      });

    const safetyTimeout = setTimeout(
      () => {
        if (nodeRef.current && !node.exiting) {
          d3.select(nodeRef.current)
            .style('opacity', 1)
            .attr('transform', `translate(${node.x}, ${node.y})`);
        }
      },
      transitionTime + delay + 100
    );

    return () => {
      nodeElement.interrupt();
      clearTimeout(safetyTimeout);
    };
  }, [
    node.data.id,
    node.x,
    node.y,
    node._x,
    node._y,
    node.exiting,
    transitionTime,
    treeData,
    initialRender,
  ]);
}
