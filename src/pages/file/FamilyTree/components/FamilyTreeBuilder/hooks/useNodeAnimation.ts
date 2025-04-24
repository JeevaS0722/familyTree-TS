// src/component/FamilyTree/hooks/useNodeAnimation.ts
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TreeNode, TreeData } from '../types/familyTree';
import { calculateAnimationDelay } from '../utils/animationUtils';

/**
 * Hook to handle node animation for a single tree node
 * Fixed version to prevent issues with new nodes not appearing
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
    // Use a smaller delay for newly added nodes to make them appear faster
    let delay = 0;
    try {
      delay = initialRender
        ? calculateAnimationDelay(node, transitionTime, treeData.data)
        : Math.min(100, transitionTime * 0.05); // Reduced delay for better visibility
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

      // Set initial position and make node slightly visible to help with debugging
      nodeElement
        .attr('transform', `translate(${startX}, ${startY})`)
        .style('opacity', 0.1); // Start with slight visibility for debugging
    }

    // Step 3: Animate to final position - log for debugging
    console.log(
      `Animating node ${node.data.id} to position: (${node.x}, ${node.y})`
    );

    nodeElement
      .transition()
      .duration(transitionTime)
      .delay(delay)
      .attr('transform', `translate(${node.x}, ${node.y})`)
      .style('opacity', node.exiting ? 0 : 1) // Make sure non-exiting nodes are fully visible
      .on('start', () => {
        animationStarted.current = true;
        console.log(`Animation started for node ${node.data.id}`);
      })
      .on('end', () => {
        // Ensure the node is fully visible after animation
        if (!node.exiting) {
          nodeElement.style('opacity', 1);
        }
        console.log(`Animation completed for node ${node.data.id}`);
      });

    // Additional safety measure: Ensure node is visible after a timeout
    // This helps if for some reason the transition fails or is interrupted
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

    // Cleanup
    return () => {
      nodeElement.interrupt();
      clearTimeout(safetyTimeout);
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
