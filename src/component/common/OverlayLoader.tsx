import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

function OverlayLoader(props: {
  open: boolean;
  loadingText: string;
}): JSX.Element {
  const { open, loadingText } = props;
  return (
    <Grid>
      {open && (
        <Backdrop open={open}>
          <Grid
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: 10,
              padding: '15px',
              color: '#FFF',
            }}
          >
            {loadingText && (
              <Typography display="inline" sx={{ fontSize: '1rem' }}>
                {loadingText}
              </Typography>
            )}
            <CircularProgress
              sx={{ marginLeft: '10px' }}
              size={25}
              color="inherit"
            />
          </Grid>
        </Backdrop>
      )}
    </Grid>
  );
}

OverlayLoader.defaultProps = {
  open: false,
  loadingText: '',
};

export default OverlayLoader;
