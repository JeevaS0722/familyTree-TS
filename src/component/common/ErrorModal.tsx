import React, { ReactElement, useEffect } from 'react';
import { Button, Dialog, Grid } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Link, useNavigate } from 'react-router-dom';
import { close } from '../../store/Reducers/modalReducer';

interface ErrorModalProps {
  open: boolean;
  handleClose?: () => void;
  showHeader?: boolean;
  showContent?: boolean;
  showButton?: boolean;
  modalHeader?: string;
  modalContent?: ReactElement | string;
  modalButtonLabel?: string;
  disabled?: boolean;
  showDashboardLink?: boolean;
  action?: () => void;
  actionDelay?: number;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  open,
  showHeader = true,
  showContent = true,
  showButton = true,
  showDashboardLink = true,
  handleClose,
  modalHeader,
  modalContent,
  modalButtonLabel,
  disabled,
  action,
  actionDelay = 3000,
}) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    close();
    navigate('/');
    if (window.location.pathname === '/') {
      window.location.reload();
    }
  };
  useEffect(() => {
    if (action) {
      setTimeout(action, actionDelay);
    }
  }, [action]);
  return (
    <Dialog
      open={open}
      disableEscapeKeyDown={true}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {showHeader && (
        <DialogTitle id="alert-dialog-title">{modalHeader}</DialogTitle>
      )}
      {showContent && (
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ color: 'white' }}
          >
            {modalContent}
            {showDashboardLink && (
              <Grid item sx={{ textAlign: 'right' }} mt={1}>
                <Link
                  key="goToDashboardLink"
                  id="goToDashboardLink"
                  className="hover-link td-none"
                  to="/"
                  onClick={handleNavigate}
                >
                  Go To Dashboard
                </Link>
              </Grid>
            )}
          </DialogContentText>
          {showButton && (
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
                {modalButtonLabel}
              </Button>
            </Grid>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ErrorModal;
