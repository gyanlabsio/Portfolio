import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeDashboard: 'OVERVIEW',
  savedViews: [], // e.g. { id, name, filterState }
  layout: {
    showKpis: true,
    showCharts: true,
    showDataTable: true,
  }
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setActiveDashboard: (state, action) => {
      state.activeDashboard = action.payload;
    },
    setSavedViews: (state, action) => {
      state.savedViews = action.payload;
    },
    addSavedView: (state, action) => {
      state.savedViews.push(action.payload);
    },
    toggleWidget: (state, action) => {
      const widget = action.payload;
      if (state.layout[widget] !== undefined) {
        state.layout[widget] = !state.layout[widget];
      }
    }
  },
});

export const { setActiveDashboard, setSavedViews, addSavedView, toggleWidget } = dashboardSlice.actions;

export default dashboardSlice.reducer;
