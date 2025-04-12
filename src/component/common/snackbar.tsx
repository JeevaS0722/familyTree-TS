import React, { Fragment } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { close } from '../../store/Reducers/snackbar';
import ErrorModal from './ErrorModal';

const CustomSnackbar: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    open,
    verticalPosition,
    horizonalPosition,
    message,
    severity,
    persist,
  } = useAppSelector(state => state.snackbar);

  const {
    open: modalOpen,
    message: modalContent,
    title: modalHeader,
    showDashboardLink,
  } = useAppSelector(state => state.modal);

  function handleClose() {
    dispatch(close());
  }

  function handleModalClose() {}

  return (
    <Fragment>
      <Snackbar
        open={open}
        autoHideDuration={persist ? null : 4000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: verticalPosition || 'top',
          horizontal: horizonalPosition || 'center',
        }}
      >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      <ErrorModal
        open={modalOpen}
        handleClose={handleModalClose}
        modalHeader={modalHeader}
        modalContent={modalContent}
        showDashboardLink={showDashboardLink}
        showButton={false}
      />
    </Fragment>
  );
};

export default CustomSnackbar;
