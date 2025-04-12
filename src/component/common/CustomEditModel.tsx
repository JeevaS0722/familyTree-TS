import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';

interface CustomEditModelProps {
  open: boolean;
  handleClose: () => void;
  fileName?: string;
  handleUpdate?: (inputValue: string) => void;
  modalHeader: string;
  modalButtonLabel?: string;
  loading?: boolean;
  extension?: string;
}

const CustomEditModel: React.FC<CustomEditModelProps> = ({
  open,
  handleClose,
  handleUpdate,
  modalHeader,
  modalButtonLabel,
  fileName = '',
  loading = false,
  extension = '',
}) => {
  const [inputValue, setInputValue] = useState<string>(fileName);
  const [error, setError] = useState(false);

  // Update inputValue when fileName changes
  useEffect(() => {
    setInputValue(fileName);
  }, [fileName]);

  // Function to calculate the maxLength dynamically based on file extension
  const getExtensionLength = (ext: string): number => {
    return ext ? ext.length + 1 : 0; // Include the dot if there's an extension
  };

  // Dynamically calculate the max length for the input field
  const maxLength = 255 - getExtensionLength(extension);
  // Handler for the confirm button click
  const handleConfirmClick = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) {
      setError(true);
    } else {
      handleUpdate?.(trimmedValue);
    }
  };

  // Determine if the confirm button should be disabled
  const isDisabled =
    loading ||
    inputValue.trim() === '' ||
    inputValue.trim() === fileName.trim();

  return (
    <Dialog
      open={open}
      onClose={() => {
        setError(false);
        handleClose();
      }}
      aria-labelledby="custom-edit-modal-title"
      aria-describedby="custom-edit-modal-description"
      PaperProps={{
        sx: {
          width: '500px',
          maxWidth: '90%',
        },
      }}
    >
      <DialogTitle id="custom-edit-modal-title">{modalHeader}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Rename To"
          fullWidth
          variant="outlined"
          value={inputValue}
          id="doc-rename"
          onChange={e => {
            setInputValue(e.target.value);
            if (error) {
              setError(false);
            }
          }}
          error={error}
          inputProps={{
            maxLength: maxLength,
          }}
          helperText={error ? 'Name is required.' : ''}
          sx={{
            marginTop: '20px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white',
              },
              '&:hover fieldset': {
                borderColor: 'white',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'white',
            },
            '& .MuiOutlinedInput-input': {
              color: 'white',
            },
          }}
        />
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
            disabled={loading}
            variant="outlined"
            id="cancel"
            onClick={() => {
              setError(false);
              handleClose();
            }}
            sx={{
              whiteSpace: 'nowrap',
              '&:disabled': {
                opacity: 0.5,
                cursor: 'not-allowed',
                borderColor: '#1997c6',
                color: '#fff',
              },
            }}
          >
            Cancel
          </Button>

          {modalButtonLabel && handleUpdate && (
            <Button
              disabled={isDisabled}
              id={`confirm-${modalButtonLabel}`}
              variant="outlined"
              onClick={handleConfirmClick}
              sx={{
                whiteSpace: 'nowrap',
                position: 'relative',
                '&:disabled': {
                  opacity: 0.5,
                  cursor: 'not-allowed',
                  borderColor: '#1997c6',
                  color: '#fff',
                },
              }}
            >
              {modalButtonLabel}
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: 'inherit',
                    position: 'absolute',
                  }}
                />
              )}
            </Button>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default CustomEditModel;
