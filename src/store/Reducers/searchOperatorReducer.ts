import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SearchOperatorParams } from '../../interface/searchOperator';

const initialState: SearchOperatorParams = {
  name: '',
  pageNo: 1,
  size: 100,
  order: 'asc',
  orderBy: 'contactName',
};

export const searchOperatorSlice = createSlice({
  name: 'searchOperator',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<SearchOperatorParams>) => {
      state.name = action.payload.name;
      state.pageNo = action.payload.pageNo || 1;
      state.size = action.payload.size || 100;
      state.order = action.payload.order || 'asc';
      state.orderBy = action.payload.orderBy || 'contactName';
    },
  },
});

export const { setName } = searchOperatorSlice.actions;

export default searchOperatorSlice.reducer;
