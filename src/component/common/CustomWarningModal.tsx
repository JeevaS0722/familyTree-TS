import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface ModalButton {
  label: string;
  onClick: () => void;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info';
}

interface CustomWarningModelProps {
  open: boolean;
  onClose: () => void;
  modalHeader: string;
  modalTitle: string;
  buttons: ModalButton[]; // Dynamic buttons array
}

const CustomWarningModel: React.FC<CustomWarningModelProps> = ({
  open,
  onClose,
  modalHeader,
  modalTitle,
  buttons,
}) => {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Header with Close Icon */}
      <DialogTitle id="alert-dialog-title">
        {modalHeader}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          sx={{ color: 'white' }}
        >
          {modalTitle}
        </DialogContentText>
      </DialogContent>

      {/* Dynamic Buttons */}
      <DialogActions sx={{ justifyContent: 'center', gap: 2, padding: '16px' }}>
        {buttons.map((button, index) => (
          <Button
            key={index}
            variant={button.variant || 'contained'}
            color={button.color || 'primary'}
            onClick={() => {
              setLoadingIndex(index); // Set loading for this button
              button.onClick();
            }}
            disabled={loadingIndex !== null}
            sx={{
              '&:disabled': {
                opacity: 0.5,
                cursor: 'not-allowed',
              },
            }}
          >
            {loadingIndex === index ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              button.label
            )}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};

export default CustomWarningModel;
