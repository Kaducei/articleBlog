/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false,
  pagCounter: 0,
};

const loginSlice = createSlice({
  name: 'loginSlice',
  initialState,
  reducers: {
    logIn(state) {
      state.isLogin = true;
    },
    logOut(state) {
      state.isLogin = false;
    },
    pagUp(state, action) {
      state.pagCounter = (action.payload - 1) * 5;
    },
  },
});
export default loginSlice.reducer;
export const { logIn, logOut, pagUp } = loginSlice.actions;
