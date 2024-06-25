import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  LoginaccessData: null,
  Usertype: null,
  token: null,
  checkindata: null,
};

export const { actions, reducer } = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleAccessData: (state, action) => {
      state.LoginaccessData = action.payload;
    },
    handleUserType: (state, action) => {
      state.Usertype = action.payload;
    },
    handleStoreToken: (state, action) => {
      state.token = action.payload;
    },
    handleCheckIndata: (state, action) => {
      state.checkindata = action.payload;
    },
  },
});

export const {
  handleAccessData,
  handleUserType,
  handleStoreToken,
  handleCheckIndata,
} = actions;

export default reducer;
