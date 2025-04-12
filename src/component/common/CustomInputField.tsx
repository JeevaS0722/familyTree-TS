import styled from '@mui/material/styles/styled';
import TextField from '@mui/material/TextField';

export const CustomInputField = styled(TextField)<{
  width: string;
  backgroundColor: string;
}>(({ theme, width, backgroundColor }) => ({
  backgroundColor: backgroundColor,
  borderRadius: '0.25rem',
  width: width,
  '&:focus-within': {
    backgroundColor: 'white',
    '& .MuiInputBase-input': {
      color: '#555',
    },
  },
  '& .MuiInputBase-input': {
    padding: '0.5rem 0.75rem',
    fontSize: '0.9rem',
    color: '#fff',
    [theme.breakpoints.down('md')]: {
      fontSize: '1rem !important',
    },
  },
  '& .Mui-disabled': {
    opacity: 1,
    background: '#30343e',
    cursor: 'not-allowed',
    color: '#fff',
    '-webkit-text-fill-color': 'unset !important',
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));
