import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

interface CustomizedBackdropProps {
  isLoading?: boolean;
  title?: string;
}

function CustomizedBackdrop({
  isLoading = false,
  title = '',
}: CustomizedBackdropProps): JSX.Element {
  return isLoading ? (
    <Backdrop open={isLoading}>
      <CircularProgress
        sx={{ marginRight: '10px' }}
        size={25}
        color="inherit"
      />
      <Typography>{title}</Typography>
    </Backdrop>
  ) : (
    <></>
  );
}

export default CustomizedBackdrop;
