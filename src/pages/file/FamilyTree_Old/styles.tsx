// src/components/FamilyTree/styles.tsx
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { COLORS, CARD_HEIGHT } from './types';

// Main card container
export const CardContainer = styled(Box, {
  shouldForwardProp: prop => prop !== 'isDeceased' && prop !== 'gender',
})<{ isDeceased?: boolean; gender?: 'male' | 'female' | 'other' }>(
  ({ isDeceased, gender }) => ({
    position: 'relative',
    width: 300,
    height: CARD_HEIGHT,
    borderRadius: 20,
    border: `3px solid ${isDeceased ? COLORS.deceased : 'transparent'}`,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    overflow: 'visible',
  })
);

// Updated Relationship badge with conditional border
export const RelationshipBadge = styled(Box, {
  shouldForwardProp: prop => prop !== 'isDeceased',
})<{ isDeceased?: boolean }>(({ isDeceased }) => ({
  position: 'absolute',
  top: -23,
  left: 15,
  backgroundColor: COLORS.relationshipBadge,
  color: COLORS.text,
  padding: '3px 10px',
  zIndex: 1,
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
  border: isDeceased ? `3px solid ${COLORS.deceased}` : 'none',
  borderBottom: 'none',
}));

// Left panel
export const LeftPanel = styled(Box, {
  shouldForwardProp: prop => prop !== 'gender',
})<{ gender?: 'male' | 'female' | 'other' }>(({ gender }) => ({
  width: '50%',
  height: 'calc(100% - 52px)', // Subtract header and bottom bar height
  backgroundColor: gender === 'female' ? COLORS.femaleLeft : COLORS.maleLeft,
  padding: '8px 12px',
  float: 'left',
}));

// Right panel
export const RightPanel = styled(Box, {
  shouldForwardProp: prop => prop !== 'gender',
})<{ gender?: 'male' | 'female' | 'other' }>(({ gender }) => ({
  width: '50%',
  height: 'calc(100% - 52px)', // Subtract header and bottom bar height
  backgroundColor: gender === 'female' ? COLORS.femaleRight : COLORS.maleRight,
  padding: '8px 12px',
  float: 'right',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

// Bottom bar
export const BottomBar = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 18,
  backgroundColor: COLORS.bottomArrowContainer,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderBottomLeftRadius: 16,
  borderBottomRightRadius: 16,
  clear: 'both',
}));

// Division field
export const DivisionField = styled(Box)(({ theme }) => ({
  width: 123,
  height: 19,
  backgroundColor: '#fff',
  borderRadius: 8,
  border: '1px solid #000',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 10,
}));

// Percentage field
export const PercentageField = styled(Box)(({ theme }) => ({
  width: 123,
  height: 19,
  backgroundColor: '#fff',
  borderRadius: 8,
  border: '1px solid #000',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 12px',
}));

// Control Panel for pan and zoom
export const ControlPanel = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 20,
  right: 20,
  zIndex: 10,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderRadius: 8,
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
}));
