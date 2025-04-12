import React, { useEffect, useRef, useState } from 'react';
import { Field, FieldProps } from 'formik';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useLazyGetAllOperatorQuery } from '../../../store/Services/operatorService';
import Paper, { PaperProps } from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import useDebounce from '../../../hooks/useDebounce';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import { Link as RouterLink } from 'react-router-dom';
import { phoneFormat } from '../../../utils/GeneralUtil';
import { StyledGridItem, StyledInputLabel } from '../CommonStyle';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { CompanyAddress } from '../../../interface/division';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

interface CompanyDropdownProps {
  label?: string;
  placeholder?: string;
  sx?: object;
  name: string;
  companyName?: string;
  showCompanyAddress?: boolean;
  operId?: string | null | number | undefined;
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

const CompanyDropdown: React.FC<CompanyDropdownProps> = ({
  label,
  placeholder = 'Search Company Name',
  sx,
  name,
  companyName,
  showCompanyAddress,
  operId,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(companyName || '');
  const debouncedInputValue = useDebounce(inputValue, 500);
  const [pageNo, setPage] = useState(1);
  const [options, setOptions] = useState<
    {
      label: string;
      value: number;
      phone: string;
      email: string;
      address: string;
      city: string;
      state: string;
      zip: string;
    }[]
  >([]);
  const { t } = useTranslation('division');
  const [hasMore, setHasMore] = useState(true);
  const [triggerGetOperators, { data, isLoading, isFetching }] =
    useLazyGetAllOperatorQuery();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [companyAddress, setCompanyAddress] = useState<CompanyAddress>({
    phone: '',
    email: '',
    address: '',
    name: '',
    state: '',
    city: '',
    zip: '',
  });
  useEffect(() => {
    if (companyName) {
      setInputValue(companyName);
    }
  }, [companyName]);

  useEffect(() => {
    void triggerGetOperators({
      searchText: debouncedInputValue,
      pageNo,
      size: 25,
    });
  }, [debouncedInputValue, pageNo, triggerGetOperators]);

  const handleSearchIconClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setOpen(!open);
    }
  };

  useEffect(() => {
    if (data?.data) {
      const newOptions = data.data.map(operator => ({
        label: `${operator?.companyName || ''} - ${operator?.contactName || ''}`,
        value: operator.operatorID,
        phone: operator?.phoneNumber,
        email: operator?.email,
        address: operator?.address,
        city: operator?.city,
        state: operator?.state,
        zip: operator?.zip,
      }));

      if (pageNo === 1) {
        setOptions([]);
      }
      setOptions(prevOptions => {
        const existingIds = new Set(prevOptions.map(option => option.value));
        const filteredNewOptions = newOptions.filter(
          option => !existingIds.has(option.value)
        );
        return [...prevOptions, ...filteredNewOptions];
      });
      if (newOptions.length < 25) {
        setHasMore(false);
      }
      const selectedOption = newOptions.find(opt => opt.value === operId);
      if (selectedOption && inputValue === companyName) {
        setCompanyAddress({
          phone: selectedOption.phone || '',
          email: selectedOption.email || '',
          address: selectedOption.address || '',
          name: selectedOption.value || '',
          city: selectedOption.city || '',
          state: selectedOption.state || '',
          zip: selectedOption.zip || '',
        });
      }
    }
  }, [data]);

