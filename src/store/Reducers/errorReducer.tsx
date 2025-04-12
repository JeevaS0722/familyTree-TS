import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: {
  error: boolean;
  message: string;
} = {
  error: false,
  message: '',
};

export const modalSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    open: (
      state,
      action: PayloadAction<{
        open?: boolean;
        message: string;
      }>
    ) => {
      state.error = true;
      state.message = action.payload.message;
    },
    close: state => {
      state.error = false;
    },
  },
});

export const { close, open } = modalSlice.actions;

export default modalSlice.reducer;
