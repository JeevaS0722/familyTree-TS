import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
interface CustomModelProps {
  open: boolean;
  handleClose: () => void;
  handleDelete?: () => void;
  modalHeader: string;
  modalTitle: string;
  modalButtonLabel?: string;
}

const CustomModel: React.FC<CustomModelProps> = ({
  open,
  handleClose,
  handleDelete,
  modalHeader,
  modalTitle,
  modalButtonLabel,
}) => {
  const [disabled, setDisabled] = useState(false);
  React.useEffect(() => {
    if (!open) {
      // When modal closes, reset disabled state
      setDisabled(false);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogTitle id="alert-dialog-title">{modalHeader}</DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          sx={{ color: 'white' }}
        >
          {modalTitle}
        </DialogContentText>
        <Grid
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '20px',
          }}
        >
          <Button
            disabled={disabled}
            type="submit"
            id="cancel"
            variant="outlined"
            onClick={handleClose}
            sx={{
              whiteSpace: 'nowrap',
              '&:disabled': {
                opacity: 0.2,
                cursor: 'not-allowed',
                borderColor: '#1997c6',
                color: '#fff',
              },
            }}
          >
            Cancel
          </Button>

          {modalButtonLabel && handleDelete && (
            <Button
              disabled={disabled}
              id={`confirm-${modalButtonLabel.split(' ').join('-')}`}
              variant="outlined"
              type="submit"
              onClick={() => {
                setDisabled(true);
                handleDelete();
              }}
              sx={{
                whiteSpace: 'nowrap',
                '&:disabled': {
                  opacity: 0.2,
                  cursor: 'not-allowed',
                  borderColor: '#1997c6',
                  color: '#fff',
                },
              }}
            >
              {!disabled ? (
                modalButtonLabel
              ) : (
                <CircularProgress
                  sx={{
                    width: '24px',
                    height: '24px',
                  }}
                  color="inherit"
                />
              )}
            </Button>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModel;
