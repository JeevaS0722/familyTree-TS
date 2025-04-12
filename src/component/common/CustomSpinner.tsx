import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

function CustomSpinner(props: { loadingText: string }): JSX.Element {
  const { t } = useTranslation('common');
  const { loadingText } = props;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '50%',
        left: '40%',
        gap: '10px',
      }}
    >
      <Typography>{t(loadingText)}</Typography>
      <CircularProgress sx={{ color: 'white' }} />
    </Box>
  );
}

CustomSpinner.defaultProps = {
  open: false,
  loadingText: 'loading',
};

export default CustomSpinner;
