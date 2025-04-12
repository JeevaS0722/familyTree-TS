// timezoneSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TimezoneState {
  serverTimezone: string;
}

const initialState: TimezoneState = {
  serverTimezone: '' as string,
};

const timezoneSlice = createSlice({
  name: 'timezone',
  initialState,
  reducers: {
    setServerTimezone(state, action: PayloadAction<string>) {
      state.serverTimezone = action.payload;
    },
  },
});

export const { setServerTimezone } = timezoneSlice.actions;
export default timezoneSlice.reducer;
