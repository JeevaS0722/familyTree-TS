/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { ReactElement, useEffect } from 'react';
import {
  DesktopDatePicker,
  DesktopDatePickerProps,
} from '@mui/x-date-pickers/DesktopDatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import moment from 'moment';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ClearIcon from '@mui/icons-material/Clear';
import createTheme from '@mui/material/styles/createTheme';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { useField } from 'formik';
import Tooltip from '@mui/material/Tooltip';
import { Box } from '@mui/material';
import { ErrorText } from './common/CommonStyle';
import { formatDateToMonthDayYear } from '../utils/GeneralUtil';

interface CustomDatePickerProps extends DesktopDatePickerProps<moment.Moment> {
  id?: string;
  type?: string;
  value?: moment.Moment | null;
  name: string;
  outPutFormat?: string;
  width?: string;
  style?: {
    demo: {
      sx: object;
    };
  };
  error?: boolean;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * CustomDatePicker component.
 * @param {CustomDatePickerProps} props - The props for the CustomDatePicker component.
 * @returns {ReactElement} The rendered CustomDatePicker component.
 */
const CustomDatePicker = (props: CustomDatePickerProps): ReactElement => {
  const theme = createTheme({
    palette: {
      mode: 'light', // Switch to light mode
    },
    components: {
      MuiFormControl: {
        styleOverrides: {
          root: {
            width: '100%',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            width: '100%',
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: 'rgba(10, 116, 221, 0.2)', // Hover color for calendar dates
            },
          },
        },
      },
    },
  });
  const [focused, setFocused] = React.useState(false);
  const [open, setOpen] = React.useState(props.open || false);
  const [field, , { setValue }] = useField(props.name);
  const [initValue, setInitValue] = React.useState(field?.value || null);
  useEffect(() => {
    if (field?.value === '0000-00-00') {
      void setValue(null);
      setInitValue(null);
    } else {
      setInitValue(field?.value || null);
    }
  }, [field?.value, setValue]);

  async function onChange(val: moment.Moment | null) {
    if (!val) {
      await setValue(null);
      return;
    } else {
      await setValue(moment(val).format('YYYY-MM-DD'));
      return;
    }
  }
  const parseDateValue = (
    date: string | null | undefined
  ): moment.Moment | null => {
    if (!date || date === '0000-00-00' || date === '0000/00/00') {
      return null;
    }
    return moment(date);
  };
  const isDateValid = (date: string | null | undefined): boolean => {
    if (date === '0000-00-00') {
      return false;
    }
    const momentDate = moment(date, ['YYYY-MM-DD', 'MM/DD/YYYY'], true);
    return momentDate.isValid() && momentDate.year() > 0;
  };
  return (
    <Box>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DemoContainer
            components={['DesktopDatePicker']}
            sx={{
              overflow: 'hidden !important',
              ...(props.style?.demo?.sx || {}),
            }}
          >
            <DesktopDatePicker
              {...props}
              // Removed {...field} to prevent overriding internal handlers
              open={open}
              onClose={() => {
                setOpen(false);
              }}
              value={parseDateValue(field?.value)}
              onChange={val => onChange(val)}
              format={props.format || 'MM/DD/YYYY'}
              sx={{
                '& .MuiPickersDay-root:hover': {
                  backgroundColor: 'rgba(10, 116, 221, 0.2)', // Hover color for calendar dates
                },
              }}
              slotProps={{
                textField: {
                  // Set name and id on the TextField
                  name: props.name,
                  id: props.id || props.name,
                  onFocus: event => {
                    setFocused(true);
                    if (props.onFocus) {
                      props.onFocus(
                        event as React.FocusEvent<HTMLInputElement>
                      );
                    }
                  },
                  error: props.error || false,
                  onBlur: event => {
                    setFocused(false);
                    field.onBlur(event); // Call Formik's onBlur
                    if (props.onBlur) {
                      props.onBlur(event as React.FocusEvent<HTMLInputElement>);
                    }
                  },
                  fullWidth: true,
                  sx: {
                    width: {
                      xs: '100%',
                      sm: '100%',
                      md: props.width,
                    },
                    backgroundColor: focused ? 'white' : '#434857',
                    borderRadius: '0.25rem',
                    '& .MuiInputBase-input': {
                      padding: '0.5rem 0.75rem',
                      color: focused ? '#555' : '#FFF',
                      width: '100%',
                    },
                    '& .MuiFormControl-root': {
                      width: '100%',
                    },
                    '& .MuiIconButton-root.Mui-focusVisible': {
                      backgroundColor: 'rgba(10, 116, 221, 0.5)',
                      color: '#fff',
                    },
                  },
                  InputProps: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {field.value && (
                          <IconButton
                            tabIndex={-1}
                            aria-label="clear date"
                            onClick={() => onChange(null)}
                          >
                            <Tooltip title="Clear Date">
                              <ClearIcon
                                sx={{ color: focused ? '#555' : '#FFF' }}
                              />
                            </Tooltip>
                          </IconButton>
                        )}
                        <IconButton
                          tabIndex={-1}
                          onClick={() => setOpen(!open)}
                        >
                          <Tooltip title="Select Date">
                            <CalendarTodayIcon
                              sx={{ color: focused ? '#555' : '#FFF' }}
                            />
                          </Tooltip>
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                },
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
      </ThemeProvider>
      {initValue && initValue === field.value && !isDateValid(initValue) && (
        <ErrorText>
          {field.value === 'Invalid date'
            ? 'The provided date is invalid.'
            : `${formatDateToMonthDayYear(field.value)} is not a valid date.`}
        </ErrorText>
      )}
    </Box>
  );
};

export default CustomDatePicker;
