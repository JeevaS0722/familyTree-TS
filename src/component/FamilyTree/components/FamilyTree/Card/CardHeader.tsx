// src/component/FamilyTree/components/FamilyTree/Card/CardHeader.tsx
import React from 'react';
import { CardHeaderProps } from './types';
import { ArrowIcon } from './icons';

const CardHeader: React.FC<CardHeaderProps> = ({
  node,
  cardDimensions,
  isDeceased,
  headerHovered,
  setHeaderHovered,
  onCardClick,
  onAddClick,
  onDeleteClick,
}) => {
  return (
    <g
      className="card-header"
      onClick={onCardClick}
      onMouseEnter={() => setHeaderHovered(true)}
      onMouseLeave={() => setHeaderHovered(false)}
    >
      <rect
        width={cardDimensions.w}
        height={34}
        fill="var(--header-color)"
        rx={20}
        ry={20}
      />
      <rect
        y={17}
        width={cardDimensions.w}
        height={17}
        fill="var(--header-color)"
      />
      <text
        x={12}
        y={22}
        fontSize="16"
        fontWeight="800"
        fill="#000"
        className="file-name"
        textAnchor="start"
        style={{ textOverflow: 'ellipsis', maxWidth: '75%' }}
      >
        {node.data.data.firstName} {node.data.data.lastName}
      </text>
      {headerHovered && (
        <g
          className="header-actions"
          transform={`translate(${cardDimensions.w - 65}, 17)`}
        >
          <g
            transform="translate(-25, -8)"
            onClick={onAddClick}
            style={{ cursor: 'pointer' }}
          >
            <circle r="12" fill="#f5f5f5" />
            <path d="M -4 0 H 4 M 0 -4 V 4" stroke="#000" strokeWidth="2" />
          </g>
          <g
            transform="translate(0, -8)"
            onClick={onDeleteClick}
            style={{ cursor: 'pointer' }}
          >
            <circle r="12" fill="#f5f5f5" />
            <path
              d="M -3 -3 L 3 3 M -3 3 L 3 -3"
              stroke="#f44336"
              strokeWidth="2"
            />
          </g>
        </g>
      )}
      <g transform={`translate(${cardDimensions.w - 20}, 17)`}>
        <ArrowIcon width={15} height={20} />
      </g>
    </g>
  );
};

export default React.memo(CardHeader);
