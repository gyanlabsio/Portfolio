import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchVisitors = createAsyncThunk(
  'visitorAnalytics/fetchVisitors',
  async (type, { rejectWithValue }) => {
    try {
      const endpoint = type ? `/analytics/visitors?type=${type}` : '/analytics/visitors';
      const response = await api.get(endpoint);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch visitors');
    }
  }
);

export const fetchVisitorDetails = createAsyncThunk(
  'visitorAnalytics/fetchVisitorDetails',
  async (visitorId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/analytics/visitors/${visitorId}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch visitor details');
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
  filters: {
    type: 'all' // 'all', 'anonymous', 'identified'
  },
  selectedVisitor: {
    profile: null,
    timeline: [],
    sessions: [],
    loading: false
  }
};

const visitorAnalyticsSlice = createSlice({
  name: 'visitorAnalytics',
  initialState,
  reducers: {
    setVisitorFilter: (state, action) => {
      state.filters.type = action.payload;
    },
    clearSelectedVisitor: (state) => {
      state.selectedVisitor = { profile: null, timeline: [], sessions: [], loading: false };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisitors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisitors.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchVisitors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchVisitorDetails.pending, (state) => {
        state.selectedVisitor.loading = true;
      })
      .addCase(fetchVisitorDetails.fulfilled, (state, action) => {
        state.selectedVisitor.loading = false;
        state.selectedVisitor.profile = action.payload.profile;
        state.selectedVisitor.timeline = action.payload.timeline;
        state.selectedVisitor.sessions = action.payload.sessions;
      })
      .addCase(fetchVisitorDetails.rejected, (state) => {
        state.selectedVisitor.loading = false;
      });
  },
});

export const { setVisitorFilter, clearSelectedVisitor } = visitorAnalyticsSlice.actions;
export default visitorAnalyticsSlice.reducer;
