// src/component/FamilyTree/components/card/EnhancedRelationshipBadge.tsx
import React, { useState, useEffect } from 'react';
import { Menu, MenuItem } from '@mui/material';

interface EnhancedRelationshipBadgeProps {
  relationshipType: string;
  isDeceased?: boolean;
  onUpdateRelationship: (newType: string) => void;
  x: number;
  y: number;
  width: number;
  color?: string;
  borderColor?: string;
}

const relationshipOptions = [
  'Primary Root',
  'Partner',
  'Child',
  'Stepchild',
  'Sibling',
  'Parent',
  'Unknown',
  'Other',
];

const EnhancedRelationshipBadge: React.FC<EnhancedRelationshipBadgeProps> = ({
  relationshipType,
  isDeceased,
  onUpdateRelationship,
  x,
  y,
  width,
  color = '#D9D9D9',
  borderColor = '#FF0000',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | SVGGElement>(null);
  const badgeRef = React.useRef<SVGGElement>(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  // Force menu to hide when it's open
  useEffect(() => {
    if (isMenuOpen) {
      setIsHovered(false);
    }
  }, [isMenuOpen]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (event: React.MouseEvent<SVGGElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleRelationshipSelect = (relationship: string) => {
    onUpdateRelationship(relationship);
    setMenuAnchorEl(null); // Close the menu after selection
  };

  // SVG pulse animation effect for hover
  const pulseAnimation = isHovered
    ? {
        animation: 'pulse 1s ease infinite',
      }
    : {};

  return (
    <>
      {/* Badge Group */}
      <g
        ref={badgeRef}
        className={`relationship-badge ${isHovered ? 'hovered' : ''}`}
        transform={`translate(${x}, ${y})`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ cursor: 'pointer', ...pulseAnimation }}
      >
        {/* Badge Background */}
        <rect
          width={width}
          height={20}
          rx={10}
          ry={10}
          fill={color}
          stroke={isDeceased ? borderColor : 'none'}
          strokeWidth={isDeceased ? 3 : 0}
        />

        {/* Badge Text */}
        <text
          x={width / 2}
          y={14}
          textAnchor="middle"
          fontSize={12}
          fontWeight={isHovered ? 700 : 600}
          fill="#000000"
        >
          {relationshipType || 'Unknown'}
        </text>

        {/* Down Arrow (visible on hover) */}
        {isHovered && (
          <path
            d="M 3 -1 L 6 2 L 9 -1"
            transform={`translate(${width - 15}, 10)`}
            fill="none"
            stroke="#333333"
            strokeWidth={1.5}
          />
        )}
      </g>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {relationshipOptions.map(option => (
          <MenuItem
            key={option}
            onClick={() => handleRelationshipSelect(option)}
            selected={option === relationshipType}
            sx={{
              fontSize: 14,
              minWidth: 160,
              transition: 'background-color 0.2s ease',
              fontWeight: option === relationshipType ? 600 : 400,
              bgcolor:
                option === relationshipType
                  ? 'rgba(25, 118, 210, 0.08)'
                  : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default EnhancedRelationshipBadge;
