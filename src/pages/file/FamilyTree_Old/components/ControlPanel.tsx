// src/components/FamilyTree/components/EnhancedControlPanel.tsx
import React, { useState } from 'react';
import { Box, IconButton, Slider, Typography, Tooltip } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import HomeIcon from '@mui/icons-material/Home';
import PanToolIcon from '@mui/icons-material/PanTool';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import PrintIcon from '@mui/icons-material/Print';
import RedoIcon from '@mui/icons-material/Redo';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import BuildIcon from '@mui/icons-material/Build';
import ConfirmationDialog from './ConfirmationDialog';

// Glow animation for icons
const iconGlow = keyframes`
  0% {
    filter: drop-shadow(0 0 0px rgba(90, 200, 250, 0.7));
  }
  50% {
    filter: drop-shadow(0 0 3px rgba(90, 200, 250, 0.9));
  }
  100% {
    filter: drop-shadow(0 0 0px rgba(90, 200, 250, 0.7));
  }
`;

// Panel zoom animation
const panelZoomIn = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  }
  100% {
    transform: scale(1.05);
    box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.3);
  }
`;

// Border glow animation
const borderGlow = keyframes`
  0% {
    box-shadow: 0 0 0px rgba(90, 200, 250, 0.1);
  }
  50% {
    box-shadow: 0 0 10px rgba(90, 200, 250, 0.5);
  }
  100% {
    box-shadow: 0 0 0px rgba(90, 200, 250, 0.1);
  }
