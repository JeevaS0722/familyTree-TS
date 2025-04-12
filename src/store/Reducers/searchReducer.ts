import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SearchObject } from '../../interface/searchOperator';

const initialState: { [key: string]: object } = {};

export const searchFiltersSlice = createSlice({
  name: 'searchFilters',
  initialState,
  reducers: {
    setSearchFilter: (state, action: PayloadAction<SearchObject>) => {
      const { tableId, filters } = action.payload;
      return {
        ...state,
        [tableId]: {
          ...state[tableId],
          ...filters,
        },
      };
    },
    clearSearchFilters: () => {
      return initialState;
    },
  },
});
export const { setSearchFilter, clearSearchFilters } =
  searchFiltersSlice.actions;

export default searchFiltersSlice.reducer;
