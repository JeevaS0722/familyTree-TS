import * as React from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ClearIcon from '@mui/icons-material/Clear';
import moment, { Moment } from 'moment';
import { ICellEditorParams } from 'ag-grid-community';
import { InputAdornment, IconButton } from '@mui/material';

interface CustomDateCellEditorProps extends ICellEditorParams {
  value: string;
  style?: {
    inputProps?: {
      xs?: string;
    };
  };
}

const CustomDateCellEditor: React.FC<CustomDateCellEditorProps> = props => {
  const [value, setValue] = React.useState<Moment | null>(
    props.value ? moment(props.value, 'MM/DD/YYYY') : null
  );
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  const commitValue = () => {
    if (value && value.isValid()) {
      props.node.setDataValue(
        props.column.getColId(),
        value.format('MM/DD/YYYY')
      );
    }
  };

  const handleChange = (newValue: Moment | null) => {
    setValue(newValue);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    commitValue();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setValue(null);
    props.api.stopEditing();
    props.node.setDataValue(props.column.getColId(), null);
  };

  const handleCalendarIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(prev => !prev);
  };

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          open={open}
          onOpen={handleOpen}
          onClose={handleClose}
          value={value}
          onChange={handleChange}
          format="MM/DD/YYYY"
          slots={{
            openPickerIcon: CalendarTodayIcon,
          }}
          slotProps={{
            textField: {
              inputRef: inputRef,
              onBlur: () => {
                if (!open) {
                  props.api.stopEditing();
                  commitValue();
                }
              },
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    {value && (
                      <IconButton
                        onClick={handleClear}
                        onMouseDown={e => e.preventDefault()}
                        size="small"
                        sx={{ padding: '4px' }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={handleCalendarIconClick}
                      onMouseDown={e => e.preventDefault()}
                      size="small"
                      sx={{ padding: '4px' }}
                    >
                      <CalendarTodayIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  width: {
                    xs: props?.style?.inputProps?.xs || '100%',
                  },
                  backgroundColor: '#434857',
                  borderRadius: '0.25rem',
                  '&:focus-within': {
                    backgroundColor: 'white',
                    '& .MuiInputBase-input': {
                      color: '#555',
                    },
                  },
                  '& .MuiInputBase-input': {
                    padding: '0.5rem 0.75rem',
                    color: '#fff',
                    width: '100%',
                  },
                },
              },
            },
            day: {
              sx: {
                '&:hover': {
                  backgroundColor: 'rgba(10, 116, 221, 0.2)',
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default CustomDateCellEditor;
