import React, { ReactElement } from 'react';
import {
  DesktopDatePicker,
  DesktopDatePickerProps,
} from '@mui/x-date-pickers/DesktopDatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import moment from 'moment';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import createTheme from '@mui/material/styles/createTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

interface style {
  inputProps: { xs: string; sm: string };
}

interface CustomDatePickerProps extends DesktopDatePickerProps<moment.Moment> {
  id?: string;
  type?: string;
  value?: moment.Moment | null;
  name: string;
  style: style;
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
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: '#fff',
            '&:focus': {
              color: '#555',
            },
          },
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DemoContainer
          components={['DesktopDatePicker']}
          sx={{ overflow: 'hidden !important' }}
        >
          <DesktopDatePicker
            {...props}
            format={props.format || 'MM/DD/YYYY'}
            slotProps={{
              textField: {
                InputProps: {
                  id: props.id || props.name,
                  fullWidth: true,
                  sx: {
                    width: {
                      xs: props.style.inputProps.xs || '100%',
                      sm: props.style.inputProps.sm || '30%',
                    },
                    backgroundColor: '#434857',
                    borderRadius: '0.25rem',
                    '&:focus-within': {
                      backgroundColor: 'white',
                      '& .MuiInputBase-input': {
                        color: '#555',
                      },
                      '& input[type="date"]::-webkit-calendar-picker-indicator':
                        {
                          filter: 'invert(1)',
                        },
                    },
                    '& .MuiInputBase-input': {
                      padding: '0.5rem 0.75rem',
                      color: '#fff',
                      width: '100%',
                    },
                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
                      filter: 'invert(1)',
                    },
                    '& .MuiFormControl-root': {
                      width: '100%',
                    },
                  },
                },
              },
              openPickerIcon: CalendarTodayIcon,
              day: {
                sx: {
                  '&:hover': {
                    backgroundColor: 'rgba(10, 116, 221, 0.2)',
                  },
                },
              },
            }}
          />
        </DemoContainer>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

CustomDatePicker.defaultProps = {
  style: { inputProps: {} },
};

export default CustomDatePicker;
