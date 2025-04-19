// src/hooks/useNodeVirtualization.ts
import { useState, useEffect } from 'react';
import { TreeNode } from '../types/familyTree';

interface UseNodeVirtualizationParams {
  allNodes: TreeNode[];
  visibleAreaWidth: number;
  visibleAreaHeight: number;
  viewportX: number;
  viewportY: number;
  scale: number;
  buffer?: number;
}

export function useNodeVirtualization({
  allNodes,
  visibleAreaWidth,
  visibleAreaHeight,
  viewportX,
  viewportY,
  scale,
  buffer = 300, // Additional buffer to render nodes just outside the viewport
}: UseNodeVirtualizationParams) {
  const [visibleNodes, setVisibleNodes] = useState<TreeNode[]>(allNodes);

  useEffect(() => {
    // Calculate which nodes are in the visible area, with buffer
    const viewportLeft = -viewportX / scale - buffer;
    const viewportTop = -viewportY / scale - buffer;
    const viewportRight = viewportLeft + visibleAreaWidth / scale + buffer * 2;
    const viewportBottom = viewportTop + visibleAreaHeight / scale + buffer * 2;

    const visible = allNodes.filter(node => {
      // Account for node dimensions (assuming node width/height from card dimensions)
      const nodeLeft = node.x - 110; // Half node width
      const nodeTop = node.y - 35; // Half node height
      const nodeRight = node.x + 110;
      const nodeBottom = node.y + 35;

      // Check if node is within or overlapping the visible area
      return (
        nodeRight >= viewportLeft &&
        nodeLeft <= viewportRight &&
        nodeBottom >= viewportTop &&
        nodeTop <= viewportBottom
      );
    });

    setVisibleNodes(visible);
  }, [
    allNodes,
    visibleAreaWidth,
    visibleAreaHeight,
    viewportX,
    viewportY,
    scale,
    buffer,
  ]);

  return visibleNodes;
}
