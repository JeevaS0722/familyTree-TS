import styled from '@mui/material/styles/styled';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';

export const StyledInputField = styled(TextField)(({ theme }) => ({
  backgroundColor: '#434857',
  borderRadius: '0.25rem',
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
    background: '#434857',
    cursor: 'not-allowed',
    color: '#fff',
    '-webkit-text-fill-color': 'unset !important',
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

export const StyledCheckboxField = styled(Checkbox)(() => ({
  color: 'white',
  fontSize: '0.5rem',
  '&.Mui-checked': {
    position: 'relative',
    color: '#0288C8 !important',
    zIndex: 0,
  },
  '&.Mui-checked:after': {
    content: '""',
    left: 12,
    top: 12,
    height: 14,
    width: 14,
    position: 'absolute',
    backgroundColor: 'white',
    zIndex: -1,
  },
}));

export const CustomInputLabel = styled(InputLabel)(({ theme }) => ({
  color: '#cfd2da',
  fontSize: '0.9rem',
  lineHeight: '1.5',
  whiteSpace: 'normal',
  [theme.breakpoints.down('md')]: {
    marginTop: '15px',
  },
}));

export const StyledInputLabel = styled(InputLabel)({
  color: '#cfd2da',
  fontSize: '0.9rem',
  lineHeight: '1.5',
  whiteSpace: 'normal',
});

export const StyledGrid = styled(Grid)({
  marginTop: '10px',
});

export const StyledGridItem = styled(Grid)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
});

export const ErrorText = styled(Box)({
  color: '#FF474C',
});

export const ErrorTextValidation = styled(Box)({
  fontSize: '0.875rem',
  color: '#FF474C',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontWeight: 400,
  lineHeight: 1.43,
});

export const TotalFileOfferInputField = styled(TextField)(({ theme }) => ({
  backgroundColor: '#434857',
  borderRadius: '0.25rem',
  // width: '30%',
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
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

export const StyledRadio = styled(Radio)({
  color: '#cfd2da',
  '&.Mui-checked': {
    color: '#0288C8',
  },
});

export default StyledInputField;
