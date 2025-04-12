/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import TextField from '@mui/material/TextField';
import { TextFieldProps } from '@mui/material';
import { FieldProps, useField } from 'formik';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';
import StyledInputField from './common/CommonStyle';

interface CustomDatePickerProps {
  name: string;
  type: string;
}

export const CustomDatePicker: React.FC<
  CustomDatePickerProps & TextFieldProps
> = ({ name, ...rest }) => {
  const [field] = useField(name);
  return (
    <TextField
      {...field}
      {...rest}
      sx={{
        width: { xs: '100%', sm: '100%', md: '30%' },
        backgroundColor: '#434857',
        borderRadius: '0.25rem',
        '&:focus-within': {
          backgroundColor: 'white',
          '& .MuiInputBase-input': {
            color: '#555',
          },
          '& input[type="date"]::-webkit-calendar-picker-indicator': {
            filter: 'invert(1)',
          },
        },
        '& .MuiInputBase-input': {
          padding: '0.5rem 0.75rem',
          color: '#fff',
        },
        '& input[type="date"]::-webkit-calendar-picker-indicator': {
          filter: 'invert(1)',
        },
      }}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
};

interface StyledPhoneFieldProps {
  length: number;
  innerRef?: React.RefObject<HTMLInputElement>;
  nextFieldRef?: React.RefObject<HTMLInputElement>;
  name?: string;
}
export const StyledPhoneField: React.FC<StyledPhoneFieldProps & FieldProps> = ({
  length,
  innerRef,
  nextFieldRef,
  name,
  ...props
}) => {
  const [field] = useField(name || '');
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = event.target.value;
    if (currentValue.length <= length) {
      field.onChange(event);
      if (
        currentValue.length === length &&
        nextFieldRef &&
        nextFieldRef.current
      ) {
        nextFieldRef.current.focus();
      }
    }
  };
  return (
    <TextField
      type="tel"
      {...field}
      inputProps={{
        maxLength: length,
        id: `${name}` || 'phone',
        sx: {
          backgroundColor: '#434857',
          borderRadius: '0.25rem',
          maxHeight: '10px',
          color: 'white',
          '&:focus-within': {
            backgroundColor: 'white',
            color: '#555',
          },
          '& .MuiInputBase-input': {
            padding: '0.5rem 0.75rem',
            fontSize: '0.9rem',
            '@media (max-width: 960px)': {
              fontSize: '1rem !important',
            },
          },
        },
      }}
      {...props}
      inputRef={innerRef}
      onChange={handleInputChange}
    />
  );
};

interface CustomTextAreaProps extends FieldProps {
  xsWidth?: string;
  mdWidth?: string;
  rows?: number;
  placeholder?: string;
  maxRows?: number;
}

export const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  field,
  xsWidth,
  mdWidth,
  rows,
  placeholder = '',
  ...props
}) => {
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [hasFocus, setHasFocus] = React.useState(false);

  React.useEffect(() => {
    if (textAreaRef.current) {
      adjustHeight(textAreaRef.current);
    }
  }, [field.value]);

  const adjustHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textAreaRef.current) {
      adjustHeight(textAreaRef.current);
    }
  };

  const handleFocus = () => {
    setHasFocus(true);
  };

  const handleBlur = () => {
    setHasFocus(false);
  };

  return (
    <StyledInputField
      {...field}
      {...props}
      sx={{
        width: { xs: xsWidth, md: mdWidth },
        '& .MuiInputBase-input': {
          color: hasFocus ? '#000 !important' : '#fff !important',
        },
      }}
      InputProps={{
        inputRef: textAreaRef,
        rows: rows,
        placeholder,
        multiline: true,
        inputComponent: 'textarea',
        onFocus: handleFocus,
        onBlur: handleBlur,
        sx: {
          '& .MuiInputBase-input': {
            padding: '0',
            resize: 'none',
          },
        },
        onInput: (event: React.FormEvent<HTMLDivElement>) => {
          // Explicitly cast event to a ChangeEvent for textarea
          handleInput(
            event as unknown as React.ChangeEvent<HTMLTextAreaElement>
          );
        },
      }}
    />
  );
};

interface SelectFieldPropsForType {
  label: string;
  options: {
    letterID: number;
    typeID: number;
    offerTypes: string;
    letterType: string;
  }[];
}

export const SelectFieldForOfferAndLetterType: React.FC<
  SelectFieldPropsForType & FieldProps
> = ({ field, options, ...props }) => {
  return (
    <TextField
      {...field}
      select
      sx={{
        borderRadius: '4px',
      }}
      SelectProps={{
        native: true,
        IconComponent: props => (
          <ArrowDropDownIcon sx={{ color: '#fff !important' }} {...props} />
        ),
        sx: {
          // height: '43px',
          borderRadius: '4px',
          '&:focus-within': {
            backgroundColor: 'white',
            '& .MuiInputBase-input': {
              color: '#555',
            },
          },
          '& .MuiInputBase-input': {
            padding: '0.5rem 0.75rem',
            fontSize: '0.9rem',
            color: '#fff',
          },
        },
      }}
      id="outlined-select-currency-native"
      {...props}
    >
      <option value=""></option>
      {Array.isArray(options) &&
        options.map(option => (
          <option
            key={option?.letterID || option?.typeID}
            value={option?.letterID || option?.typeID}
            id={option?.letterType || option?.offerTypes}
          >
            {option?.letterType || option?.offerTypes}
          </option>
        ))}
    </TextField>
  );
};

interface SelectTitleFailedReasonPropsForType {
  label: string;
  options: {
    reason: string;
  }[];
}

export const SelectTitleFailedReason: React.FC<
  SelectTitleFailedReasonPropsForType & FieldProps
> = ({ field, options, ...props }) => {
  return (
    <TextField
      {...field}
      select
      sx={{
        borderRadius: '4px',
      }}
      SelectProps={{
        native: true,
        IconComponent: props => (
          <ArrowDropDownIcon sx={{ color: '#fff !important' }} {...props} />
        ),
        sx: {
          // height: '43px',
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
        },
      }}
      id="outlined-select-currency-native"
      {...props}
    >
      <option value=""></option>
      {Array.isArray(options) &&
        options.map(option => (
          <option
            key={option?.reason}
            value={option?.reason}
            id={option?.reason}
          >
            {option?.reason}
          </option>
        ))}
    </TextField>
  );
};

export const SingleLineTextArea: React.FC<CustomTextAreaProps> = ({
  field,
  xsWidth,
  mdWidth,
  rows,
  maxRows,
  placeholder = '',
  ...props
}) => {
  const [hasFocus, setHasFocus] = React.useState(false);

  const handleFocus = () => setHasFocus(true);
  const handleBlur = () => setHasFocus(false);

  return (
    <StyledInputField
      {...field}
      {...props}
      multiline
      rows={rows}
      maxRows={maxRows}
      placeholder={placeholder}
      sx={{
        width: { xs: xsWidth, md: mdWidth },
        '& .MuiInputBase-input': {
          color: hasFocus ? '#000 !important' : '#fff !important',
        },
        '& .MuiInputBase-root': {
          padding: '0.5rem 0.75rem',
          fontSize: '0.9rem',
        },
      }}
      InputProps={{
        onFocus: handleFocus,
        onBlur: handleBlur,
        sx: {
          '& .MuiInputBase-input': {
            padding: '0',
            resize: 'none',
          },
        },
      }}
    />
  );
};
