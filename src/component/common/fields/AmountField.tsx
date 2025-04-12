/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { useField, useFormikContext } from 'formik';
import { InputAdornment, TextFieldProps, Box } from '@mui/material';
import { ErrorText, StyledInputField } from '../CommonStyle';

type AmountFieldProps = TextFieldProps & {
  name: string;
  label?: string;
  id?: string;
  errId?: string;
  isInteger?: boolean;
  isRequired?: boolean; // New prop
  formatAmount?: boolean;
  length?: number; // For integer fields: maximum number of digits
  precision?: number; // For decimal fields: total number of digits
  scale?: number; // For decimal fields: decimal places (0 for unlimited)
  boxProps?: object;
  startAdornment?: React.ReactNode;
};

interface FormValues {
  [key: string]: any; // Replace 'any' with specific types if known
}

// Helper functions
const countDigitsBeforeCursor = (value: string, cursorPos: number): number => {
  let count = 0;
  for (let i = 0; i < cursorPos; i++) {
    if (/\d/.test(value[i])) {
      count++;
    }
  }
  return count;
};

const findCursorPosition = (
  formattedValue: string,
  digitsBefore: number
): number => {
  let count = 0;
  for (let i = 0; i < formattedValue.length; i++) {
    if (/\d/.test(formattedValue[i])) {
      count++;
    }
    if (count >= digitsBefore) {
      let cursorPos = i + 1;
      // If the next character is a dot, move cursor after it
      if (formattedValue[cursorPos] === '.') {
        cursorPos += 1;
      }
      return cursorPos;
    }
  }
  return formattedValue.length;
};

