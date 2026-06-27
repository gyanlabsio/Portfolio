import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  stage: '',
  status: '',
  tags: [],
};

const crmFilterSlice = createSlice({
  name: 'crmFilter',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setStage: (state, action) => {
      state.stage = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setFilterTags: (state, action) => {
      state.tags = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const { 
  setSearchQuery, 
  setStage, 
  setStatus, 
  setFilterTags, 
  resetFilters 
} = crmFilterSlice.actions;

export default crmFilterSlice.reducer;