`;

/**
 * Styled components for the control panel
 */
const ControlPanelContainer = styled(Box, {
  shouldForwardProp: prop => prop !== 'isHovered',
})<{ isHovered: boolean }>(({ theme, isHovered }) => ({
  position: 'absolute',
  bottom: 20,
  right: 20,
  zIndex: 10,
  backgroundColor: isHovered
    ? theme.palette.mode === 'dark'
      ? 'rgba(80, 80, 95, 0.95)'
      : 'rgba(255, 255, 255, 0.95)'
    : theme.palette.mode === 'dark'
      ? 'rgba(66, 66, 66, 0.85)'
      : 'rgba(255, 255, 255, 0.85)',
  borderRadius: 8,
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
  border: isHovered
    ? '1px solid rgba(90, 200, 250, 0.7)'
    : '1px solid rgba(200, 200, 200, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
  animation: isHovered ? `${borderGlow} 2s infinite ease-in-out` : 'none',
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '6px',
  justifyContent: 'center',
  flexWrap: 'wrap',
}));

// Styled icon button with glow effect on hover
const GlowIconButton = styled(IconButton, {
  shouldForwardProp: prop => prop !== 'isActive',
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  transition: 'all 0.2s ease',
  '&:hover': {
    animation: `${iconGlow} 1.5s infinite ease-in-out`,
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(90, 200, 250, 0.15)'
        : 'rgba(90, 200, 250, 0.25)',
    transform: 'scale(1.1)',
  },
  ...(isActive && {
    color: '#2196f3', // Blue color when active
  }),
}));

interface ControlPanelProps {
  scale: number;
  isDragging: boolean;
  autoFit: boolean;
  onZoom: (scale: number) => void;
  onReset: () => void;
  onExport?: () => void;
  onPrint?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onToggleAutoFit?: (enabled: boolean) => void;
  onRebuild?: () => void;
}

/**
 * Enhanced control panel with improved visual feedback and animations
 */
const EnhancedControlPanel: React.FC<ControlPanelProps> = ({
  scale,
  isDragging,
  autoFit,
  onZoom,
  onReset,
  onExport,
  onPrint,
  onUndo,
  onRedo,
  onToggleAutoFit,
  onRebuild,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Handle zoom in with standard increments
  const handleZoomIn = () => {
    const newScale = Math.min(2, scale + 0.1);
    onZoom(newScale);
  };

  // Handle zoom out with standard increments
  const handleZoomOut = () => {
    const newScale = Math.max(0.5, scale - 0.1);
    onZoom(newScale);
  };

  // Handle rebuild button click
  const handleRebuildClick = () => {
    setConfirmDialogOpen(true);
  };

  // Handle rebuild confirmation
  const handleRebuildConfirm = () => {
    setConfirmDialogOpen(false);
    if (onRebuild) {
      onRebuild();
    }
  };

  return (
    <>
      <ControlPanelContainer
        isHovered={isHovered}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Navigation controls */}
        <ButtonGroup>
          <Tooltip title="Reset View" arrow>
            <GlowIconButton onClick={onReset} size="small">
              <HomeIcon />
            </GlowIconButton>
          </Tooltip>

          <Tooltip title="Pan Mode" arrow>
            <GlowIconButton size="small" isActive={isDragging}>
              <PanToolIcon color={isDragging ? 'primary' : 'inherit'} />
            </GlowIconButton>
          </Tooltip>

          {/* Rebuild/Build Tree Button - only show if provided */}
          {onRebuild && (
            <Tooltip title="Rebuild Family Tree" arrow>
              <GlowIconButton onClick={handleRebuildClick} size="small">
                <BuildIcon />
              </GlowIconButton>
            </Tooltip>
          )}

          <Tooltip title="Auto Fit" arrow>
            <GlowIconButton
              size="small"
              isActive={autoFit}
              onClick={() => onToggleAutoFit?.(true)}
            >
              <FitScreenIcon />
            </GlowIconButton>
          </Tooltip>
        </ButtonGroup>

        {/* Zoom controls */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <Tooltip title="Zoom Out" arrow>
            <span>
              <GlowIconButton
                onClick={handleZoomOut}
                size="small"
                disabled={scale <= 0.5}
              >
                <RemoveIcon fontSize="small" />
              </GlowIconButton>
            </span>
          </Tooltip>

          <Typography
            variant="caption"
            sx={{
              minWidth: 40,
              textAlign: 'center',
              fontWeight: 600,
              color: isHovered ? '#1976d2' : 'inherit',
            }}
          >
            {Math.round(scale * 100)}%
          </Typography>

          <Tooltip title="Zoom In" arrow>
            <span>
              <GlowIconButton
                onClick={handleZoomIn}
                size="small"
                disabled={scale >= 2}
              >
                <AddIcon fontSize="small" />
              </GlowIconButton>
            </span>
          </Tooltip>
        </Box>

        <Slider
          min={0.5}
          max={2}
          step={0.1}
          value={scale}
          onChange={(_, value) => onZoom(value as number)}
          sx={{
            mx: 1,
            '& .MuiSlider-thumb': {
              '&:hover, &.Mui-active': {
                boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)',
                animation: `${iconGlow} 1.5s infinite ease-in-out`,
              },
            },
            '& .MuiSlider-rail': {
              opacity: 0.3,
            },
            '& .MuiSlider-track': {
              transition: 'background-color 0.3s ease',
              backgroundColor: isHovered ? '#1976d2' : undefined,
            },
          }}
          size="small"
        />

        {/* Actions - only show if provided */}
        <ButtonGroup>
          {onPrint && (
            <Tooltip title="Print" arrow>
              <GlowIconButton onClick={onPrint} size="small">
                <PrintIcon />
              </GlowIconButton>
            </Tooltip>
          )}

          {onRedo && (
            <Tooltip title="Redo" arrow>
              <GlowIconButton onClick={onRedo} size="small">
                <RedoIcon />
              </GlowIconButton>
            </Tooltip>
          )}
        </ButtonGroup>
      </ControlPanelContainer>

      {/* Confirmation Dialog for Rebuild */}
      <ConfirmationDialog
        open={confirmDialogOpen}
        title="Rebuild Family Tree"
        content="Are you sure you want to rebuild the family tree? This will remove all current members and start fresh."
        confirmText="Rebuild"
        cancelText="Cancel"
        dialogType="warning"
        onConfirm={handleRebuildConfirm}
        onCancel={() => setConfirmDialogOpen(false)}
      />
    </>
  );
};

export default EnhancedControlPanel;
