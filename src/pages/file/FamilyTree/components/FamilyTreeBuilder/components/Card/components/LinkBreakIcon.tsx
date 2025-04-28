import React from 'react';
import { TreeNode } from '../../../types/familyTree';
import { useTreeContext } from '../../../context/TreeContext';

interface LinkBreakIconProps {
  node: TreeNode;
  position: { x: number; y: number };
}

const LinkBreakIcon: React.FC<LinkBreakIconProps> = ({ node, position }) => {
  const { toggleNodeVisibility } = useTreeContext();

  // Check if this node should show the toggle
  const hasRelationships =
    node.data.rels.father ||
    node.data.rels.mother ||
    (node.data.rels.children && node.data.rels.children.length > 0);

  if (!hasRelationships) {
    return null;
  }

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleNodeVisibility(node.data.id);
  };

  return (
    <g
      className={`link-break-icon ${node.data.hide_rels ? 'closed' : ''}`}
      transform={`translate(${position.x}, ${position.y})`}
      style={{ cursor: 'pointer' }}
      onClick={handleToggleVisibility}
    >
      {/* SVG for toggle icon */}
      <circle r="12" fill="rgba(0,0,0,0.1)" />
      <path
        d="M-6,-6 L6,6 M-6,6 L6,-6"
        stroke="currentColor"
        strokeWidth="2"
        style={{
          transform: node.data.hide_rels ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease',
        }}
      />
    </g>
  );
};

export default LinkBreakIcon;
