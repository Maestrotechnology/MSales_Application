import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  modalloading: false,
  sessionmodal: false,
  requestFilters: null,
  preventiveFilters: null,

  CustomerFilters: {
    page: 1,
    size: 50,
    filters: null,
  },
  LeadsFilters: {
    page: 1,
    size: 50,
    filters: null,
  },
  NotificationFilters: {
    page: 1,
    size: 50,
    filters: null,
  },
};

export const { actions, reducer } = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    handleLoading: (state, action) => {
      state.loading = action.payload;
    },
    handleCustomerFilters: (state, action) => {
      state.CustomerFilters = action.payload;
    },
    handleLeadsFilters: (state, action) => {
      state.LeadsFilters = action.payload;
    },
    handleNotificationFilters: (state, action) => {
      state.NotificationFilters = action.payload;
    },
    handleSessionModal: (state, action) => {
      state.sessionmodal = action.payload;
    },
    handleClearRedux: (state) => {
      state.CustomerFilters = {
        page: 1,
        size: 50,
        filters: null,
      };
      state.LeadsFilters = {
        page: 1,
        size: 50,
        filters: null,
      };
      state.NotificationFilters = {
        page: 1,
        size: 50,
        filters: null,
      };
    },
  },
});

export const {
  handleLoading,
  handleCustomerFilters,
  handleClearRedux,
  handleLeadsFilters,
  handleNotificationFilters,
  handleSessionModal,
} = actions;

export default reducer;
