import { combineReducers } from "@reduxjs/toolkit";
import DashboardReducer from "../Reducers/DashboardReducers";
import AuthReducer from "../Reducers/AuthReducers";

export const rootReducer = combineReducers({
  auth: AuthReducer,
  dashboard: DashboardReducer,
});
