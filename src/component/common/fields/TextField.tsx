import React from 'react';
import { Field, FieldProps } from 'formik';
import Box from '@mui/material/Box';
import { TextFieldProps } from '@mui/material';
import StyledInputField from '../CommonStyle';

interface FormikTextFieldProps
  extends Omit<TextFieldProps, 'name' | 'value' | 'onChange'> {
  name: string;
  boxProps?: object;
}

const FormikTextField: React.FC<FormikTextFieldProps> = ({
  name,
  boxProps = {},
  ...props
}) => {
  return (
    <Field name={name}>
      {({ field, meta }: FieldProps<string>) => {
        const showError = meta.touched && Boolean(meta.error);
        return (
          <Box {...boxProps}>
            <StyledInputField
              {...field}
              {...props}
              error={showError}
              inputProps={{
                id: name,
                ...props.inputProps,
              }}
            />
          </Box>
        );
      }}
    </Field>
  );
};

export default FormikTextField;
