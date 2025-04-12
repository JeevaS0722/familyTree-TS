import React from 'react';
import { Field, FieldProps } from 'formik';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import useDynamicFileQuery from './helper/useDynamicFileQuery';

interface Option {
  place?: string;
  value?: string;
}

const getOptionAttributes = (option: Option, type: 'status' | 'location') => {
  switch (type) {
    case 'status':
    case 'location':
      return {
        key: option.place || '',
        value: option.place || '',
        displayText: option.place || '',
      };
    default:
      return {
        key: '',
        value: '',
        displayText: '',
      };
  }
};

interface FileStatusDropdownProps {
  label?: string;
  placeholder?: string;
  type: 'status' | 'location';
  sx?: object;
  name: string;
}

const FileStatusDropdown: React.FC<
  FileStatusDropdownProps & TextFieldProps
> = ({ label, placeholder = '', type, sx, name, ...props }) => {
  const { data, isLoading, isFetching } = useDynamicFileQuery(type);
  const textFieldStyle = {
    width: { xs: '100%' },
    background: '#434857',
    borderRadius: '4px',
    '&:focus-within': {
      backgroundColor: 'white',
      '& .MuiInputBase-input': {
        color: '#555',
      },
      '& .MuiNativeSelect-icon': {
        color: '#555 !important',
      },
    },
    '& .MuiInputBase-input': {
      padding: '0.5rem 0.75rem',
      fontSize: '0.9rem',
      color: '#fff',
    },
    ...sx,
  };
  const textFieldChild =
    data &&
    data.places &&
    Array.isArray(data.places) &&
    data.places.map(option => {
      const { key, value, displayText } = getOptionAttributes(option, type);
      return (
        <option key={key} value={value} id={value}>
          {displayText}
        </option>
      );
    });
  return (
    <Field name={name}>
      {({ field, meta }: FieldProps<string>) => {
        return (
          <TextField
            {...field}
            {...props}
            label={label}
            select
            fullWidth
            variant="outlined"
            sx={textFieldStyle}
            SelectProps={{
              native: true,
              IconComponent: props => (
                <Box>
                  {isFetching && !isLoading && (
                    <CircularProgress
                      size={20}
                      sx={{
                        color: '#fff',
                        marginRight: '5px',
                      }}
                    />
                  )}
                  {!isFetching && (
                    <ArrowDropDownIcon
                      sx={{ color: '#fff !important' }}
                      {...props}
                    />
                  )}
                </Box>
              ),
            }}
            // helperText={meta.touched && meta.error ? meta.error : undefined}
            error={meta.touched && Boolean(meta.error)}
            inputProps={{ id: name }}
          >
            <option value="">
              {isLoading ? 'Fetching data...' : placeholder || ''}
            </option>
            {textFieldChild}
          </TextField>
        );
      }}
    </Field>
  );
};

export default FileStatusDropdown;
