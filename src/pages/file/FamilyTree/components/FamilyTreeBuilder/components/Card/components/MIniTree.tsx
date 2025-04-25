import React from 'react';
import { useTreeContext } from '../../../context/TreeContext';
import { TreeNode } from '../../../types/familyTree';

interface MiniTreeProps {
  node: TreeNode;
  visible: boolean;
}

/**
 * MiniTree component that renders a small family tree icon in the top-right corner of a card.
 * When clicked, it changes the main node to the current node, centering the tree view on it.
 */
const MiniTree: React.FC<MiniTreeProps> = ({ node, visible }) => {
  const { updateMainId, updateTree } = useTreeContext();

  if (!visible) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from firing
    updateMainId(node.data.id);
    updateTree();

  return (
    <g
      className="mini-tree"
      transform="translate(80, -80)"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <rect x="0" y="-25" width="60" height="25" fill="rgba(0,0,0,0)" />
      <g transform="translate(30, 0) scale(0.9)">
        <rect x="-31" y="-25" width="72" height="15" fill="rgba(0,0,0,0)" />
        <line y2="-17.5" stroke="#fff" />
        <line x1="-20" x2="20" y1="-17.5" y2="-17.5" stroke="#fff" />
        <rect
          x="-31"
          y="-25"
          width="25"
          height="15"
          rx="5"
          ry="5"
          className="card-male"
          fill="#7EADFF"
        />
        <rect
          x="6"
          y="-25"
          width="25"
          height="15"
          rx="5"
          ry="5"
          className="card-female"
          fill="#FF96BC"
        />
      </g>
    </g>
  );
};

export default MiniTree;
