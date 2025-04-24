// src/component/FamilyTree/hooks/useNodeAnimation.ts
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TreeNode, TreeData } from '../types/familyTree';
import { calculateAnimationDelay } from '../utils/animationUtils';

/**
 * Hook to handle node animation for a single tree node
 * Fixed version to prevent errors with circular references
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
  const nodeId = useRef(node.data.id);

  useEffect(() => {
    if (!nodeRef.current || !treeData) {
      return;
    }

    const nodeElement = d3.select(nodeRef.current);

    // Reset animation state if node ID changes
    if (nodeId.current !== node.data.id) {
      animationStarted.current = false;
      nodeId.current = node.data.id;
    }

    // Calculate the delay for this node's animation
    let delay = 0;
    try {
      delay = initialRender
        ? calculateAnimationDelay(node, transitionTime, treeData.data)
        : Math.min(200, transitionTime * 0.1); // Minimum delay for better visibility
    } catch (e) {
      console.warn('Error calculating animation delay', e);
      delay = 0;
    }

    // Step 1: Ensure we handle interruption properly
    nodeElement.interrupt();

    // Step 2: Set initial position if entering and not yet animated
    if (
      !animationStarted.current &&
      (node._x !== undefined || node._y !== undefined)
    ) {
      // Use node._x/_y if defined, otherwise use node.x/y
      const startX = node._x !== undefined ? node._x : node.x;
      const startY = node._y !== undefined ? node._y : node.y;

      nodeElement
        .attr('transform', `translate(${startX}, ${startY})`)
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
    node.data.id, // Track node ID changes to reset animation state
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
