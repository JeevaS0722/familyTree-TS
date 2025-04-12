import React from 'react';
import { Field, FieldProps } from 'formik';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useGetAllBuyersQuery } from '../../../store/Services/employeeService';

interface Option {
  employeeID: number;
  fullName: string;
  lastName: string;
  firstName: string;
  buyers: number;
  initials: string;
  extension: number;
  email: string;
}

interface BuyerDropdownProps {
  label?: string;
  placeholder?: string;
  sx?: object;
  name: string;
  filterName?: string;
}

const BuyerDropdown: React.FC<BuyerDropdownProps & TextFieldProps> = ({
  label,
  placeholder = '',
  sx,
  name,
  filterName,
  ...props
}) => {
  const { data, isFetching, isLoading } = useGetAllBuyersQuery();
  const textFieldStyle = {
    width: { xs: '100%', sm: '30%' },
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
    data?.data?.buyers &&
    Array.isArray(data?.data?.buyers) &&
    data?.data?.buyers.map((option: Option) => {
      return (
        <option
          key={option.employeeID}
          value={option.employeeID}
          id={`${option.employeeID}`}
        >
          {option.fullName}
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
            inputProps={{ id: filterName || name }}
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

export default BuyerDropdown;
