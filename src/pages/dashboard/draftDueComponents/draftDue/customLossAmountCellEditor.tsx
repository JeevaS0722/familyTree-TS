import * as React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { ICellEditorParams } from 'ag-grid-community';

interface CustomLossAmountCellEditorProps extends ICellEditorParams {
  value: string | number;
}

const CustomLossAmountCellEditor: React.FC<
  CustomLossAmountCellEditorProps
> = props => {
  const initialValue = props.value
    ? String(props.value).replace(/[^0-9.]/g, '')
    : '';

  const [value, setValue] = React.useState<string>(initialValue);

  const commitValue = (val: string) => {
    const sanitized = val.replace(/[^0-9.]/g, '');
    props.node.setDataValue(props.column.getColId(), sanitized || null);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;

    // Allow only digits and a single dot
    if (!/^\d*\.?\d*$/.test(input)) return;

    const [beforeDecimal, afterDecimal = ''] = input.split('.');

    if (beforeDecimal.length > 19) return; // Limit digits before decimal
    if (afterDecimal.length > 2) return; // Limit digits after decimal

    setValue(input);
  };

  return (
    <TextField
      autoFocus
      value={value}
      onChange={handleInputChange}
      onBlur={() => {
        props.api.stopEditing();
        commitValue(value);
      }}
      fullWidth
      sx={{
        backgroundColor: 'white',
        input: {
          color: 'black',
          height: 'auto',
        },
        '& .MuiInputBase-root': {
          height: '40px',
          boxSizing: 'border-box',
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <span style={{ color: 'black' }}>$</span>
          </InputAdornment>
        ),
      }}
      inputProps={{
        style: {
          paddingLeft: '10px',
        },
      }}
    />
  );
};

export default CustomLossAmountCellEditor;
