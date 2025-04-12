import React from 'react';
import TextField from '@mui/material/TextField';
import { FieldProps, useField } from 'formik';

interface StyledPhoneFieldProps {
  length: number;
  innerRef?: React.RefObject<HTMLInputElement>;
  nextFieldRef?: React.RefObject<HTMLInputElement>;
  name?: string;
}

export const CustomPhoneField: React.FC<StyledPhoneFieldProps & FieldProps> = ({
  length,
  innerRef,
  nextFieldRef,
  name,
  ...props
}) => {
  const [field] = useField(name || '');
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = event.target.value;
    if (currentValue.length <= length) {
      field.onChange(event);
      if (
        currentValue.length === length &&
        nextFieldRef &&
        nextFieldRef.current
      ) {
        nextFieldRef.current.focus();
      }
    }
  };
  return (
    <TextField
      type="tel"
      {...field}
      inputProps={{
        maxLength: length,
        id: `${name}` || 'phone',
        sx: {
          backgroundColor: '#434857',
          borderRadius: '0.25rem',
          maxHeight: '43px',
          color: 'white',
        },
      }}
      {...props}
      inputRef={innerRef}
      onChange={handleInputChange}
      sx={{
        backgroundColor: '#434857',
        borderRadius: '0.25rem',
        maxHeight: '43px',
        color: 'white',
        '&:focus': {
          backgroundColor: 'white',
          color: 'black',
        },
        '& .MuiInputBase-input': {
          padding: '0.5rem 0.75rem',
          fontSize: '0.9rem',
          '@media (max-width: 960px)': {
            fontSize: '1rem !important',
          },
          color: 'white',
          '&:focus': {
            backgroundColor: 'white',
            borderRadius: '0.25rem',
            color: 'black',
          },
        },
      }}
    />
  );
};
