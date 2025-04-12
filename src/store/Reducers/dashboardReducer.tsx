import { createSlice } from '@reduxjs/toolkit';
import { dashboardAPI } from '../Services/dashboardService';
import { reducerState } from '../../interface/dashboard';

const initialState: reducerState = {
  actions: [],
  metrics: [],
  layout: {
    metrics: [],
    actions: [],
  },
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(
      dashboardAPI.endpoints.getDashboardActions.matchFulfilled,
      (state, response) => {
        state.actions = response.payload.data.actions;
      }
    );
    builder.addMatcher(
      dashboardAPI.endpoints.getDashboardMetrics.matchFulfilled,
      (state, response) => {
        state.metrics = response.payload.data.metrics;
      }
    );
    builder.addMatcher(
      dashboardAPI.endpoints.getDashboardLayout.matchFulfilled,
      (state, response) => {
        state.layout = response.payload.data;
      }
    );
  },
});

export default dashboardSlice.reducer;
