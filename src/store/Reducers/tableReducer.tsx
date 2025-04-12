import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TableState {
  visibleColumns: Record<string, string[]>;
  columnOrder: Record<string, string[]>;
}

const initialState: TableState = {
  visibleColumns: {},
  columnOrder: {},
};

export const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    // Action to set visibility for a specific table
    setTableVisibleColumns: (
      state,
      action: PayloadAction<{ tableId: string; columns: string[] }>
    ) => {
      const { tableId, columns } = action.payload;
      state.visibleColumns[tableId] = columns;
    },
    // Action to initialize visibility for a new table
    initializeTableVisibility: (
      state,
      action: PayloadAction<{ tableId: string; allColumns: string[] }>
    ) => {
      const { tableId, allColumns } = action.payload;
      if (!state.visibleColumns[tableId]) {
        // Default: all columns visible
        state.visibleColumns[tableId] = allColumns;
      }
      if (!state.columnOrder[tableId]) {
        state.columnOrder[tableId] = allColumns; // Initialize order
      }
    },
    setColumnOrder: (
      state,
      action: PayloadAction<{ tableId: string; columns: string[] }>
    ) => {
      const { tableId, columns } = action.payload;
      state.columnOrder[tableId] = columns;
    },
    resetTableState: (state, action: PayloadAction<{ tableId: string }>) => {
      const { tableId } = action.payload;
      delete state.visibleColumns[tableId];
      delete state.columnOrder[tableId];
    },
  },
});

export const {
  setTableVisibleColumns,
  initializeTableVisibility,
  setColumnOrder,
  resetTableState,
} = tableSlice.actions;
export default tableSlice.reducer;
