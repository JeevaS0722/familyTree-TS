import { createSlice } from '@reduxjs/toolkit';
import { userInfo } from '../../interface/user';
import { userAPI } from '../Services/userService';

const initialState: userInfo = {
  fullName: '',
  teamMateId: '',
  department: '',
  userId: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(
      userAPI.endpoints.getUser.matchFulfilled,
      (state, response) => {
        state.fullName = response.payload.data.fullName;
        state.department = response.payload.data.department;
        state.teamMateId = response.payload.data.teamMateId;
        state.userId = response.payload.data.userId;
      }
    );
  },
});

export default userSlice.reducer;
