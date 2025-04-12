import React, { ReactElement } from 'react';
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
import {
  DateTimePicker,
  DateTimePickerProps,
} from '@mui/x-date-pickers/DateTimePicker';
import Tooltip from '@mui/material/Tooltip';

interface CustomDatePickerProps extends DateTimePickerProps<moment.Moment> {
  id?: string;
  type?: string;
  value?: moment.Moment | null;
  name: string;
  outPutFormat?: string;
  width?: string;
  error?: boolean;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * CustomDateTimePicker component.
 * @param {CustomDatePickerProps} props - The props for the CustomDateTimePicker component.
 * @returns {ReactElement} The rendered CustomDateTimePicker component.
 */
const CustomDateTimePicker = (props: CustomDatePickerProps): ReactElement => {
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
      MuiMultiSectionDigitalClockSection: {
        styleOverrides: {
          item: {
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

  async function onChange(val: moment.Moment | null) {
    await setValue(val);
  }
  // Function to parse date value
  const parseDateValue = (
    date: string | null | undefined
  ): moment.Moment | null => {
    if (!date) {
      return null;
    }
    return moment(date);
  };
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DemoContainer
          components={['DesktopDatePicker', 'DateTimePicker']}
          sx={{ overflow: 'hidden !important' }}
        >
          <DateTimePicker
            {...props}
            // Removed {...field} to prevent overriding internal handlers
            open={open}
            onClose={() => {
              setOpen(false);
            }}
            value={parseDateValue(field?.value)}
            onChange={val => onChange(val)}
            format={'MM/DD/YYYY hh:mm A'}
            slotProps={{
              textField: {
                name: props.name,
                id: props.id || props.name,
                error: props.error || false,
                onFocus: event => {
                  setFocused(true);
                  if (props.onFocus) {
                    props.onFocus(event as React.FocusEvent<HTMLInputElement>);
                  }
                },
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
                      <IconButton tabIndex={-1} onClick={() => setOpen(!open)}>
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
  );
};

export default CustomDateTimePicker;
