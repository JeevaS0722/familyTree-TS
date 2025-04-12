import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecentOfferData } from '../../interface/offer';

interface RecentOfferState {
  recentOffers: RecentOfferData[];
}

const initialState: RecentOfferState = {
  recentOffers: [],
};

const recentOfferSlice = createSlice({
  name: 'recentOffer',
  initialState,
  reducers: {
    setRecentOffers: (state, action: PayloadAction<RecentOfferData[]>) => {
      state.recentOffers = action.payload;
    },
    clearRecentOffers: state => {
      state.recentOffers = [];
    },
  },
});

export const { setRecentOffers, clearRecentOffers } = recentOfferSlice.actions;

export default recentOfferSlice.reducer;
