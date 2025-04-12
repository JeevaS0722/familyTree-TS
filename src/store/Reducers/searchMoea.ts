import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SearchMOEAParams } from '../../interface/searchMoea';

const initialState: SearchMOEAParams = {
  county: '',
  state: '',
  amount: 0,
  name: '',
  nr: true,
  eliminateDups: true,
  filterType: '',
  pageNo: 1,
  size: 100,
  order: 'asc',
  orderBy: '',
};

export const searchMoeaSlice = createSlice({
  name: 'searchMoea',
  initialState,
  reducers: {
    setMoeaSearch: (state, action: PayloadAction<SearchMOEAParams>) => {
      state.county = action.payload.county;
      state.state = action.payload.state;
      state.amount = action.payload.amount;
      state.name = action.payload.name;
      state.nr = action.payload.nr;
      state.eliminateDups = action.payload.eliminateDups;
      state.filterType = action.payload.filterType;
      state.pageNo = action.payload.pageNo || 1;
      state.size = action.payload.size || 100;
      state.order = action.payload.order || 'asc';
      state.orderBy = action.payload.orderBy || 'fileName';
    },
  },
});

export const { setMoeaSearch } = searchMoeaSlice.actions;

export default searchMoeaSlice.reducer;
