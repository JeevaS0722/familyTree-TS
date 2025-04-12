// src/components/FamilyTree/components/EnhancedRelationshipBadge.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Tooltip, Menu, MenuItem, Fade } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { RelationshipBadge } from '../styles';
import { COLORS } from '../types';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Custom RelationshipBadge with fixed width
const RelationshipBadgeStyled = styled(RelationshipBadge)<{ width?: string }>(
  ({ width }) => ({
    minWidth: width || 'auto',
    width: 'auto',
    paddingLeft: '8px',
    paddingRight: '8px',
  })
);

// Arrow icon that only appears on hover
const StyledArrowIcon = styled(ArrowDropDownIcon)<{
  isOpen: string;
  isVisible: string;
}>(({ isOpen, isVisible }) => ({
  fontSize: '16px',
  marginLeft: '4px',
  verticalAlign: 'middle',
  transition: 'all 0.3s ease',
  transform: isOpen === 'true' ? 'rotate(180deg)' : 'rotate(0deg)',
  opacity: isVisible === 'true' ? 1 : 0,
  visibility: isVisible === 'true' ? 'visible' : 'hidden',
}));

// Container for the badge
const BadgeContainer = styled(Box)<{ isHovered: string }>(({ isHovered }) => ({
  position: 'relative',
  display: 'inline-block',
  cursor: 'pointer',
  animation: isHovered === 'true' ? `${pulse} 1s ease infinite` : 'none',
  '&:hover': {
    '& .relationship-text': {
      color: '#000',
      fontWeight: 700,
    },
  },
}));

// Relationship text that doesn't wrap
const RelationshipText = styled(Typography)<{ isHovered: string }>(
  ({ isHovered }) => ({
    fontSize: '12px',
    fontWeight: isHovered === 'true' ? 700 : 600,
    lineHeight: '15px',
    color: '#000000',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap', // Prevent text wrapping
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  })
);

interface EnhancedRelationshipBadgeProps {
  isDeceased?: boolean;
  relationshipType: string;
  onUpdateRelationship: (newType: string) => void;
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
  isDeceased,
  relationshipType,
  onUpdateRelationship,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  // Force tooltip to hide when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      setIsHovered(false);
    }
  }, [isMenuOpen]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleRelationshipSelect = (relationship: string) => {
    onUpdateRelationship(relationship);
    setMenuAnchorEl(null); // Close the menu after selection
  };

  return (
    <Tooltip
      title="Click to change relationship type"
      placement="top"
      arrow
      enterDelay={500}
      open={isHovered && !isMenuOpen ? true : false}
      PopperProps={{
        sx: {
          // Force tooltip to center above badge
          '& .MuiTooltip-tooltip': {
            marginBottom: '30px !important',
          },
          '& .MuiTooltip-arrow': {
            // Center the arrow
            left: '0 !important',
            right: '0 !important',
            margin: '0 auto',
          },
        },
      }}
    >
      <BadgeContainer
        isHovered={isHovered ? 'true' : 'false'}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <RelationshipBadgeStyled isDeceased={isDeceased} width="110px">
          <RelationshipText
            isHovered={isHovered ? 'true' : 'false'}
            className="relationship-text"
          >
            {relationshipType || 'Unknown'}
            <StyledArrowIcon
              isOpen={isMenuOpen ? 'true' : 'false'}
              isVisible={isHovered ? 'true' : 'false'}
            />
          </RelationshipText>
        </RelationshipBadgeStyled>

        <Menu
          anchorEl={menuAnchorEl}
          open={isMenuOpen}
          onClose={handleCloseMenu}
          TransitionComponent={Fade}
          // Explicitly force menu to close when clicking outside
          disableAutoFocusItem
          autoFocus={false}
          MenuListProps={{
            autoFocusItem: false,
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          slotProps={{
            paper: {
              elevation: 3,
              sx: {
                mt: 1,
                borderRadius: 2,
                animation: `${fadeIn} 0.3s ease`,
              },
            },
          }}
        >
          {relationshipOptions.map(option => (
            <MenuItem
              key={option}
              onClick={() => handleRelationshipSelect(option)}
              selected={option === relationshipType}
              sx={{
                fontSize: '14px',
                minWidth: '160px',
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.12)',
                  },
                },
              }}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </BadgeContainer>
    </Tooltip>
  );
};

export default EnhancedRelationshipBadge;
