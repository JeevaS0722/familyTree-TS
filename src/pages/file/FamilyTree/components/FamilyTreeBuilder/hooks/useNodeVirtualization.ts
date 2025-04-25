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
  buffer = 300,
}: UseNodeVirtualizationParams) {
  const [visibleNodes, setVisibleNodes] = useState<TreeNode[]>(allNodes);

  useEffect(() => {
    const viewportLeft = -viewportX / scale - buffer;
    const viewportTop = -viewportY / scale - buffer;
    const viewportRight = viewportLeft + visibleAreaWidth / scale + buffer * 2;
    const viewportBottom = viewportTop + visibleAreaHeight / scale + buffer * 2;

    const visible = allNodes.filter(node => {
      const nodeLeft = node.x - 150;
      const nodeTop = node.y - 80;
      const nodeRight = node.x + 150;
      const nodeBottom = node.y + 80;

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
