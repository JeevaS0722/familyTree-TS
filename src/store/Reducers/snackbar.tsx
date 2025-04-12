import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { severity, snackbar } from '../../interface/snackbar';

const initialState: snackbar = {
  open: false,
  message: '',
  verticalPosition: 'bottom',
  horizonalPosition: 'right',
  severity: severity.info,
  persist: false,
};

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    open: (state, action: PayloadAction<snackbar>) => {
      state.severity = action.payload.severity;
      state.open = true;
      state.message = action.payload.message;
      state.persist = action.payload.persist || false;
    },
    close: state => {
      state.open = false;
    },
  },
});

export const { close, open } = snackbarSlice.actions;

export default snackbarSlice.reducer;
