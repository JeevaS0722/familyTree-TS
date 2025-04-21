/* eslint-disable complexity */
// src/components/FamilyTree/components/FamilyCard.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Paper,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { styled, keyframes } from '@mui/material/styles';

// Import components and styles
import HeaderSection from './HeaderSection';
import EnhancedRelationshipBadge from './EnhancedRelationshipBadge';
import NotesPanel from './NotesPanel';
import {
  CardContainer,
  LeftPanel,
  RightPanel,
  BottomBar,
  DivisionField,
  PercentageField,
} from '../styles';

// Import types and constants
import { FamilyMember, CARD_WIDTH } from '../types';

// Import SVG components
import NotesIcon from '../svg/notes';
import DollarIcon from '../svg/doc-dollar';
import DocIcon from '../svg/document';
import ArrowIcon from '../svg/arrow';

const rotateUpAnimation = keyframes`
  from {
    transform: rotate(90deg);
  }
  to {
    transform: rotate(270deg);
  }
`;

// Animation for arrow rotation from up to down
const rotateDownAnimation = keyframes`
  from {
    transform: rotate(270deg);
  }
  to {
    transform: rotate(90deg);
  }
`;

// Styled rotating arrow with enhanced hover animation
const RotatingArrow = styled(Box, {
  shouldForwardProp: prop =>
    prop !== 'isRotated' && prop !== 'isAnimating' && prop !== 'isHovered',
})<{ isRotated: boolean; isAnimating: boolean; isHovered: boolean }>(
  ({ isRotated, isAnimating, isHovered }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s ease',
    animation: isAnimating
      ? isRotated
        ? `${rotateUpAnimation} 0.3s forwards`
        : `${rotateDownAnimation} 0.3s forwards`
      : 'none',
    transform: isRotated
      ? 'rotate(270deg)'
      : isHovered
        ? 'rotate(270deg)'
        : 'rotate(90deg)',
  })
);

// Custom styled components for the offer popup
const OfferPopup = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: -20,
  left: 35,
  width: 200,
  padding: theme.spacing(1.5),
  backgroundColor: 'white',
  borderRadius: 12,
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '&:after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: -8,
    marginTop: -8,
    width: 0,
    height: 0,
    borderTop: '8px solid transparent',
    borderBottom: '8px solid transparent',
    borderRight: '8px solid white',
  },
}));

const OfferLink = styled(Link)({
  color: '#1976d2',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '14px',
  '&:hover': {
    textDecoration: 'underline',
  },
});

interface FamilyCardProps {
  member: FamilyMember;
  onAddChild: (member: FamilyMember) => void;
  onAddPartner: (member: FamilyMember) => void;
  onEdit: (member: FamilyMember) => void;
  onDelete?: (memberId: string) => void;
  onUpdateRelationship?: (member: FamilyMember, newType: string) => void;
  position?: { x: number; y: number };
  onPositionChange?: (id: string, rect: DOMRect) => void;
  scale: number;
}

