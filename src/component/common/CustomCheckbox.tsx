import { Checkbox, styled } from '@mui/material';

export const CustomCheckbox = styled(Checkbox)(() => ({
  color: 'white',
  '& .MuiButtonBase-root .MuiCheckbox-root': {
    padding: '0',
  },
}));
