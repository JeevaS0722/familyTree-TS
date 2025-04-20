// src/component/FamilyTree/hooks/useNodeAnimation.ts - SIMPLIFIED VERSION
import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { TreeNode, TreeData } from '../types/familyTree';

export function useNodeAnimation(
  nodeRef: React.RefObject<SVGGElement>,
  node: TreeNode,
  transitionTime: number,
  treeData: TreeData | null
) {
  useEffect(() => {
    if (!nodeRef.current || !treeData) {
      return;
    }

    const nodeElement = d3.select(nodeRef.current);

    // Calculate delay based on position in tree
    const ancestryLevels = Math.max(
      ...treeData.data.map(d => (d.is_ancestry ? d.depth : 0)),
      0
    );
    const delayLevel = transitionTime * 0.4;
    let delay = node.depth * delayLevel;

    if ((node.depth !== 0 || !!node.spouse) && !node.is_ancestry) {
      delay += ancestryLevels * delayLevel;
      if (node.spouse) {
        delay += delayLevel;
      }
      delay += node.depth * delayLevel;
    }

    // Set initial position
    if (node._x !== undefined && node._y !== undefined) {
      // Entry animation
      nodeElement
        .attr('transform', `translate(${node._x}, ${node._y})`)
        .style('opacity', 0);
    }

    // Apply animation transition (no need to store reference)
    nodeElement
      .transition()
      .duration(transitionTime)
      .delay(delay)
      .attr('transform', `translate(${node.x}, ${node.y})`)
      .style('opacity', node.exiting ? 0 : 1);
  }, [node.x, node.y, node.depth, node.exiting, transitionTime]);
}
