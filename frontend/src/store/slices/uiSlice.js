import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  drillDownActive: false,
  drillDownData: null, // e.g. { type: 'PAGE_VIEW', metric: 'count' }
  exportModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setDrillDown: (state, action) => {
      state.drillDownActive = action.payload.active;
      state.drillDownData = action.payload.data || null;
    },
    setExportModalOpen: (state, action) => {
      state.exportModalOpen = action.payload;
    }
  },
});

export const { setDrillDown, setExportModalOpen } = uiSlice.actions;

export default uiSlice.reducer;
