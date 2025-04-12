import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';

interface NumericCellEditorProps {
  value: any;
}

const NumericCellEditor = forwardRef((props: NumericCellEditorProps, ref) => {
  const [value, setValue] = useState<string>(String(props.value || ''));

  useEffect(() => {
    setValue(String(props.value || ''));
  }, [props.value]);
  useImperativeHandle(ref, () => ({
    // Return the value to AG Grid when editing is complete.
    getValue() {
      // if (/^\d+$/.test(value)) {
      //   // Reject the value or return a default value.
      //   return null;
      // }
      return value;
    },
  }));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Replace any character that is not a digit.
    const sanitized = e.target.value.replace(/[^0-9]/g, '');
    setValue(sanitized);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      style={{ width: '100%' }}
      autoFocus
    />
  );
});
NumericCellEditor.displayName = 'NumericCellEditor';
export default NumericCellEditor;
