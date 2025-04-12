import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value by a specified delay.
 * @param value The value to debounce.
 * @param delay The delay in milliseconds (default is 500ms).
 * @returns The debounced value.
 */
const useDebounce = (value: string, delay: number = 500): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timeout if the value changes before the delay is reached
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
