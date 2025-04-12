import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedContactsState {
  selectedContacts: number[];
  sortBy?: string;
  sortOrder?: string;
}

const initialState: SelectedContactsState = {
  selectedContacts: [],
  sortBy: '',
  sortOrder: '',
};

const selectedContactsSlice = createSlice({
  name: 'selectedContacts',
  initialState,
  reducers: {
    setSelectedContacts(state, action: PayloadAction<number[]>) {
      state.selectedContacts = action.payload;
    },
    toggleSelectedContact(state, action: PayloadAction<number>) {
      const index = state.selectedContacts.indexOf(action.payload);
      if (index !== -1) {
        state.selectedContacts.splice(index, 1);
      } else {
        state.selectedContacts.push(action.payload);
      }
    },
    clearSelectedContacts(state) {
      state.selectedContacts = [];
      state.sortBy = '';
      state.sortOrder = '';
    },
    setSelectedContactsSort(
      state,
      action: PayloadAction<{ sortBy: string; sortOrder: string }>
    ) {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
  },
});

export const {
  setSelectedContacts,
  toggleSelectedContact,
  clearSelectedContacts,
  setSelectedContactsSort,
} = selectedContactsSlice.actions;

export default selectedContactsSlice.reducer;
