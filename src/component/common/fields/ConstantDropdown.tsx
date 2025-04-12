// FileStatusDropdown.tsx
/* eslint-disable complexity */
import React from 'react';
import { Field, FieldProps } from 'formik';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  emailDesc,
  phoneDesc,
  titleFailedReasons,
} from '../../../utils/constants';
import { useGetTitleNamesQuery } from '../../../store/Services/commonService';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface Option {
  place?: string;
  value?: string;
  id?: string | number;
  reason?: string;
}

const getOptionAttributes = (
  option: Option,
  type: 'phoneDesc' | 'titleFail' | 'emailDesc' | 'title' | 'preposition'
) => {
  switch (type) {
    case 'phoneDesc':
      return {
        key: option.value || '',
        value: option.value || '',
        id: option.value || '',
        displayText: option.value || '',
      };
    case 'titleFail':
      return {
        key: option.reason || '',
        value: option.reason || '',
        id: option.reason || '',
        displayText: option.reason || '',
      };
    case 'emailDesc':
      return {
        key: option.value || '',
        value: option.value || '',
        id: option.value || '',
        displayText: option.value || '',
      };
    case 'title':
      return {
        key: option.value || '',
        value: option.value || '',
        id: option.value || '',
        displayText: option.value || '',
      };
    case 'preposition':
      return {
        key: option.value || '',
        value: option.value || '',
        id: option.value || '',
        displayText: option.value || '',
      };
    default:
      return {
        key: '',
        value: '',
        id: '',
        displayText: '',
      };
  }
};
interface ConstantDropdownProps {
  label?: string;
  placeholder?: string;
  type: 'phoneDesc' | 'titleFail' | 'emailDesc' | 'title' | 'preposition';
  sx?: object;
  name: string;
}

const ConstantDropdown: React.FC<ConstantDropdownProps & TextFieldProps> = ({
  label,
  placeholder = '',
  type,
  sx,
  name,
  ...props
}) => {
  let data: Array<Option> = [];
  const { data: titleNames, isLoading, isFetching } = useGetTitleNamesQuery();
  if (type === 'phoneDesc') {
    data = phoneDesc;
  } else if (type === 'titleFail') {
    data = titleFailedReasons;
  } else if (type === 'emailDesc') {
    data = emailDesc;
  } else if (type === 'title') {
    const formattedData =
      titleNames?.data
        ?.filter(item => item.type === 1)
        ?.map(item => ({
          value: item.titleName,
        })) || [];
    data = formattedData;
  } else if (type === 'preposition') {
    const formattedData =
      titleNames?.data
        ?.filter(item => item.type === 2)
        ?.map(item => ({
          value: item.titleName,
        })) || [];
    data = formattedData;
  }
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
    Array.isArray(data) &&
    data.map(option => {
      const { key, value, displayText, id } = getOptionAttributes(option, type);
      return (
        <option key={key} value={value} id={id}>
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
              {' '}
              {isLoading ? 'Fetching data...' : placeholder || ''}
            </option>
            {textFieldChild}
          </TextField>
        );
      }}
    </Field>
  );
};

export default ConstantDropdown;
