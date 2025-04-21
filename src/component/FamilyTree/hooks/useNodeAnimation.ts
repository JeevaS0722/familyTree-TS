// src/component/FamilyTree/hooks/useNodeAnimation.ts
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TreeNode, TreeData } from '../types/familyTree';
import { calculateAnimationDelay } from '../utils/animationUtils';

/**
 * Hook to handle node animation for a single tree node
 * Closely matches the behavior of the original D3 implementation
 */
export function useNodeAnimation(
  nodeRef: React.RefObject<SVGGElement>,
  node: TreeNode,
  transitionTime: number,
  treeData: TreeData | null,
  initialRender: boolean = false
) {
  // Keep track of animation state
  const animationStarted = useRef(false);

  useEffect(() => {
    if (!nodeRef.current || !treeData) {
      return;
    }

    const nodeElement = d3.select(nodeRef.current);

    // Calculate the delay for this node's animation
    const delay = initialRender
      ? calculateAnimationDelay(node, transitionTime, treeData.data)
      : 0;

    // Step 1: Ensure we handle interruption properly
    nodeElement.interrupt();

    // Step 2: Set initial position if entering and not yet animated
    if (
      !animationStarted.current &&
      node._x !== undefined &&
      node._y !== undefined
    ) {
      nodeElement
        .attr('transform', `translate(${node._x}, ${node._y})`)
        .style('opacity', 0);
    }

    // Step 3: Animate to final position
    nodeElement
      .transition()
      .duration(transitionTime)
      .delay(delay)
      .attr('transform', `translate(${node.x}, ${node.y})`)
      .style('opacity', node.exiting ? 0 : 1)
      .on('start', () => {
        animationStarted.current = true;
      });

    // Cleanup
    return () => {
      nodeElement.interrupt();
    };
  }, [
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
