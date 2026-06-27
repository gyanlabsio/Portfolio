import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  kpis: {
    pageViews: 0,
    clicks: 0,
    formSubmissions: 0,
    visitors: 0
  },
  loading: false,
  error: null,
};

const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    setMetricsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setMetricsData: (state, action) => {
      state.kpis = action.payload;
      state.error = null;
    },
    setMetricsError: (state, action) => {
      state.error = action.payload;
    }
  },
});

export const { setMetricsLoading, setMetricsData, setMetricsError } = metricsSlice.actions;

export default metricsSlice.reducer;
