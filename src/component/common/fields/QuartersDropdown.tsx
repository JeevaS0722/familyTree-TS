import React, { useEffect, useRef, useState } from 'react';
import { Field, FieldProps } from 'formik';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Paper, { PaperProps } from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import useDebounce from '../../../hooks/useDebounce';
import CircularProgress from '@mui/material/CircularProgress';
import { useLazyGetAllQuartersQuery } from '../../../store/Services/wellMasterService';
import { GetAllQuarters } from '../../../interface/wellMaster';

interface QuartersDropdownProps {
  label?: string;
  placeholder?: string;
  sx?: object;
  name: string;
  quarters?: string;
  wellId?: number | null | string;
  deedId?: number | null;
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

const QuartersDropdown: React.FC<QuartersDropdownProps> = ({
  label,
  placeholder = 'Search quarters',
  sx,
  name,
  quarters,
  wellId,
  deedId,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(quarters || '');
  const debouncedInputValue = useDebounce(inputValue, 500);
  const [pageNo, setPage] = useState(1);
  const [options, setOptions] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [hasMore, setHasMore] = useState(true);
  const [triggerGetQuarters, { data, isLoading, isFetching }] =
    useLazyGetAllQuartersQuery();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!quarters) {
      setInputValue('');
      setOptions([]);
    } else {
      setInputValue(quarters);
    }
  }, [quarters]);

  useEffect(() => {
    const requestParams: GetAllQuarters = {
      searchText: debouncedInputValue,
      pageNo,
      size: 25,
    };

    if (deedId) {
      requestParams.deedId = deedId;
    } else if (wellId) {
      requestParams.wellId = wellId;
    }
    void triggerGetQuarters(requestParams);
  }, [debouncedInputValue, pageNo, triggerGetQuarters]);

  useEffect(() => {
    if (data?.data) {
      const newOptions = data.data
        .filter((item: { quarters: string }) => item.quarters?.trim() !== '') // Remove empty values
        .map((item: { quarters: string }) => ({
          label: item.quarters,
          value: item.quarters,
        }));

      setOptions(prevOptions => {
        const mergedOptions =
          pageNo === 1 ? newOptions : [...prevOptions, ...newOptions];

        // Ensure uniqueness using a Set
        const uniqueOptions = Array.from(
          new Map(mergedOptions.map(option => [option.value, option])).values()
        );

        return uniqueOptions;
      });

      if (newOptions.length < 25) {
        setHasMore(false);
      }
    }
  }, [data, pageNo]);

  const handleScroll = (event: React.SyntheticEvent) => {
    const listboxNode = event.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = listboxNode;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      if (hasMore && !isLoading) {
        setPage(prevPage => prevPage + 1);
      }
    }
  };

  return (
    <>
      <Field name={name}>
        {({ field, form }: FieldProps<string>) => (
          <Autocomplete
            id={name}
            options={options}
            PaperComponent={CustomPaper}
            disableClearable
            freeSolo
            loading={isLoading}
            value={
              field.value
                ? options.find(option => option.value === field.value) || {
                    label: field.value,
                    value: field.value,
                  }
                : { label: '', value: '' }
            }
            inputValue={inputValue}
            clearOnEscape
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            onInputChange={(event, newInputValue) => {
              setPage(1);
              if (event && event.target) {
                setInputValue(newInputValue);
                setHasMore(true);
              }
            }}
            onChange={(event, newValue) => {
              if (!newValue) {
                setInputValue('');
                void form.setFieldValue(name, '');
              } else if (typeof newValue === 'string') {
                const customOption = { label: newValue, value: newValue };
                setOptions(prevOptions => [...prevOptions, customOption]);
                setInputValue(newValue);
                void form.setFieldValue(name, newValue);
              } else {
                setInputValue(newValue?.value || '');
                void form.setFieldValue(name, newValue?.value || '');
              }
            }}
            onBlur={() => {
              if (!inputValue || inputValue.trim() === '') {
                void form.setFieldValue(name, '');
              } else {
                void form.setFieldValue(name, inputValue);
              }
            }}
            getOptionLabel={option => option.label}
            ListboxProps={{
              onScroll: handleScroll,

              sx: { maxHeight: '300px', overflow: 'auto' },
            }}
            renderOption={(props, option) => <li {...props}>{option.label}</li>}
            renderInput={params => (
              <TextField
                {...params}
                {...props}
                label={label}
                variant="outlined"
                fullWidth
                inputRef={inputRef}
                InputProps={{
                  ...params.InputProps,
                }}
                sx={{
                  width: '100%',
                  backgroundColor: '#434857',
                  borderRadius: '4px',
                  '& .MuiOutlinedInput-root': {
                    paddingRight: '0.5rem',
                  },
                  '& .MuiInputBase-input': {
                    color: '#fff',
                    padding: '0.5rem 0.75rem',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#fff',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#434857',
                  },
                  ...sx,
                }}
              />
            )}
            sx={{
              borderRadius: '4px',
              '& .MuiOutlinedInput-root': {
                padding: '0px !important',
              },
              '& .MuiAutocomplete-clearIndicator': {
                visibility: 'visible',
                color: '#fff',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#434857',
              },
              '&.Mui-focused .MuiOutlinedInput-root': {
                backgroundColor: '#fff !important',
              },
              '&.Mui-focused .MuiInputBase-input': {
                color: '#000 !important',
              },
              '&.Mui-focused .MuiSvgIcon-root': {
                color: '#000 !important',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#fff !important',
              },
              ...sx,
            }}
          />
        )}
      </Field>
    </>
  );
};

export default QuartersDropdown;
