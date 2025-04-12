import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface app {
  version?: string;
}
const initialState: app = {};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setVersion: (state, action: PayloadAction<app>) => {
      state.version = action.payload.version;
    },
    clearVersion: state => {
      state.version = '';
    },
  },
});

export const { setVersion, clearVersion } = appSlice.actions;

export default appSlice.reducer;
