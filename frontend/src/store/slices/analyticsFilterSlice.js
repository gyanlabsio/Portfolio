import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dateRange: { start: '', end: '' }, // e.g. 'YYYY-MM-DD'
  searchQuery: '',
  category: 'ALL',
  status: 'ALL',
  viewMode: 'SUMMARY', // SUMMARY, DETAILED
};

const analyticsFilterSlice = createSlice({
  name: 'analyticsFilter',
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const { setDateRange, setSearchQuery, setCategory, setStatus, setViewMode, resetFilters } = analyticsFilterSlice.actions;

export default analyticsFilterSlice.reducer;
