// src/component/FamilyTree/hooks/useNodeAnimation.ts
import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { TreeNode, TreeData } from '../types/familyTree';

export function useNodeAnimation(
  nodeRef: React.RefObject<SVGGElement>,
  node: TreeNode,
  transitionTime: number,
  treeData: TreeData | null
) {
  // Keep track of previous position for interruption handling
  const prevPositionRef = useRef({ x: node.x, y: node.y });

  useEffect(() => {
    if (!nodeRef.current || !treeData) {
      return;
    }

    const nodeElement = d3.select(nodeRef.current);

    // IMPROVED DELAY CALCULATION - matches original code exactly
    const ancestryLevels = Math.max(
      ...treeData.data.map(d => (d.is_ancestry ? d.depth : 0))
    );
    const delay_level = transitionTime * 0.4;
    let delay = node.depth * delay_level;

    if ((node.depth !== 0 || !!node.spouse) && !node.is_ancestry) {
      delay += ancestryLevels * delay_level; // Add delay for ancestry levels
      if (node.spouse) {
        delay += delay_level;
      } // Spouse after bloodline
      delay += node.depth * delay_level; // Double delay for each level
    }

    // PROPER INTERRUPTION HANDLING
    // Interrupt any ongoing transitions
    nodeElement.interrupt();

    // Set initial position for entering nodes
    if (
      node._x !== undefined &&
      node._y !== undefined &&
      !nodeElement.classed('already-entered')
    ) {
      nodeElement
        .attr('transform', `translate(${node._x}, ${node._y})`)
        .style('opacity', 0)
        .classed('already-entered', true);
    }

    // CREATE TRANSITION WITH PROPER NAMING - allows for interruption management
    nodeElement
      .transition(`node-${node.data.id}`)
      .duration(transitionTime)
      .delay(delay)
      .attr('transform', `translate(${node.x}, ${node.y})`)
      .style('opacity', node.exiting ? 0 : 1)
      .on('start', () => {
        // Store new position on transition start
        prevPositionRef.current = { x: node.x, y: node.y };
      });

    // Cleanup function
    return () => {
      if (nodeRef.current) {
        nodeElement.interrupt();
      }
    };
  }, [
    node.x,
    node.y,
    node._x,
    node._y,
    node.depth,
    node.is_ancestry,
    node.exiting,
    node.data.id,
    transitionTime,
  ]);
}
