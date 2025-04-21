// src/components/FamilyTree/components/ConfirmationDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export type DialogType = 'warning' | 'error' | 'info';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  content: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  dialogType?: DialogType;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * A reusable confirmation dialog component with customizable content and actions.
 */
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  content,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  dialogType = 'warning',
  onConfirm,
  onCancel,
}) => {
  // Define colors based on dialog type
  const getIconAndColor = () => {
    switch (dialogType) {
      case 'error':
        return {
          icon: <ErrorOutlineIcon sx={{ fontSize: 40, color: '#f44336' }} />,
          color: '#f44336',
          backgroundColor: 'rgba(244, 67, 54, 0.08)',
        };
      case 'info':
        return {
          icon: <ErrorOutlineIcon sx={{ fontSize: 40, color: '#2196f3' }} />,
          color: '#2196f3',
          backgroundColor: 'rgba(33, 150, 243, 0.08)',
        };
      case 'warning':
      default:
        return {
          icon: <WarningAmberIcon sx={{ fontSize: 40, color: '#ff9800' }} />,
          color: '#ff9800',
          backgroundColor: 'rgba(255, 152, 0, 0.08)',
        };
    }
  };

  const { icon, color, backgroundColor } = getIconAndColor();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: 320,
          maxWidth: 500,
          backgroundColor: '#2C2C2C', // Dark background for better contrast with white text
        },
      }}
    >
      <DialogTitle
        id="confirmation-dialog-title"
        sx={{
          backgroundColor,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          color,
          fontWeight: 'bold',
        }}
      >
        {icon}
        {title}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {typeof content === 'string' ? (
          <DialogContentText
            id="confirmation-dialog-description"
            sx={{ color: 'white' }}
          >
            {content}
          </DialogContentText>
        ) : (
          <Box id="confirmation-dialog-description" sx={{ color: 'white' }}>
            {content}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onCancel} variant="outlined" color="inherit">
          {cancelText}
        </Button>
        {dialogType !== 'error' && (
          <Button
            onClick={onConfirm}
            variant="contained"
            color={dialogType === 'warning' ? 'warning' : 'primary'}
            autoFocus
          >
            {confirmText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
