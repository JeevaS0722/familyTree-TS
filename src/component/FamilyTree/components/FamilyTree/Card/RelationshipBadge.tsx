// src/component/FamilyTree/components/FamilyTree/Card/RelationshipBadge.tsx
import React from 'react';
import { RelationshipBadgeProps } from './types';

const RELATIONSHIP_OPTIONS = [
  'Primary Root',
  'Partner',
  'Child',
  'Stepchild',
  'Sibling',
  'Parent',
  'Unknown',
  'Other',
];

const RelationshipBadge: React.FC<RelationshipBadgeProps> = ({
  node,
  isDeceased,
  position,
  showRelationDropdown,
  setShowRelationDropdown,
  badgeHovered,
  setBadgeHovered,
  onRelationshipSelect,
}) => {
  return (
    <g
      className={`relationship-batch-container ${badgeHovered ? 'pulse' : ''}`}
      transform={`translate(${position.x}, ${position.y})`}
      onClick={e => {
        e.stopPropagation();
        setShowRelationDropdown(!showRelationDropdown);
      }}
      onMouseEnter={() => setBadgeHovered(true)}
      onMouseLeave={() => setBadgeHovered(false)}
    >
      <rect
        width={110}
        height={20}
        rx={10}
        ry={10}
        fill="var(--relationship-badge-color)"
        stroke={isDeceased ? 'var(--deceased-border-color)' : 'none'}
        strokeWidth={isDeceased ? 3 : 0}
        className="relationship-batch"
      />
      <text
        x={55}
        y={14}
        fill="#000"
        fontSize="12"
        fontWeight={badgeHovered ? 700 : 600}
        textAnchor="middle"
        className="relationship-batch-text"
      >
        {node.data.data.relationshipType || 'Unknown'}
      </text>
      {badgeHovered && (
        <path
          d="M 0 0 L 4 4 L 8 0"
          transform={`translate(${95}, 10) rotate(180)`}
          fill="#333"
        />
      )}
      {showRelationDropdown && (
        <g className="relationship-dropdown" transform={`translate(110, 0)`}>
          <rect
            width={160}
            height={RELATIONSHIP_OPTIONS.length * 30}
            fill="white"
            stroke="#ccc"
            strokeWidth={1}
            rx={8}
            ry={8}
            filter="url(#dropShadow)"
            className="dropdown-background"
          />
          {RELATIONSHIP_OPTIONS.map((option, index) => (
            <g
              key={option}
              transform={`translate(0, ${index * 30})`}
              onClick={e => {
                e.stopPropagation();
                onRelationshipSelect(option);
              }}
              className="relationship-option"
            >
              <rect
                width={160}
                height={30}
                fill={
                  option === node.data.data.relationshipType
                    ? 'rgba(25, 118, 210, 0.08)'
                    : 'transparent'
                }
                className="option-bg"
              />
              <text
                x={10}
                y={20}
                fill="#000"
                fontSize="14"
                fontFamily="Roboto, sans-serif"
              >
                {option}
              </text>
            </g>
          ))}
        </g>
      )}
    </g>
  );
};

export default React.memo(RelationshipBadge);
