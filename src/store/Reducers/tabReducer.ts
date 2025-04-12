import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TabInterface } from '../../interface/tab';

const initialState: TabInterface = {
  tabName: 'contact',
};

export const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    setTabName: (state, action: PayloadAction<TabInterface>) => {
      state.tabName = action.payload.tabName;
    },
    clearTabName: state => {
      state.tabName = 'contact';
    },
  },
});

export const { setTabName, clearTabName } = tabSlice.actions;

export default tabSlice.reducer;
