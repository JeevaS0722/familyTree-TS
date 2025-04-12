import React from 'react';
import { Field, FieldProps } from 'formik';
import { useGetStatesQuery } from '../../../store/Services/commonService';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Paper, { PaperProps } from '@mui/material/Paper';
interface MultiSelectProps {
  name: string;
  id: string;
}
const CustomPaper: React.FC<PaperProps> = props => {
  return (
    <Paper
      {...props}
      sx={{
        backgroundColor: '#fff',
        color: '#4c4c4c',
        fontSize: '0.9rem !important',
      }}
    />
  );
};
const MultiSelect: React.FC<MultiSelectProps> = ({ name, id }) => {
  const { data, isFetching } = useGetStatesQuery();

  const options = data?.states
    ? data.states.map(
        (option: { state: string; desc: string }) =>
          `${option.state} - ${option.desc}`
      )
    : [];

  const textFieldStyle = {
    width: { xs: '100%' },
    background: '#434857',
    borderRadius: '4px',
    '& .MuiAutocomplete-popupIndicator': {
      color: 'white !important',
    },
    '&:focus-within': {
      backgroundColor: 'white',
      '& .MuiInputBase-input': {
        color: '#000',
      },
      '& .MuiAutocomplete-popupIndicator': {
        color: '#000 !important',
      },
      '& .MuiSvgIcon-root:not(.MuiChip-deleteIcon)': {
        color: '#000 !important',
      },
      '& .MuiChip-deleteIcon': {
        color: '#fffff !important',
      },
    },
    '& .MuiInputBase-input': {
      fontSize: '1rem',
      color: '#fff',
    },
  };
  const [inputValue, setInputValue] = React.useState<string>('');
  return (
    <Field name={name}>
      {({ field, form }: FieldProps<string>) => {
        const selectedValues = field.value
          ? field.value.split(',').map((val: string) => {
              const matchingOption = options.find(option =>
                option.startsWith(val.trim())
              );
              return matchingOption || val.trim();
            })
          : [];
        const handleBlur = async () => {
          const trimmedInputValue = inputValue.trim();
          const lowerCaseInputValue = trimmedInputValue.toLowerCase();
          const lowerCaseSelectedValues = selectedValues.map(value =>
            value.toLowerCase()
          );

          if (
            trimmedInputValue &&
            !lowerCaseSelectedValues.includes(lowerCaseInputValue)
          ) {
            const newValue = [...selectedValues, trimmedInputValue];
            if (newValue.join(', ').length <= 255) {
              await form.setFieldValue(name, newValue.join(', '));
            }
          }
          setInputValue(''); // Clear input on blur if it’s not in the list
        };

        return (
          <Autocomplete
            onBlur={handleBlur}
            multiple
            id={id}
            PaperComponent={CustomPaper}
            options={options}
            getOptionLabel={option => option}
            onChange={async (event, newValue) => {
              if (newValue.join(', ').length <= 255) {
                await form.setFieldValue(name, newValue.join(', '));
              }
            }}
            value={selectedValues}
            renderInput={params => (
              <TextField
                {...params}
                sx={{
                  ...textFieldStyle,
                  '& .MuiOutlinedInput-root': {
                    display: 'flex',
                    alignItems: 'center',
                    paddingRight: '8px !important', // Override the padding
                    padding: '2px !important',
                  },
                  '& .MuiAutocomplete-inputRoot': {
                    paddingRight: '8px !important', // Remove excess padding here
                  },
                  '& .MuiAutocomplete-input': {
                    minWidth: '100px !important',
                    marginLeft: '8px !important',
                  },
                }}
                variant="outlined"
                placeholder={isFetching ? 'Fetching data...' : 'Select states'}
                inputProps={{
                  ...params.inputProps,
                  maxLength: Math.max(
                    255 - selectedValues.join(', ').length,
                    0
                  ),
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isFetching && (
                        <CircularProgress
                          size={20}
                          style={{ color: '#fff', marginRight: 5 }}
                        />
                      )}
                      <InputAdornment position="end">
                        <ArrowDropDownIcon
                          sx={{
                            color: '#fff',
                            cursor: 'pointer',
                          }}
                        />
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })}
                  sx={{
                    backgroundColor: '#434857',
                    color: '#fff',
                    '& .MuiChip-deleteIcon': {
                      color: '#fff !important',
                    },
                  }}
                />
              ))
            }
            renderOption={(props, option) => (
              <MenuItem
                {...props}
                key={option}
                sx={{
                  backgroundColor: 'white !important',
                  color: '#000',
                  display: 'flex',
                  padding: '8px',
                  fontWeight: 'normal',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#3457D5 !important',
                    color: '#fff !important',
                  },
                }}
              >
                {option}
              </MenuItem>
            )}
          />
        );
      }}
    </Field>
  );
};

export default MultiSelect;
