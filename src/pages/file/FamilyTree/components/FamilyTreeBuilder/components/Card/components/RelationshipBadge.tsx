import React from 'react';
import { RelationshipBadgeProps } from '../types';

const RelationshipBadge: React.FC<RelationshipBadgeProps> = ({
  relationshipType,
  isDeceased,
}) => {
  return (
    <g
      className="relationship-badge"
      transform={`translate(-135, -100)`}
      style={{ cursor: 'pointer' }}
    >
      <path
        d={`
          M10,0 
          H115 
          Q125,0 125,10 
          V25 
          H0 
          V10 
          Q0,0 10,0 
          Z
        `}
        fill="#D9D9D9"
        stroke={isDeceased ? 'red' : '#D9D9D9'}
        strokeWidth={1}
      />
      <text
        x={62.5}
        y={14}
        fontSize={12}
        fontWeight="bold"
        textAnchor="middle"
        fill="#000000"
      >
        {relationshipType}
      </text>
    </g>
  );
};

export default RelationshipBadge;
