import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  timeSeriesData: [],
  modulesData: [],
  loading: false,
  error: null,
};

const chartsSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {
    setChartsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setTimeSeriesData: (state, action) => {
      state.timeSeriesData = action.payload;
      state.error = null;
    },
    setModulesData: (state, action) => {
      state.modulesData = action.payload;
      state.error = null;
    },
    setChartsError: (state, action) => {
      state.error = action.payload;
    }
  },
});

export const { setChartsLoading, setTimeSeriesData, setModulesData, setChartsError } = chartsSlice.actions;

export default chartsSlice.reducer;
