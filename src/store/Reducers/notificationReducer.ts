import { createSlice } from '@reduxjs/toolkit';
import { notificationApi } from '../Services/notificationService';

interface notification {
  subscriberHash: string;
}
const initialState: notification = {
  subscriberHash: '',
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(
      notificationApi.endpoints.getSubscriberHMACHash.matchFulfilled,
      (state, response) => {
        state.subscriberHash = response.payload.data.subscriberHash;
      }
    );
  },
});

export default notificationSlice.reducer;
