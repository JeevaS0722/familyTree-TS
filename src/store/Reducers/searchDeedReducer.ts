import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DeedsParams } from '../../interface/searchDeed';

const initialState: DeedsParams = {
  searchType: '',
  searchText: '',
  from: '',
  to: '',
  pageNo: 1,
  size: 100,
  order: 'asc',
  orderBy: 'fileName',
};

export const searchDeedSlice = createSlice({
  name: 'searchDeed',
  initialState,
  reducers: {
    setDeedSearch: (state, action: PayloadAction<DeedsParams>) => {
      state.searchType = action.payload.searchType;
      state.searchText = action.payload.searchText;
      state.from = action.payload.from;
      state.to = action.payload.to;
      state.pageNo = action.payload.pageNo || 1;
      state.size = action.payload.size || 100;
      state.order = action.payload.order || 'asc';
      state.orderBy = action.payload.orderBy || 'fileName';
    },
  },
});

export const { setDeedSearch } = searchDeedSlice.actions;

export default searchDeedSlice.reducer;
