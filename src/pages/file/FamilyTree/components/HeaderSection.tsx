// src/components/FamilyTree/components/HeaderSection.tsx
import React, { useState } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { COLORS } from '../types';
import ConfirmationDialog from './ConfirmationDialog';
import ArrowIcon from '../svg/arrow';

// Animation for the arrow rotation on hover
const rotateAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
`;

// Menu container with icons that slides in from right with rotation
const ActionsContainer = styled(Box)<{ ishovered: string }>(
  ({ ishovered }) => ({
    position: 'absolute',
    right: '35px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    pointerEvents: ishovered === 'true' ? 'auto' : 'none', // Only capture clicks when visible
  })
);

// Animation for rotate in
const rotateInAnimation = keyframes`
  0% {
    transform: translateX(30px) rotate(180deg);
    opacity: 0;
    visibility: hidden;
  }
  100% {
    transform: translateX(0) rotate(0deg);
    opacity: 1;
    visibility: visible;
  }
`;

// Animation for rotate out
const rotateOutAnimation = keyframes`
  0% {
    transform: translateX(0) rotate(0deg);
    opacity: 1;
    visibility: visible;
  }
  100% {
    transform: translateX(30px) rotate(180deg);
    opacity: 0;
    visibility: hidden;
  }
`;

// Styled icon buttons with rotation animation
const AnimatedIconButton = styled(IconButton)<{ ishovered: string }>(
  ({ ishovered }) => ({
    animation:
      ishovered === 'true'
        ? `${rotateInAnimation} 0.4s ease-out forwards`
        : `${rotateOutAnimation} 0.4s ease-in forwards`,
    transformOrigin: 'center center',
    // Ensure the button stays visible during animation
    visibility: ishovered === 'true' ? 'visible' : 'hidden',
    opacity: ishovered === 'true' ? 1 : 0,
    transition: 'opacity 0.8s, visibility 0.8s',
  })
);

interface HeaderSectionProps {
  member: {
    id: string;
    name: string;
    children?: any[];
    partners?: any[];
  };
  onOpenAddDialog: () => void;
  onDelete?: (memberId: string) => void;
  canDelete?: boolean;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  member,
  onOpenAddDialog,
  onDelete,
  canDelete = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState({
    title: '',
    content: '',
    dialogType: 'warning' as 'warning' | 'error' | 'info',
  });

  const hasConnections = React.useMemo(() => {
    const hasChildren = member.children && member.children.length > 0;
    const hasPartners = member.partners && member.partners.length > 0;
    return hasChildren || hasPartners;
  }, [member]);

  const handleAddClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onOpenAddDialog();
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    if (hasConnections) {
      // Show error dialog - can't delete
      setDialogProps({
        title: 'Cannot Delete',
        content:
          'This member has partners or children connected to it and cannot be deleted. Please remove all connections first.',
        dialogType: 'error',
      });
    } else {
      // Show warning dialog - confirm deletion
      setDialogProps({
        title: 'Confirm Deletion',
        content: `Are you sure you want to delete ${member.name}? This action cannot be undone.`,
        dialogType: 'warning',
      });
    }

    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setDeleteDialogOpen(false);
    if (onDelete && !hasConnections) {
      onDelete(member.id);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: 34,
          backgroundColor: COLORS.filenameBox,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 12px',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          position: 'relative',
          overflow: 'visible',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 800,
            color: COLORS.text,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            maxWidth: '75%',
          }}
          title={member.name} // Add tooltip on hover
        >
          {member.name}
        </Typography>

        {/* Icons that appear on hover with rotation animation */}
        <ActionsContainer ishovered={isHovered ? 'true' : 'false'}>
          <Tooltip title="Add" arrow placement="bottom">
            <AnimatedIconButton
              ishovered={isHovered ? 'true' : 'false'}
              size="small"
              onClick={handleAddClick}
              sx={{
                p: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
              data-testid={`add-button-${member.id}`}
            >
              <AddIcon fontSize="small" />
            </AnimatedIconButton>
          </Tooltip>

          {canDelete && (
            <Tooltip title="Delete" arrow placement="bottom">
              <AnimatedIconButton
                ishovered={isHovered ? 'true' : 'false'}
                size="small"
                onClick={handleDeleteClick}
                sx={{
                  p: 0.5,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 0, 0, 0.04)',
                  },
                }}
                data-testid={`delete-button-${member.id}`}
              >
                <DeleteOutlineIcon fontSize="small" color="error" />
              </AnimatedIconButton>
            </Tooltip>
          )}
        </ActionsContainer>

        {/* Right arrow - always visible */}
        <ArrowIcon style={{ width: 15, height: 20 }} />
      </Box>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        title={dialogProps.title}
        content={dialogProps.content}
        dialogType={dialogProps.dialogType}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default HeaderSection;
