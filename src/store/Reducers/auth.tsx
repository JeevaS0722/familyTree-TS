import { createSlice } from '@reduxjs/toolkit';
import { authAPI, authHelperAPI } from '../Services/auth';

interface auth {
  isLoggedIn: boolean;
}
const initialState: auth = {
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: state => {
      state.isLoggedIn = true;
    },
    logout: state => {
      state.isLoggedIn = false;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(authAPI.endpoints.login.matchFulfilled, state => {
      state.isLoggedIn = true;
    }),
      builder.addMatcher(authAPI.endpoints.logout.matchFulfilled, state => {
        state.isLoggedIn = false;
        window.location.reload();
      }),
      builder.addMatcher(
        authHelperAPI.endpoints.verifySignedIn.matchFulfilled,
        state => {
          state.isLoggedIn = true;
        }
      );
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
