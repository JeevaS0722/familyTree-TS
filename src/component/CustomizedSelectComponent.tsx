import TextField from '@mui/material/TextField';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';
import { FieldProps } from 'formik';
import React from 'react';

interface CustomSelectFieldProps {
  labelName: string;
  extraOptions?: [];
  options:
    | {
        [key: string]: string;
      }[]
    | string[];
  valueKey?: string;
  labelKey?: string | ((data: { [key: string]: string }) => string);
  hasEmptyValue?: boolean;
  idKey?: string;
  additionalStyle?: object;
}

export const CustomSelectField: React.FC<
  CustomSelectFieldProps & FieldProps
> = ({
  field,
  labelKey = 'label',
  idKey,
  labelName,
  hasEmptyValue = false,
  valueKey = 'value',
  options,
  extraOptions = [],
  additionalStyle = {},
  ...props
}) => {
  const textFieldStyle = {
    width: { xs: '100%' },
    background: '#434857',
    borderRadius: '4px',
    outline: 'none',
    '& .Mui-disabled': {
      opacity: 1,
      background: '#30343e',
      cursor: 'not-allowed',
      color: '#fff',
      '-webkit-text-fill-color': 'unset !important',
    },
    ...additionalStyle,
  };
  const selectFieldStyle = {
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
  };
  return (
    <TextField
      {...field}
      select
      SelectProps={{
        native: true,
        IconComponent: props => (
          <ArrowDropDownIcon sx={{ color: '#fff !important' }} {...props} />
        ),
        sx: selectFieldStyle,
      }}
      id="outlined-select-currency-native"
      sx={textFieldStyle}
      {...props}
    >
      {hasEmptyValue && (
        <option value="" id={`${labelName}empty`}>
          {''}
        </option>
      )}
      {Array.isArray(options) &&
        [...extraOptions, ...options].map((option, index) => {
          let label = '';
          let value = '';
          if (typeof option === 'string') {
            label = option;
            value = option;
          } else {
            if (valueKey && valueKey in option) {
              value = option[valueKey];
            }
            if (typeof labelKey === 'function') {
              label = labelKey(option);
            } else if (labelKey && labelKey in option) {
              label = option[labelKey];
            }
          }
          return (
            <option
              key={value}
              value={value}
              id={`${idKey ? idKey : labelName ? `${labelName},${index}` : value}`}
            >
              {label}
            </option>
          );
        })}
    </TextField>
  );
};

export const ModalCustomDropDown: React.FC<
  CustomSelectFieldProps & FieldProps
> = ({
  field,
  labelKey,
  labelName,
  hasEmptyValue = true,
  valueKey,
  options,
  extraOptions = [],
  ...props
}) => {
  return (
    <TextField
      {...field}
      select
      sx={{
        borderRadius: '4px',
      }}
      SelectProps={{
        native: true,
        IconComponent: props => (
          <ArrowDropDownIcon sx={{ color: '#fff !important' }} {...props} />
        ),
        sx: {
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
        },
      }}
      id="outlined-select-currency-native"
      {...props}
    >
      {hasEmptyValue && (
        <option value="" id={`${labelName}empty`}>
          {''}
        </option>
      )}
      {Array.isArray(options) &&
        [...extraOptions, ...options].map((option, index) => {
          let label = '';
          let value = '';
          if (typeof option === 'string') {
            label = option;
            value = option;
          } else {
            if (valueKey && valueKey in option) {
              value = option[valueKey];
              label = value;
            }
            if (typeof labelKey === 'function') {
              label = labelKey(option);
            } else if (labelKey && labelKey in option) {
              label = option[labelKey];
            }
          }
          return (
            <option
              key={label}
              value={label}
              id={`${labelName ? `${labelName},${index}` : value}`}
            >
              {value}
            </option>
          );
        })}
    </TextField>
  );
};
