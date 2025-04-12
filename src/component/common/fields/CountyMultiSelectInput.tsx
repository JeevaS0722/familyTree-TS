import React, { useEffect, useState } from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useLazyGetCountiesQuery } from '../../../store/Services/commonService';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Paper, { PaperProps } from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

interface MultiSelectProps {
  name: string;
  id: string;
  state: string | null | undefined;
  setError: React.Dispatch<React.SetStateAction<string>>;
  maxLength: number;
}
interface CountyOption {
  county: string;
  state: string;
  stateDesc?: string;
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

function getNestedProperty(obj: object, path: string, defaultValue: string) {
  if (!path) {
    return defaultValue;
  }

  const keys = path.split('.');

  // Start with the base object
  let current = obj;

  for (const key of keys) {
    if (current && Object.prototype.hasOwnProperty.call(current, key)) {
      current = current[key] as object;
    } else {
      return defaultValue;
    }
  }

  return current;
}

const CountyMultiSelect: React.FC<MultiSelectProps> = ({
  name,
  id,
  state,
  setError,
}) => {
  const [getCounties, { data, isFetching }] = useLazyGetCountiesQuery();
  const [inputValue, setInputValue] = React.useState<string>('');
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('common');
  const [selectedCounty, setSelectedCounty] = useState<CountyOption[]>([]);

  const options: CountyOption[] = data?.counties
    ? data.counties.map(
        (option: { state: string; county: string; stateDesc: string }) => ({
          county: option.county,
          state: option.state,
          stateDesc: option.stateDesc,
        })
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

  const toggleDropdown = () => {
    setOpen(prev => !prev);
  };
  const { setFieldValue, values } = useFormikContext<{
    [key: string]: string;
  }>();

  const county = getNestedProperty(values, name, 'county');

  useEffect(() => {
    if (state) {
      void getCounties({
        state: state
          .split(',')
          .map((state: string) => state.split('-')[0].trim())
          .join(','),
      });
      setError(''); // Clear error if all values are valid
    } else {
      // void setFieldValue(name, '');
    }
  }, [state]);
  useEffect(() => {
    // Validate existing values when options or state change
    if (
      options.length > 0 &&
      !isFetching &&
      typeof county === 'string' &&
      county.length > 0
    ) {
      const selectedValues = county
        ? county.split(',').map((val: string) => val.trim())
        : [];
      const invalidValues = selectedValues.filter(
        (val: string) => !options.some(option => option.county === val)
      );

      const duplicateCounty = selectedCounty.filter(
        (val: CountyOption) =>
          !options.some(
            option => option.county === val.county && option.state === val.state
          )
      );

      if (invalidValues.length > 0 && state) {
        // setError(`${invalidValues.join(',')} ${t('invalidCounty')}`);
      } else if (duplicateCounty.length > 0 && state) {
        // setError(
        //   `${duplicateCounty.map(cot => cot.county).join(',')} ${t('invalidCounty')}`
        // );
      } else {
        setError(''); // Clear error if all values are valid
      }
    }
  }, [options, values, isFetching]);

  const handleFocus = () => {
    if (!state) {
      setOpen(false);
      setError(t('stateRequired'));
    } else {
      setError('');
    }
  };

  const selectedValues =
    typeof county === 'string' && county.length > 0
      ? county.split(',').map((val: string) => {
          const trimmedVal = val.trim();
          const matchingOption = options.find(option =>
            option.county.startsWith(trimmedVal)
          );
          return matchingOption?.county || trimmedVal;
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
      await setFieldValue(name, newValue.join(', '));
    }
    setError('');
    setInputValue('');
    setOpen(false);
  };

  return (
    <Field name={name}>
      {({ field, form }: FieldProps<string>) => {
        return (
          <>
            <Autocomplete
              open={open}
              onBlur={handleBlur}
              onFocus={handleFocus}
              multiple
              id={id}
              PaperComponent={CustomPaper}
              options={state ? options : []}
              groupBy={option =>
                option.stateDesc
                  ? `${option.state} - ${option.stateDesc}`
                  : option.state
              }
              getOptionLabel={option => option.county}
              isOptionEqualToValue={(option, value) =>
                option.county.trim() === value.county.trim() &&
                option.state.trim() === value.state.trim()
              }
              onChange={async (event, newValue) => {
                const countyNames = newValue.map(option => option.county);
                setSelectedCounty(newValue);
                await form.setFieldValue(name, countyNames.join(','));
                if (!newValue.length) {
                  setError('');
                }
              }}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              value={selectedValues.map(
                countyName =>
                  options.find(option => option.county === countyName) || {
                    county: countyName,
                    state: '',
                  }
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  sx={{
                    ...textFieldStyle,
                    '& .MuiOutlinedInput-root': {
                      display: 'flex',
                      alignItems: 'center',
                      paddingRight: '8px !important',
                      padding: '2px !important',
                    },
                    '& .MuiAutocomplete-inputRoot': {
                      paddingRight: '8px !important',
                    },
                    '& .MuiAutocomplete-input': {
                      minWidth: '100px !important',
                      marginLeft: '8px !important',
                    },
                  }}
                  variant="outlined"
                  placeholder={
                    isFetching
                      ? 'Fetching data...'
                      : field.value
                        ? ''
                        : 'Select counties'
                  }
                  inputProps={{
                    ...params.inputProps,
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
                            onClick={toggleDropdown}
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
                    key={option.county}
                    label={option.county}
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
              renderGroup={params => (
                <div key={params.key}>
                  <Typography
                    sx={{
                      backgroundColor: '#e0e0e0',
                      color: '#4c4c4c',
                      padding: '4px 8px',
                      fontWeight: 'bold',
                    }}
                  >
                    {params.group}
                  </Typography>
                  {params.children}
                </div>
              )}
              renderOption={(props, option) => (
                <MenuItem
                  {...props}
                  key={option.county}
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
                  {option.county}
                </MenuItem>
              )}
            />
          </>
        );
      }}
    </Field>
  );
};

export default CountyMultiSelect;