  const handleScroll = (event: React.SyntheticEvent) => {
    const listboxNode = event.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = listboxNode;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      if (hasMore && !isLoading) {
        setPage(prevPage => prevPage + 1);
      }
    }
  };
  const [showDetails, setShowDetails] = React.useState(false);

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <>
      <Field name={name}>
        {({ field, form }: FieldProps<string>) => (
          <Autocomplete
            id={name}
            options={options}
            PaperComponent={CustomPaper}
            loading={isLoading}
            value={
              options.find(
                option => Number(option.value) === Number(field.value)
              ) || null
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
              void form.setFieldValue(name, newValue?.value || '');
              if (newValue) {
                setCompanyAddress({
                  phone: newValue?.phone || '',
                  email: newValue?.email || '',
                  address: newValue?.address || '',
                  name: newValue?.value || '',
                  city: newValue?.city || '',
                  state: newValue?.state || '',
                  zip: newValue?.zip || '',
                });
              } else {
                setCompanyAddress({
                  phone: '',
                  email: '',
                  address: '',
                  name: '',
                  city: '',
                  state: '',
                  zip: '',
                });
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
                  endAdornment: (
                    <>
                      {!inputValue && !field.value && !isFetching ? (
                        <InputAdornment position="end">
                          <SearchIcon
                            sx={{
                              color: '#fff',
                              marginRight: '35px',
                              cursor: 'pointer',
                            }}
                            onClick={handleSearchIconClick}
                          />
                        </InputAdornment>
                      ) : (
                        ''
                      )}
                      {isFetching && open && !field.value && (
                        <InputAdornment position="start">
                          <CircularProgress
                            size={24}
                            sx={{
                              color: 'black',
                              marginRight: '30px',
                            }}
                          />
                        </InputAdornment>
                      )}
                      {params.InputProps.endAdornment}
                    </>
                  ),
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
                placeholder={isLoading ? 'Fetching data...' : placeholder}
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
      {showCompanyAddress && companyAddress?.name && (
        <>
          <StyledGridItem item md={2} xl={1} xs={1}></StyledGridItem>
          <Grid item xs={12} md={10} xl={11}>
            <Typography
              component="a"
              sx={{
                color: '#1997C6',
                cursor: 'pointer',
                fontSize: '0.9rem',
                textDecoration: 'none',
                '&:hover': {
                  color: '#1997C6',
                  textDecoration: 'none  !important',
                },
              }}
              onClick={handleToggleDetails}
            >
              {showDetails ? t('hideAddress') : t('showAddress')}
            </Typography>

            {/* Collapsible details */}
            <Collapse in={showDetails}>
              <Box sx={{ my: 1, color: '#90A4AE' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ fontSize: '1.2rem' }} />
                  <StyledInputLabel sx={{ color: '#90A4AE', pl: 2 }}>
                    {companyAddress?.phone
                      ? phoneFormat(companyAddress?.phone ?? '')
                      : '-'}
                  </StyledInputLabel>
                </Box>
                <Box sx={{ display: 'flex', mt: 1, alignItems: 'center' }}>
                  <EmailIcon sx={{ fontSize: '1.2rem' }} />
                  <StyledInputLabel sx={{ paddingLeft: 2 }}>
                    {' '}
                    <RouterLink
                      to={
                        companyAddress?.email
                          ? `mailto:${companyAddress?.email}`
                          : ''
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#90A4AE',
                        textDecoration: 'none',
                      }}
                    >
                      {companyAddress?.email?.toString() || '-'}
                    </RouterLink>
                  </StyledInputLabel>
                </Box>
                <Box sx={{ display: 'flex', mt: 1, alignItems: 'center' }}>
                  <HomeIcon sx={{ fontSize: '1.2rem' }} />
                  <StyledInputLabel sx={{ color: '#90A4AE', pl: 2 }}>
                    {' '}
                    {companyAddress?.address || '-'}
                  </StyledInputLabel>
                </Box>
                <Box sx={{ display: 'flex', mt: 1, alignItems: 'center' }}>
                  <LocationOnIcon sx={{ fontSize: '1.2rem' }} />
                  <StyledInputLabel sx={{ color: '#90A4AE', pl: 2 }}>
                    {companyAddress?.city || companyAddress?.state
                      ? [companyAddress?.city, companyAddress?.state]
                          .filter(Boolean)
                          .join(', ') +
                        (companyAddress?.zip ? ` - ${companyAddress.zip}` : '')
                      : companyAddress?.zip || '-'}
                  </StyledInputLabel>
                </Box>
              </Box>
            </Collapse>
          </Grid>
        </>
      )}
    </>
  );
};

export default CompanyDropdown;