const FamilyCard: React.FC<FamilyCardProps> = ({
  member,
  onAddChild,
  onAddPartner,
  onEdit,
  onDelete,
  onUpdateRelationship,
  position,
  onPositionChange,
  scale,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const cardRef = useRef<HTMLDivElement>(null);
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [arrowRotated, setArrowRotated] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [arrowHovered, setArrowHovered] = useState(false);

  useEffect(() => {
    if (cardRef.current && onPositionChange) {
      const rect = cardRef.current.getBoundingClientRect();
      onPositionChange(member.id, rect);
    }
  }, [member.id, onPositionChange, position, scale]);

  const handleBottomMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    // If notes panel is open, toggle it closed
    if (showNotesPanel) {
      handleToggleNotesPanel();
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(member);
    handleCloseMenu();
  };

  const handleOpenAddDialog = () => {
    console.log('Opening add dialog for member:', member.id);
    onAddPartner(member);
  };

  const handleDelete = (memberId: string) => {
    console.log('Deleting member:', memberId);
    if (onDelete) {
      onDelete(memberId);
    }
  };

  const handleUpdateRelationship = (newType: string) => {
    console.log('Updating relationship:', member.id, newType);
    if (onUpdateRelationship) {
      onUpdateRelationship(member, newType);
    }
  };

  // Toggle notes panel visibility
  const handleToggleNotesPanel = () => {
    setIsAnimating(true);
    setArrowRotated(!arrowRotated);

    // If we're closing the panel, wait for animation to complete
    if (showNotesPanel) {
      setTimeout(() => {
        setShowNotesPanel(false);
        setIsAnimating(false);
      }, 300);
    } else {
      setShowNotesPanel(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  };

  // Determine if content is more suitable for County of Death display
  const showCountyOfDeath =
    member.countyOfDeath && (!member.address || member.isDeceased);

  // Extract contactId and fileId from member
  const contactId =
    member.contactId ||
    (member.originalContact ? member.originalContact.contactID : null);
  const fileId = member.fileId;

  // Get offer amount from member or a default value
  const offerAmount =
    member.originalContact?.OffersModels?.[0]?.draftAmount2 || '$0.00';

  // Ensure icons have proper cursor style when they are links
  const iconStyle = {
    cursor: 'pointer',
  };

  // Check if this member has new notes
  const hasNotes = member.isNewNotes === true;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: position?.y || 0,
        left: position?.x || 0,
        width: CARD_WIDTH,
        transition: 'all 0.5s ease-in-out',
      }}
      ref={cardRef}
      id={`card-${member.id}`}
      data-node-id={member.id}
    >
      <Box sx={{ position: 'relative' }}>
        {/* Enhanced Relationship badge with dropdown functionality */}
        <EnhancedRelationshipBadge
          isDeceased={member.isDeceased}
          relationshipType={member.relationshipType || 'Unknown'}
          onUpdateRelationship={handleUpdateRelationship}
        />

        {/* Main card */}
        <CardContainer isDeceased={member.isDeceased} gender={member.gender}>
          {/* Updated Header with plus icon that opens dialog directly and delete functionality */}
          <HeaderSection
            member={member}
            onOpenAddDialog={handleOpenAddDialog}
            onDelete={handleDelete}
            canDelete={Boolean(onDelete)}
          />

          {/* Left panel */}
          <LeftPanel gender={member.gender}>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#000000',
                mb: 0.5,
              }}
            >
              Age: {member.age}
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#000000',
                mb: 0.5,
              }}
            >
              Birth: {member.birthDate}
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#000000',
                mb: 0.5,
              }}
            >
              Death: {member.deathDate}
            </Typography>

            {!showCountyOfDeath && member.address && (
              <Typography
                sx={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#000000',
                  mt: 0.5,
                }}
              >
                Address:
                <br />
                {member.address}
              </Typography>
            )}

            {showCountyOfDeath && (
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#000000',
                  mt: 0.5,
                }}
              >
                County of Death:
                <br />
                <Typography
                  component="span"
                  sx={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#000000',
                  }}
                >
                  {member.countyOfDeath}
                </Typography>
              </Typography>
            )}
          </LeftPanel>

          {/* Right panel */}
          <RightPanel gender={member.gender}>
            <Box>
              <DivisionField>
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#000000',
                  }}
                >
                  {member.divisionOfInterest}
                </Typography>
              </DivisionField>

              <Box sx={{ position: 'relative' }}>
                {/* Warning icon for notes with red color */}
                {hasNotes && (
                  <Box sx={{ position: 'absolute', left: -10, top: 30 }}>
                    <WarningIcon sx={{ color: '#FF0000' }} />
                  </Box>
                )}
                <PercentageField>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#000000',
                    }}
                  >
                    {member.percentage}
                  </Typography>
                  <ArrowIcon style={{ width: 10, height: 15 }} />
                </PercentageField>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mt: 1,
                justifyContent: 'flex-start',
                position: 'relative',
              }}
            >
              {/* Notes Icon with Link to edit contact notes */}
              {contactId ? (
                <Link
                  to={`/editcontact/${contactId}?tab=notes`}
                  id={`notes-${member.id}`}
                  className="hover-link text-decoration-none"
                >
                  <Tooltip title="View/Edit Notes" arrow>
                    <Box component="span">
                      <NotesIcon
                        style={{
                          ...iconStyle,
                          color: hasNotes ? '#FF0000' : 'inherit',
                        }}
                      />
                    </Box>
                  </Tooltip>
                </Link>
              ) : (
                <NotesIcon />
              )}

              {/* Document Icon with Link to edit file documents */}
              {fileId ? (
                <Link
                  to={`/editfile/${fileId}?tab=docs`}
                  id={`docs-${member.id}`}
                  className="hover-link text-decoration-none"
                >
                  <Tooltip title="View Documents" arrow>
                    <Box component="span">
                      <DocIcon style={iconStyle} />
                    </Box>
                  </Tooltip>
                </Link>
              ) : (
                <DocIcon />
              )}

              {/* Dollar Icon with custom offer popup */}
              <Box
                position="relative"
                onMouseEnter={() => setShowOfferPopup(true)}
                onMouseLeave={() => setShowOfferPopup(false)}
              >
                <Box component="span">
                  <DollarIcon style={iconStyle} />
                </Box>

                {/* Custom Offer Popup */}
                {showOfferPopup && contactId && (
                  <OfferPopup>
                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                      Offer Amount
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                      {offerAmount}
                    </Typography>
                    <OfferLink
                      to={`/editcontact/${contactId}?tab=offers`}
                      id={`offers-${member.id}`}
                    >
                      Link to offer letter
                    </OfferLink>
                  </OfferPopup>
                )}
              </Box>
            </Box>
          </RightPanel>

          {/* Bottom bar with animated arrow */}
          <BottomBar>
            <Tooltip
              title={
                showNotesPanel ? 'Click to hide notes' : 'Click to view notes'
              }
              placement="bottom"
              arrow
            >
              <IconButton
                onClick={handleToggleNotesPanel}
                onMouseEnter={() => setArrowHovered(true)}
                onMouseLeave={() => setArrowHovered(false)}
              >
                <RotatingArrow
                  isRotated={arrowRotated}
                  isAnimating={isAnimating}
                  isHovered={arrowHovered && !showNotesPanel} // Only show hover effect when panel is closed
                >
                  <ArrowIcon style={{ width: 15, height: 20 }} />
                </RotatingArrow>
              </IconButton>
            </Tooltip>
          </BottomBar>

          {/* Notes panel that slides up from bottom */}
          {showNotesPanel && (
            <NotesPanel
              contactId={contactId}
              onClose={() => setShowNotesPanel(false)}
            />
          )}
        </CardContainer>
      </Box>

      {/* Bottom menu - only contains Edit now */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
      </Menu>
    </Box>
  );
};

export default FamilyCard;
