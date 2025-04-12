import React from 'react';
import { Field, FieldProps } from 'formik';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useGetStatesQuery } from '../../../store/Services/commonService';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface Option {
  state: string;
  desc: string;
}

interface StateDropdownProps {
  label?: string;
  placeholder?: string;
  sx?: object;
  name: string;
  emptyOption?: boolean;
  filterName?: string;
}

const StateDropdown: React.FC<StateDropdownProps & TextFieldProps> = ({
  label,
  placeholder = '',
  sx,
  name,
  emptyOption = true,
  filterName,
  ...props
}) => {
  const { data, isLoading, isFetching } = useGetStatesQuery();
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
    data?.states &&
    Array.isArray(data?.states) &&
    data?.states.map((option: Option) => {
      return (
        <option key={option.state} value={option.state} id={option.state}>
          {`${option.state}-${option.desc}`}
        </option>
      );
    });
  return (
    <Field name={name}>
      {({ field }: FieldProps<string>) => {
        return (
          <TextField
            {...field}
            {...props}
            label={label}
            select
            sx={textFieldStyle}
            fullWidth
            variant="outlined"
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
            inputProps={{ id: filterName || name }}
          >
            {(emptyOption || isLoading) && (
              <option value="">
                {isLoading ? 'Fetching data...' : placeholder || ''}
              </option>
            )}
            {textFieldChild}
          </TextField>
        );
      }}
    </Field>
  );
};

export default StateDropdown;