const AmountField: React.FC<AmountFieldProps> = ({
  name,
  label,
  id,
  errId,
  isInteger = false,
  isRequired = false, // Default to false
  formatAmount = false,
  length = 10,
  precision = 17,
  scale = 2,
  boxProps = {},
  startAdornment,
  ...props
}) => {
  // Validation function defined within the component
  const validateAmount = (value: string | number): string | undefined => {
    const fieldName = label || name;
    const amtValue = value ? value.toString() : '';
    if (isRequired && (!amtValue || amtValue.trim() === '')) {
      return `${fieldName} is required`;
    }
    if (!isRequired && (!amtValue || amtValue.trim() === '')) {
      // Not required and value is empty
      return undefined;
    }

    // Remove commas
    const cleanedValue = amtValue.replace(/,/g, '');

    if (isInteger) {
      // Check that value contains only digits
      const integerRegex = /^\d+$/;
      if (!integerRegex.test(cleanedValue)) {
        return `Please enter a valid ${fieldName}`;
      }

      // Check length
      if (cleanedValue.length > length) {
        return `${fieldName} must be less than or equal to ${length} digits`;
      }
    } else {
      // Not integer, check decimal
      // First, check that value contains only digits and at most one dot
      const decimalRegex = /^\d+(\.\d+)?$/;
      if (!decimalRegex.test(cleanedValue)) {
        return `Please enter a valid ${fieldName}`;
      }

      // Split integer and decimal parts
      const [integerPart = '', decimalPart = ''] = cleanedValue.split('.');
      if (!scale && integerPart.length > precision) {
        return `The ${fieldName} should have a maximum of ${precision - scale} digits before the decimal`;
      }
      if (integerPart.length > precision - scale) {
        return `The ${fieldName} should have a maximum of ${precision - scale} digits before the decimal and up to ${scale} digits after the decimal`;
      }
      if (scale && decimalPart.length > scale) {
        return `The ${fieldName} should have a maximum of ${scale} digits after the decimal point`;
      }
    }

    // Try to parse numeric value
    const numericValue = parseFloat(cleanedValue);
    if (isNaN(numericValue)) {
      return `Please enter a valid ${fieldName}`;
    }

    return undefined; // No error
  };

  const [field, meta, helpers] = useField<string>({
    name,
    validate: validateAmount,
  });
  const form = useFormikContext<FormValues>();
  const [displayValue, setDisplayValue] = useState<string>('');

  // Reference to the input element for cursor management
  const inputRef = useRef<HTMLInputElement>(null);

  // Reference to store the desired cursor position
  const cursorRef = useRef<number | null>(null);

  // Previous error value to prevent multiple scrolls
  const prevErrorRef = useRef<string | undefined>(undefined);

  // Handle input changes
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    // Capture the current cursor position
    const selectionStart = input.selectionStart || 0;

    let value = event?.target?.value || '';
    value = value.toString();
    // Sanitize the input
    value = sanitizeValue(value);

    // Remove existing commas
    value = value.replace(/,/g, '');

    // Enforce single decimal point for decimals
    if (!isInteger && (value.match(/\./g) || []).length > 1) {
      value = value.replace(/\.+$/, '');
    }

    // Split integer and decimal parts
    const [integerPart = '', decimalPart = ''] = value.split('.');

    if (isInteger) {
      // Enforce maximum length
      let newIntegerPart = integerPart.slice(0, length);

      // Remove leading zeros
      newIntegerPart = newIntegerPart.replace(/^0+(?!$)/, '');

      value = newIntegerPart;

      // Enforce maximum value
      const numericValue = parseInt(value || '0', 10);
      const maxValue = getMaxValue();
      if (numericValue > maxValue) {
        value = maxValue.toString();
      }
    } else {
      // Enforce precision and scale
      const integerDigits = precision - scale;

      // Enforce maximum digits before decimal
      let newIntegerPart = integerPart.slice(0, integerDigits);

      // Remove leading zeros in integer part
      newIntegerPart = newIntegerPart.replace(/^0+(?!$)/, '');

      // Enforce maximum digits after decimal
      let newDecimalPart = decimalPart || '';
      if (scale > 0 && decimalPart !== undefined) {
        // Enforce scale limit
        newDecimalPart = decimalPart.slice(0, scale);
      }
      // Reconstruction logic
      if (value.endsWith('.')) {
        // Preserve the dot if the input ends with it
        value = `${newIntegerPart}.`;
      } else if (decimalPart !== undefined && decimalPart !== '') {
        // Reconstruct value with decimal part if it exists
        value = `${newIntegerPart}.${newDecimalPart}`;
      } else {
        // Use only the integer part
        value = newIntegerPart;
      }

      // Enforce maximum value if scale > 0
      if (scale > 0 && decimalPart !== undefined && decimalPart !== '') {
        const numericValue = parseFloat(value || '0');
        const maxValue = getMaxValue();
        if (numericValue > maxValue) {
          value = maxValue.toString();
        }
      }
    }

    // Format the value with commas if required
    const formattedValue = formatAmount ? formatValue(value) : value;

    // Count the number of digits before the original cursor position
    const digitsBeforeCursor = countDigitsBeforeCursor(
      event.target.value,
      selectionStart
    );

    // Determine the new cursor position based on digits before cursor
    let newCursorPosition = findCursorPosition(
      formattedValue,
      digitsBeforeCursor
    );

    // Handle special case when the value ends with a dot
    if (formattedValue.endsWith('.')) {
      newCursorPosition = formattedValue.length;
    }

    // Update the display value
    setDisplayValue(formattedValue);

    // Update Formik state with the unformatted value
    void helpers.setValue(value.replace(/,/g, ''));

    // Optionally, reset the error state upon change
    if (meta.error) {
      helpers.setError(undefined);
    }

    // Store the new cursor position to set it later
    cursorRef.current = newCursorPosition;
  };

  // Function to format the value with commas
  const formatValue = (value: string | number): string => {
    const amtValue = value ? value.toString() : '';
    if (!amtValue) {
      return amtValue;
    }
    const parts = amtValue.split('.');
    // Remove existing commas
    parts[0] = parts[0].replace(/,/g, '');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const sanitizeValue = (value: string): string => {
    const regex = isInteger ? /[^0-9]/g : /[^0-9.]/g;
    // Remove invalid characters
    value = value.replace(regex, '');
    // Remove commas
    return value.replace(/,/g, '');
  };

  // Function to get maximum allowed value
  const getMaxValue = (): number => {
    if (isInteger) {
      const maxValueStr = '9'.repeat(length);
      return parseInt(maxValueStr, 10);
    } else {
      const integerDigits = precision - scale;
      const maxIntegerPart = '9'.repeat(integerDigits);
      const maxDecimalPart = scale > 0 ? '9'.repeat(scale) : '';
      const maxValueStr =
        scale > 0 ? `${maxIntegerPart}.${maxDecimalPart}` : `${maxIntegerPart}`;
      return parseFloat(maxValueStr);
    }
  };

  // Synchronize display value with Formik value
  useEffect(() => {
    let value = field.value || '';
    if (formatAmount && !form.isSubmitting) {
      value = formatValue(value);
    }
    setDisplayValue(value);
  }, [field.value, formatAmount, form.isSubmitting]);

  // Auto-scroll to the field when there is an error
  useEffect(() => {
    if (meta.error && meta.error !== prevErrorRef.current && inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Optionally, focus the input
      inputRef.current.focus();
    }
    prevErrorRef.current = meta.error;
  }, [meta.error]);

  // Set the cursor position after displayValue updates
  useEffect(() => {
    if (inputRef.current && cursorRef.current !== null) {
      inputRef.current.setSelectionRange(cursorRef.current, cursorRef.current);
      cursorRef.current = null; // Reset the ref after setting the cursor
    }
  }, [displayValue]);

  const showError = meta.touched && Boolean(meta.error);

  return (
    <Box {...boxProps}>
      <StyledInputField
        {...field}
        {...props}
        id={id || name}
        type="text"
        value={displayValue}
        onChange={handleChange}
        error={showError}
        InputProps={{
          inputRef: inputRef, // Attach the ref here
          startAdornment: startAdornment ? (
            <InputAdornment
              position="start"
              disableTypography
              sx={{ color: '#ccc' }}
            >
              {startAdornment}
            </InputAdornment>
          ) : undefined,
          ...props.InputProps,
        }}
        inputProps={{
          ...props.inputProps,
        }}
      />
      {showError && (
        <Box sx={{ color: 'red', fontSize: '0.875rem', mt: '4px' }}>
          <ErrorText id={errId || `error-${id || name}`}>
            {meta.error}
          </ErrorText>
        </Box>
      )}
    </Box>
  );
};

export default AmountField;
